"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const httpException_1 = __importDefault(require("./api/httpException"));
const uploadDir = path_1.default.resolve(process.cwd(), 'uploads');
// Ensure uploads directory exists
try {
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
        console.log(`Created upload directory: ${uploadDir}`);
    }
    else {
        console.log(`Upload directory already exists: ${uploadDir}`);
    }
}
catch (error) {
    console.error(`Error creating upload directory: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error('Failed to create upload directory');
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const suffix = Date.now();
        cb(null, suffix + '-' + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    // Accept images, documents, and other common file types
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        throw new httpException_1.default(415, 'Unsupported media type!');
    }
};
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
exports.default = upload;
