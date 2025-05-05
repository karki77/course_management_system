"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalErrorHandler = async (err, req, res, next) => {
    const statusCode = err.status ?? 500;
    res.status(statusCode).json({
        success: false,
        message: err?.message ?? 'Something went wrong',
        originalError: err?.stack,
    });
};
exports.default = globalErrorHandler;
// change password ->
// user should be authenticated.
// user -> previous password should be correct
// user -> new password should be different from previous password
// user -> new password should be strong enough
// user -> new password should be hashed before saving to db
// user -> new password should be saved to db
// payload // req.body -> oldPassword, newPassword
// logger ->
// nodejs -> node 22 ki 20.
