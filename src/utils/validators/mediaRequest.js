"use strict";
// media request
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaRequest = void 0;
const httpException_1 = __importDefault(require("../api/httpException"));
/**
 * Media Request Middleware
 */
const mediaRequest = (req, _res, next) => {
    try {
        const file = req?.file;
        const bio = req.body?.bio;
        if (!file) {
            throw new httpException_1.default(400, 'File is required');
        }
        const payload = {
            image: file?.filename,
            bio,
        };
        req.body = payload;
        next();
    }
    catch (error) {
        next(error);
        console.log(error);
    }
};
exports.mediaRequest = mediaRequest;
