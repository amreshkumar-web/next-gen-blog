const mongoose=require("mongoose");

const adminDb = new mongoose.Schema({
    Name: {
        type: String,
        required: true, // Name is required
        trim: true
    },
    Email: {
        type: String,
        required: true, // Email is required
        unique: true,   // Ensure uniqueness
        lowercase: true
    },
    Password: {
        type: String,
        required: true  // Password is required
    },
    Access: {
        type: String,
        required: true, // Access is required
        enum: ['owner', 'editor', 'viewer'] // Only these values are allowed
    },
    JoinDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    ProfileImg:String
}, { collection:'AdminData'})

module.exports = mongoose.model('AdminData',adminDb);