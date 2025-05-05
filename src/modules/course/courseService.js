"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const httpException_1 = __importDefault(require("../../utils/api/httpException"));
class CourseService {
    async createCourse(instructorId, data) {
        const existingCourse = await config_1.prisma.course.findFirst({
            where: {
                title: data.title,
            },
        });
        if (existingCourse) {
            throw new httpException_1.default(400, 'Course with this title already exists');
        }
        // check if the user is an instructor
        const user = await config_1.prisma.user.findUnique({
            where: { id: instructorId },
        });
        if (!user) {
            throw new httpException_1.default(404, 'User not found');
        }
        const course = await config_1.prisma.course.create({
            data: {
                title: data.title,
                content: data.content,
                duration: data.duration,
                period: data.period,
                instructorId,
            },
        });
        //
        return course;
    }
    async updateCourse(instructorId, courseId, data) {
        const course = await config_1.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course) {
            throw new httpException_1.default(404, 'Course not found');
        }
        if (course.instructorId !== instructorId) {
            throw new httpException_1.default(403, 'You are not authorized to update this course');
        }
        const updatedCourse = await config_1.prisma.course.update({
            where: { id: courseId },
            data: {
                title: data.title,
                content: data.content,
                duration: data.duration,
                period: data.period,
            },
        });
        return updatedCourse;
    }
}
exports.default = new CourseService();
