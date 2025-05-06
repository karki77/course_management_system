import { prisma } from '../../config';
import HttpException from '../../utils/api/httpException';
import { sendEmail } from '../../utils/email/service';
import { ICreateEnrollmentSchema } from './enrollmentValidation';

class EnrollmentService {
  async enroll(instructorId: string, data:ICreateEnrollmentSchema) {
    // Check if the user is an instructor
    const instructor = await prisma.user.findUnique({
      where: { id: instructorId },
    });
    
    if (!instructor || instructor.role !== 'INSTRUCTOR') {
      throw new HttpException(403, 'User is not an instructor');
    }
    

    // check student is exist or not in database
    const student = await prisma.user.findUnique({
      where: { id: data.studentId },
    });
    if (!student) {
      throw new HttpException(404, 'Student not found');
    }
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
          userId: data.studentId,
          courseId: data.courseId,
        },
      },
    });
    if (existingEnrollment) {
      throw new HttpException(400, 'You are already enrolled in this course');
    }

    return await prisma.courseEnrollment.create({
      data: {
        userId: data.studentId,
        courseId: data.courseId,
      },
    });
  }
  async getAllEnrolledUsers() {
    const enrollments = await prisma.courseEnrollment.findMany({
      include: {
        user: {
          select: {
            id: true, // studentId
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            duration: true,
            period: true,
          },
        },
      },
    });

    return enrollments.map(enrollment => ({
      studentId: enrollment.user.id,
      course: enrollment.course.title,
      duration: enrollment.course.duration,
      period: enrollment.course.period,
    }));
  }
  
}



export default new EnrollmentService();
