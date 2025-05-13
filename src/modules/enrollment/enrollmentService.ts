import { title } from 'process';
import { prisma } from '../../config/prismaClient';
import HttpException from '../../utils/api/httpException';
import { sendEmail } from '../../utils/email/service';
import { ICreateEnrollmentSchema } from './enrollmentValidation';

class EnrollmentService {
  async enroll(instructorId: string, data: ICreateEnrollmentSchema) {
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

  async getAllEnrolledUsers(courseId: string) {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { courseId },
      include: {
        user: true,
        course: {
          select: {
            id: true,
            title: true,
            duration: true,
            period: true,
            module: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    return enrollments.map((enrollment) => ({
      student: enrollment.user,
      course: enrollment.course.title,
      duration: enrollment.course.duration,
      period: enrollment.course.period,
      modules: enrollment.course.module,
    }));
  }

  async viewAllEnrolledCourses(studentId: string) {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { userId: studentId },
      include: {
        user: true,
        course: {
          select: {
            id: true,
            title: true,
            duration: true,
            period: true,
            module: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    return enrollments.map((enrollment) => ({
      courseId: enrollment.course.id,
      courseTitle: enrollment.course.title,
      duration: enrollment.course.duration,
      period: enrollment.course.period,
      modules: enrollment.course.module,
    }));
  }
}

export default new EnrollmentService();
