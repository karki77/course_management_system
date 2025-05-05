"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const library_1 = require("@prisma/client/runtime/library");
const httpException_1 = __importDefault(require("../utils/api/httpException"));
const errorMiddleware = (error, _req, res, next) => {
    console.error('Error caught in middleware:', error);
    // Check if res.status is a function
    if (typeof res.status !== 'function') {
        console.error('res.status is not a function. res object:', res);
        // Attempt to use res.writeHead and res.end as a fallback
        try {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: 'Internal Server Error',
                details: 'Error handling middleware encountered an unexpected issue.',
            }));
        }
        catch (fallbackError) {
            console.error('Failed to send fallback response:', fallbackError);
            next(error); // Pass the original error to the default Express error handler
        }
        return;
    }
    // Rest of the error handling logic
    if (error instanceof library_1.PrismaClientKnownRequestError) {
        return res.status(400).json({
            success: false,
            message: 'Database Error',
        });
    }
    if (error instanceof httpException_1.default) {
        const statusCode = error.status || 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error',
            // stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        });
    }
    // For any other type of error
    return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    });
};
exports.default = errorMiddleware;
