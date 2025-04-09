const mongoose = require('mongoose');

const responsibleMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  }
});

const presidentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  }
});

const ngoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  ngoName: {
    type: String,
    required: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  president: {
    type: presidentSchema,
    required: true
  },
  responsibleMembers: {
    type: [responsibleMemberSchema],
    validate: [arrayLimit, 'Exceeds the limit of 5 responsible members']
  },
  totalMembers: {
    type: Number,
    required: true,
    min: 1
  },
  strength: {
    type: String,
    required: true,
    enum: ['small', 'medium', 'large', 'very_large']
  },
  pastWorks: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

function arrayLimit(val) {
  return val.length <= 5;
}

// Hash password before saving
ngoSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
ngoSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('NGO', ngoSchema);