const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require("dotenv").config();
const axios = require("axios");
const mongoose = require('mongoose');
const userModel = require('./models/user');
const ngoModel = require('./models/ngoUser');
const Issue = require('./models/issue');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// Middleware setup
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Initialize Gemini AI

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define the IssueByGemini model (only if not already defined)
const issueSchema = new mongoose.Schema({
    userId: String,
    issueType: String,
    description: String,
    location: String,
    photoURL: String,
    response: String,
    assignedNGO: String,
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now },
});

const IssueByGemini = mongoose.models.Issue || mongoose.model('IssueGemini', issueSchema);

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Routes
app.get('/', (req, res) => {
    res.send("Welcome to the backend server");
});

// Chat route with Gemini AI
// Chat route with Gemini AI
// Add this improved /chat endpoint to your server
// Import the IssueByGemini model at the top of your file
// const IssueByGemini = require('./models/issueByGemini');

// Replace your current /chat endpoint with this improved version
// Store user conversation state in memory or database
const userConversations = {};

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(message);
        const geminiResponse = await result.response.text();

        // Store to DB as General Inquiry if needed here

        res.status(200).json({
            status: "success",
            prompt: message,
            reply: geminiResponse,
        });
    } catch (error) {
        console.error("Gemini API error:", error.message || error);
        res.status(500).json({
            status: "error",
            message: "Failed to generate response from Gemini",
            details: error.message || error,
        });
    }
});

// Razorpay order route
app.post('/razorpay/order', async (req, res) => {
    const { amount } = req.body;

    try {
        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: 'order_receipt_' + new Date().getTime(),
            payment_capture: 1,
        };

        const order = await razorpay.orders.create(options);

        res.json({
            id: order.id,
            amount: order.amount / 100,
            currency: order.currency,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating Razorpay order');
    }
});

// Signup route
app.post('/Signup', async (req, res) => {
    try {
        let isUser = false;
        let { name, email, password, userType } = req.body;

        if (!name || !email || !password) {
            return res.status(200).json({ success: false, message: "All fields are required" });
        }

        if (userType === 'user') {
            isUser = true;
            const userPresent = await userModel.findOne({ email });
            if (userPresent) {
                return res.status(200).json({ success: false, message: "User already exist" });
            }
        } else {
            const ngoPresent = await ngoModel.findOne({ email });
            if (ngoPresent) {
                return res.status(200).json({ success: false, message: "NGO already exist" });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let user = null, ngo = null;

        if (isUser) {
            user = await userModel.create({ name, email, password: hashedPassword });
        } else {
            ngo = await ngoModel.create({ name, email, password: hashedPassword });
        }

        // Setup nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,  // Your Gmail address
                pass: process.env.EMAIL_PASS,  // Your app password (not your real Gmail password)
            },
        });

        // Define the mail options
        const mailOptions = {
            from: `"CareLink Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to CareLink!',
            text: `Hi ${name},\n\nThank you for registering at CareLink as a ${userType}.\n\nWe’re happy to have you on board! 😊\n\nRegards,\nCareLink Team`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('❌ Email not sent:', error.message);
            } else {
                console.log('✅ Email sent successfully:', info.response);
            }
        });

        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax"
        });

        if (isUser) {
            res.status(200).json({ success: true, message: "User registered successfully", user, isUser });
        } else {
            res.status(200).json({ success: true, message: "NGO registered successfully", ngo, isUser });
        }

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Login route
app.post('/Login', async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        if (!email || !password || !userType) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (userType === 'admin') {
            if (email === "junaid@admin.com" && password === 'junni') {
                const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "Lax"
                });
                res.status(200).json({ success: true, message: "Login successful", userType, token });
            } else {
                return res.status(401).json({ success: false, message: "Invalid Admin Credentials" });
            }
        }

        let user = null;

        if (userType === 'user') {
            user = await userModel.findOne({ email });
        } else if (userType === 'ngo') {
            user = await ngoModel.findOne({ email });
        }

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax"
        });

        res.status(200).json({ success: true, message: "Login successful", user, userType, token });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Report issue route
app.post('/report', async (req, res) => {
    try {
        const {
            title,
            description,
            date,
            time,
            location,
            submissionLocation,
            issueType,
            urgencyLevel,
            expectedImpact,
            image
        } = req.body;

        // Validate required fields
        const requiredFields = {
            title,
            description,
            date,
            time,
            location,
            submissionLocation,
            issueType,
            urgencyLevel,
            expectedImpact
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Create new issue with default image if none provided
        const newIssue = new Issue({
            title,
            description,
            date: new Date(date),
            time,
            location,
            submissionLocation,
            issueType,
            urgencyLevel,
            expectedImpact,
            image: image || 'default-issue-image.jpg',
            status: 'pending',
            verificationStatus: {
                isVerified: false
            }
        });

        const savedIssue = await newIssue.save();

        res.status(201).json({
            success: true,
            message: "Issue created successfully",
            issue: savedIssue
        });

    } catch (error) {
        console.error("Error creating issue:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});

// Get all issues route
app.get('/issues', async (req, res) => {
    try {
        console.log('Fetching issues...');
        const issues = await Issue.find()
            .sort({ createdAt: -1 })
            .lean();

        // Transform the data to match the new schema
        const transformedIssues = issues.map(issue => {
            // If location is an object, convert it to a string
            if (issue.location && typeof issue.location === 'object') {
                issue.location = issue.location.address || 'Unknown Location';
            }

            // If submissionLocation is an object, convert it to a string
            if (issue.submissionLocation && typeof issue.submissionLocation === 'object') {
                issue.submissionLocation = issue.submissionLocation.address || 'Unknown Location';
            }

            // Ensure verificationStatus exists
            if (!issue.verificationStatus) {
                issue.verificationStatus = {
                    isVerified: false
                };
            }

            return issue;
        });

        console.log('Found and transformed issues:', transformedIssues);
        res.status(200).json({
            success: true,
            issues: transformedIssues
        });
    } catch (error) {
        console.error("Error fetching issues:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
            stack: error.stack
        });
    }
});

// Verify/Accept/Reject an issue route
app.post('/issues/:issueId/verify', async (req, res) => {
    try {
        const { issueId } = req.params;
        const { action, note } = req.body;

        // Get NGO info from token
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const ngo = await ngoModel.findOne({ email: decoded.email });

        if (!ngo) {
            return res.status(401).json({
                success: false,
                message: "NGO not found"
            });
        }

        const issue = await Issue.findById(issueId);
        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found"
            });
        }

        // Update issue verification status
        issue.status = action === 'accept' ? 'accepted' : 'rejected';
        issue.verificationStatus = {
            isVerified: true,
            verifiedBy: ngo._id,
            verifiedAt: new Date(),
            verificationNote: note
        };

        if (action === 'accept') {
            issue.assignedNGO = {
                ngoId: ngo._id,
                ngoName: ngo.name,
                assignedAt: new Date()
            };
        }

        await issue.save();

        res.status(200).json({
            success: true,
            message: `Issue ${action}ed successfully`,
            issue
        });

    } catch (error) {
        console.error("Error verifying issue:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});

// Logout route
app.post('/logout', (req, res) => {
    try {
        // Clear the authentication cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax'
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "Error during logout"
        });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});