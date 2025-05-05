import { prisma } from '../../config';
import HttpException from '../../utils/api/httpException';
import {
  ICreateCourseSchema,
  IUpdatedCourseSchema,
  IDeleteCourseSchema
} from '../course/courseValidation';

class CourseService {
  async createCourse(instructorId: string, data: ICreateCourseSchema) {
    const existingCourse = await prisma.course.findFirst({
      where: {
        title: data.title,
      },
    });

    if (existingCourse) {
      throw new HttpException(400, 'Course with this title already exists');
    }

    // check if the user is an instructor
    const user = await prisma.user.findUnique({
      where: { id: instructorId },
    });

    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    const course = await prisma.course.create({
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
  async updateCourse(
    instructorId: string,
    courseId: string,
    data: IUpdatedCourseSchema
  ) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new HttpException(404, 'Course not found');
    }

    if (course.instructorId !== instructorId) {
      throw new HttpException(
        403,
        'You are not authorized to update this course'
      );
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.period !== undefined && { period: data.period }),
      }
      
    });

    return updatedCourse;
  }
  async deleteCourse(instructorId: string, data: IDeleteCourseSchema) {
    const courseId = data.courseId;
    if (!courseId) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new HttpException(404, 'Course not found');
    }

    if (course.instructorId !== instructorId) {
      throw new HttpException(
        403,
        'You are not authorized to delete this course'
      );
    }

    await prisma.course.delete({
      where: { id: courseId },
    });

    return {
      message: 'Course deleted successfully',
    };
  }
}
}

export default new CourseService();
