"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpException_1 = __importDefault(require("../utils/api/httpException"));
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            throw new httpException_1.default(401, 'Authentication required');
        }
        const token = authHeader.split(' ')[1];
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_ACCESS);
        // Add user to request object
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new httpException_1.default(401, 'Invalid or expired token'));
        }
        else {
            next(error);
        }
    }
};
exports.authMiddleware = authMiddleware;
// Generate JWT token
const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    const accessToken = jsonwebtoken_1.default.sign({ ...payload }, process.env.JWT_SECRET_ACCESS, { expiresIn: '7d' });
    const refreshToken = jsonwebtoken_1.default.sign({ ...payload }, process.env.JWT_SECRET_REFRESH, { expiresIn: '15d' });
    //
    return { accessToken, refreshToken };
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        throw new httpException_1.default(401, 'Invalid or expired token');
    }
};
exports.verifyToken = verifyToken;
