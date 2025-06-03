import { IPaginationSchema } from '#utils/validators/commonValidation';
import { CourseEnrollment } from '@prisma/client';
import { ICreateEnrollmentSchema } from './enrollmentValidation';

export interface IApiResponse<T> {
  data: T;
}

export interface IApiPaginationResponse<T, K> {
  data: T[];
  docs: K;
  metadata?: Record<string, unknown>;
}
// used to get all enrolled students
export interface EnrollmentWithUser {
  id: string;
  userId: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

// used to get all enrolled courses by a student
export interface EnrollmentWithCourse {
  id: string;
  userId: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  course: {
    id: string;
    title: string;
    duration: number | null;
    period: string | null;
    module: {
      id: string;
      title: string;
    }[];
  };
}
// we are currently using this for getallEnrolled Students
export interface EnrollmentWithDetails {
  id: string;
  userId: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
    duration: number | null;
    period: string | null;
    module: {
      id: string;
      title: string;
    }[];
  };
}

export interface IEnrollmentService {
  enroll(
    data: ICreateEnrollmentSchema,
  ): Promise<IApiResponse<CourseEnrollment>>;
  getAllEnrolledStudents(
    courseId: string,
    query: IPaginationSchema,
  ): Promise<IApiPaginationResponse<EnrollmentWithDetails, any>>;
  viewAllEnrolledCourses(
    studentId: string,
    query: IPaginationSchema,
  ): Promise<IApiPaginationResponse<EnrollmentWithCourse, any>>;
}
