const cloudinary = require('cloudinary').v2;
require("dotenv").config();
console.log("Cloudinary Name:",process.env.CLOUDINARY_NAME);
console.log("API Key:",process.env.CLOUDINARY_API_KEY);
console.log("Secret Key:",process.env.CLOUDINARY_SECRET_API_KEY);
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME.trim(),
    api_key:process.env.CLOUDINARY_API_KEY.trim(),
    api_secret:process.env.CLOUDINARY_SECRET_API_KEY.trim() 
})

module.exports = cloudinary; 