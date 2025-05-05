"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourse = exports.createCourse = void 0;
const httpResponse_1 = require("../../utils/api/httpResponse");
const courseService_1 = __importDefault(require("./courseService"));
const httpException_1 = __importDefault(require("../../utils/api/httpException"));
const createCourse = async (req, res, next) => {
    try {
        const instructorId = req.user?.id;
        if (!instructorId) {
            throw new httpException_1.default(401, 'User not authenticated');
        }
        const course = await courseService_1.default.createCourse(instructorId, req.body);
        res.send(new httpResponse_1.HttpResponse({
            message: 'Course created successfully',
            data: course,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.createCourse = createCourse;
const updateCourse = async (req, res, next) => {
    try {
        const instructorId = req.user?.id;
        if (!instructorId) {
            throw new httpException_1.default(401, 'User not authenticated');
        }
        const courseId = req.params.courseId;
        if (!courseId) {
            throw new httpException_1.default(400, 'Course ID is required');
        }
        const updatedCourse = await courseService_1.default.updateCourse(instructorId, courseId, req.body);
        res.send(new httpResponse_1.HttpResponse({
            message: 'Course updated successfully',
            data: updatedCourse,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.updateCourse = updateCourse;
