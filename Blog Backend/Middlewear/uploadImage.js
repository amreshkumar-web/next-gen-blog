const fs = require("fs");
const multer = require("multer");
const path = require("path");

const uploadDir = path.join(__dirname, "../upload");


// ✅ Ensure the upload folder exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Get the extension from original filename
        let ext = path.extname(file.originalname);
        
        // If no extension exists, derive it from MIME type
        if (!ext || ext === '') {
            console.log("No extension found, using MIME type:", file.mimetype);
            
            // Map common MIME types to extensions
            const mimeToExt = {
                'image/jpeg': '.jpg',
                'image/png': '.png',
                'image/gif': '.gif',
                'image/webp': '.webp',
                'image/svg+xml': '.svg',
                // Add more as needed
            };
            
            ext = mimeToExt[file.mimetype] || '.bin';
        }
        
        // Get base name without extension
        const baseName = path.basename(
            file.originalname.replace(/\s+/g, '_'), // Replace spaces with underscores
            ext
        );
        
        console.log("MIME Type:", file.mimetype);
        console.log("Base name:", baseName);
        console.log("Extension:", ext);
        
        // Create filename with timestamp, base name, and extension
        const filename = `${Date.now()}_${baseName}${ext}`;
        console.log("Final filename:", filename);
        
        cb(null, filename);
    }
});

// ✅ File filter to validate uploads
const fileFilter = (req, file, cb) => {
    // Accept images, PDFs, etc.
    if (file.mimetype.startsWith('image/') || 
        file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
};

// ✅ Export Middleware for Single Image Upload
const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

module.exports = {
    uploadSingle: upload.single("image") // Single File Upload Middleware
};