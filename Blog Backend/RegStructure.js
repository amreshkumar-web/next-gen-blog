const mongoose = require("mongoose"); 

const regDb = new mongoose.Schema({
    Name: String,
    Email: String,
    Password: String,
    ProfileImage:String,
    Date: {
        type: Date,
        default: Date.now
    }
}, {collection: 'AccessQueue' }); 

module.exports = mongoose.model('AccessQueue', regDb);
