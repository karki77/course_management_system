import multer from 'multer';

// Define storage settings (e.g., storage in 'uploads' folder with original file name)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // where to store the uploaded files // __dirname(,,)
  },
  filename: (req, file, cb) => {
    const suffix = Date.now();
    cb(null, suffix + '-' + file.originalname); // Use timestamp to prevent name conflicts
  }
});

// Create the multer upload middleware
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit, adjust as needed
});

export default upload;
