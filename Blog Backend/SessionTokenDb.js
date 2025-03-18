const mongoose = require("mongoose"); 

const sessionTokenDb = new mongoose.Schema({
    UserId: {
        type: String,
        unique: true,  // Ensures UserId is unique
        required: true,
        index: true
    },
    FingerPrint:String,
    RefreshToken:String,
    SessionSecret:String,
    Date: {
        type: Date,
        default: Date.now
    }
}, {collection: 'SessionToken' }); 

module.exports = mongoose.model('SessionToken', sessionTokenDb);