"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const httpException_1 = __importDefault(require("../../utils/api/httpException"));
const service_1 = require("../../utils/email/service");
class EnrollmentService {
    async enroll(userId, data) {
        // Check if the user is a student
        const user = await config_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new httpException_1.default(404, 'Student not found');
        }
        if (user.role !== 'STUDENT') {
            throw new httpException_1.default(403, 'Only students can enroll in courses');
        }
        // Check if course exists
        const course = await config_1.prisma.course.findUnique({
            where: { id: data.courseId },
        });
        if (!course) {
            throw new httpException_1.default(404, 'Course not found');
        }
        // Check for duplicate enrollment
        const existingEnrollment = await config_1.prisma.courseEnrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId: data.courseId,
                },
            },
        });
        if (existingEnrollment) {
            throw new httpException_1.default(400, 'You are already enrolled in this course');
        }
        await config_1.prisma.courseEnrollment.create({
            data: {
                userId,
                courseId: data.courseId,
            },
        });
        if (!user.email) {
            throw new httpException_1.default(400, 'User email not found');
        }
        await (0, service_1.sendEmail)({
            to: user.email, // dynamically send to the enrolled user
            subject: `Enrollment Confirmation - ${course.title}`,
            text: `You have successfully enrolled in the course: ${course.title}`,
            html: `
        <h2>Hi ${user.username},</h2>
        <p>You've successfully enrolled in <strong>${course.title}</strong>.</p>
        <p>Happy Learning!</p>
      `,
        });
        return {
            message: 'Enrollment successful',
            courseId: data.courseId,
        };
    }
}
exports.default = new EnrollmentService();
