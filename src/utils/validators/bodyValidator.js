"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
/**
 * Body validator
 */
const bodyValidator = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
        return;
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const firstErrorMessage = error?.issues[0]?.message || 'Invalid input';
            //
            res.status(400).json({
                success: false,
                message: firstErrorMessage,
                errors: error.issues,
            });
            return;
        }
        //
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred.',
        });
    }
};
exports.default = bodyValidator;
