"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enroll = void 0;
const httpResponse_1 = require("../../utils/api/httpResponse");
const httpException_1 = __importDefault(require("../../utils/api/httpException"));
const enrollmentService_1 = __importDefault(require("./enrollmentService"));
const enroll = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new httpException_1.default(401, 'User not authenticated');
        }
        const enrollment = await enrollmentService_1.default.enroll(userId, req.body);
        res.send(new httpResponse_1.HttpResponse({
            message: enrollment.message,
            data: enrollment,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.enroll = enroll;
