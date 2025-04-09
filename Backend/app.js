const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require("dotenv").config();
const axios = require("axios");
const mongoose = require('mongoose');
const userModel = require('./models/user');
const ngoModel = require('./models/ngoUser');
const Issue = require('./models/issue');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/carelink', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res)=>{
    res.send("Welcome to the backend server");
})

app.post('/Signup', async (req, res)=>{
    try {
        let isUser = false;
        let {name, email, password, userType } = req.body;

        if(!name || !email || !password){
            return res.status(200).json({success:false, message:"All fields are required"})
        }

        if(userType === 'user'){
            isUser = true;
            const userPresent = await userModel.findOne({email});
            if(userPresent){
                return res.status(200).json({success:false, message:"User already exist"})
            }
        }else{
            const ngoPresent = await ngoModel.findOne({email});
            if(ngoPresent){
                return res.status(200).json({success:false, message:"NGO already exist"})
            }
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let user, ngo = null;

        if(isUser){
             user = await userModel.create({ name, email, password: hashedPassword });
        }
        else{
            ngo = await ngoModel.create({ name, email, password: hashedPassword });
        }
        
        const token = jwt.sign({ email:email }, 'junni_key', { expiresIn: '1h' });

        res.cookie("token", token, {
            httpOnly: true,  
            secure: false,   
            sameSite: "Lax"  
        });
        if(isUser){
            res.status(200).json({ success:true, message: "User registered successfully", user, isUser });
        }
        else{
            res.status(200).json({ success:true, message: "NGO registered successfully", ngo, isUser });
        }
        
            
    } catch (error) {
        console.log("error")      
    }  
})

app.post('/Login', async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        if (!email || !password || !userType) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if(userType === 'admin'){
            if(email ==="junaid@admin.com" && password==='junni'){
                const token = jwt.sign({ email:email}, 'junni_key', { expiresIn: '1h' });
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "Lax"
                });
                res.status(200).json({ success: true, message: "Login successful",userType, token });
            }
            else{
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

        const token = jwt.sign({ email:email}, 'junni_key', { expiresIn: '1h' });

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

// Get all issues
app.get('/issues', async (req, res) => {
    try {
        console.log('Fetching issues...');
        const issues = await Issue.find()
            .sort({ createdAt: -1 })
            .lean(); // Convert to plain JavaScript objects
        
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

// Verify/Accept/Reject an issue
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

        const decoded = jwt.verify(token, 'junni_key');
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

app.listen(3000);