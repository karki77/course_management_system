"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
/**
 * Param validator
 */
const paramValidator = (schema) => (req, res, next) => {
    try {
        req.params = schema.parse(req.params);
        next();
        return;
    }
    catch (error) {
        const errorObj = error instanceof zod_1.ZodError ? error.flatten().fieldErrors : {};
        res.status(422).json({
            success: false,
            message: 'Param validation error!',
            errors: errorObj,
        });
        return;
    }
};
exports.default = paramValidator;
