"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
/**
 * Query validator
 */
const queryValidator = (schema) => (req, res, next) => {
    try {
        req.query = schema.parse(req.query);
        next();
        return;
    }
    catch (error) {
        const errorObj = error instanceof zod_1.ZodError ? error.flatten().fieldErrors : {};
        res.status(422).json({
            success: false,
            message: 'Query validation error!',
            errors: errorObj,
        });
        return;
    }
};
exports.default = queryValidator;
