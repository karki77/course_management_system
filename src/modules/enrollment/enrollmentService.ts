import { prisma } from '../../config/setup/dbSetup';
import HttpException from '../../utils/api/httpException';
import { ICreateEnrollmentSchema } from './enrollmentValidation';
import { pagination, getPageDocs } from '../../utils/pagination/pagination';
import { IPaginationSchema } from '../../utils/validators/commonValidation';
import {
  IApiPaginationResponse,
  IApiResponse,
  IEnrollmentService,
  EnrollmentWithDetails,
  EnrollmentWithCourse,
} from './types';
import { CourseEnrollment } from '@prisma/client';
import { IPaginationResponse } from '#utils/pagination/types';

class EnrollmentService implements IEnrollmentService {
  async enroll(
    data: ICreateEnrollmentSchema,
  ): Promise<IApiResponse<CourseEnrollment>> {
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

    const response = await prisma.courseEnrollment.create({
      data: {
        userId: data.studentId,
        courseId: data.courseId,
      },
    });

    return {
      data: response,
    };
  }

  async getAllEnrolledStudents(
    courseId: string,
    query: IPaginationSchema,
  ): Promise<
    IApiPaginationResponse<EnrollmentWithDetails, IPaginationResponse>
  > {
    const { skip, limit, page } = pagination({
      limit: query.limit,
      page: query.page,
    });

    const [enrollments, count] = await Promise.all([
      await prisma.courseEnrollment.findMany({
        where: { courseId },
        select: {
          id: true,
          userId: true,
          courseId: true,
          createdAt: true,
          updatedAt: true,
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

    return {
      data: enrollments,
      docs,
    };
  }

  async viewAllEnrolledCourses(
    studentId: string,
    query: IPaginationSchema,
  ): Promise<
    IApiPaginationResponse<EnrollmentWithCourse, IPaginationResponse>
  > {
    const { skip, limit, page } = pagination({
      limit: query.limit,
      page: query.page,
    });

    const [enrollments, count] = await Promise.all([
      await prisma.courseEnrollment.findMany({
        where: { userId: studentId },
        select: {
          id: true,
          userId: true,
          courseId: true,
          createdAt: true,
          updatedAt: true,
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
        where: { userId: studentId },
      }),
    ]);

    const docs = getPageDocs({
      page,
      limit,
      count,
    });

    return {
      data: enrollments,
      docs,
    };
  }
}

export default new EnrollmentService();
