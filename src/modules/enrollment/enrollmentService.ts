import { prisma } from '../../config';
import HttpException from '../../utils/api/httpException';
import { sendEmail } from '../../utils/email/service';
import { ICreateEnrollmentSchema } from './enrollmentValidation';

class EnrollmentService {
  async enroll(userId: string, data: ICreateEnrollmentSchema) {
    // Check if the user is a student
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new HttpException(404, 'Student not found');
    }

    if (user.role !== 'STUDENT') {
      throw new HttpException(403, 'Only students can enroll in courses');
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    });

    if (!course) {
      throw new HttpException(404, 'Course not found');
    }
    // Check for duplicate enrollment
    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: data.courseId,
        },
      },
    });
    if (existingEnrollment) {
      throw new HttpException(400, 'You are already enrolled in this course');
    }

    await prisma.courseEnrollment.create({
      data: {
        userId,
        courseId: data.courseId,
      },
    });

    if (!user.email) {
      throw new HttpException(400, 'User email not found');
    }

    await sendEmail({
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



export default new EnrollmentService();
