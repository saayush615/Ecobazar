import multer from 'multer';
import path from 'path';
import fs from 'fs'

// Upload directory and create it if doesnot exists
const uploadDir = 'uploads/products';
if(!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
};

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'Products' + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// file filter - only allow images
const fileFilter = (req,file,cb) => { 
    if(file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else{
        cb(new Error('Only image files are allowed!'), false);
    }
 };

 const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Limit number of files
    },
    fileFilter: fileFilter
});

export { upload };