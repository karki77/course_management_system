import { prisma } from '../../config/setup/dbSetup';
import HttpException from '../../utils/api/httpException';
import { ICreateEnrollmentSchema } from './enrollmentValidation';
import { pagination, getPageDocs } from '../../utils/pagination/pagination';
import { IPaginationSchema } from '#utils/validators/commonValidation';
class EnrollmentService {
  async enroll(data: ICreateEnrollmentSchema) {
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

  async countEnrolledUsers(courseId: string) {
    return await prisma.courseEnrollment.count({
      where: { courseId },
    });
  }

  async getAllEnrolledUsers(courseId: string, query: IPaginationSchema) {
    const { skip, limit, page } = pagination({
      limit: query.limit,
      page: query.page,
    });

    const [enrollments, count] = await Promise.all([
      await prisma.courseEnrollment.findMany({
        where: { courseId },
        select: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
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
        take: limit,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      await prisma.courseEnrollment.count({
        where: { courseId },
      }),
    ]);

    const docs = getPageDocs({
      page,
      limit,
      count,
    });

    //
    return {
      enrollments,
      docs,
    };
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
    return enrollments;
  }
}

export default new EnrollmentService();
