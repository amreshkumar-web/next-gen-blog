const cloudinary = require('cloudinary').v2;
require("dotenv").config();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME.trim(),
    api_key:process.env.CLOUDINARY_API_KEY.trim(),
    api_secret:process.env.CLOUDINARY_SECRET_API_KEY.trim() 
})

module.exports = cloudinary; 