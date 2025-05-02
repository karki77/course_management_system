import { prisma } from '../../config';
import HttpException from '../../utils/api/httpException';
import { ICreateEnrollmentSchema } from './enrollmentValidation';

class EnrollmentService {
  async enroll(userId: string, data: ICreateEnrollmentSchema) {
    // Check if the user is a student
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new HttpException(404, 'Student not found');
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
  }
}
