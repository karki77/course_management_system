import { prisma } from '../../config/setup/dbSetup';

import HttpException from '../../utils/api/httpException';
import type {
  ICreateCourseSchema,
  IUpdatedCourseSchema,
  ICreateModuleSchema,
} from '../course/courseValidation';

/**
 * Course Service
 */
class CourseService {
  // Removed duplicate createModule method
  /**
   * Private Function
   * Get course details by courseId and InstructorId
   */
  async _getCourse(courseId: string, instructorId: string) {
    // return course
  }

  async createCourse(instructorId: string, data: ICreateCourseSchema) {
    const existingCourse = await prisma.course.findFirst({
      where: {
        title: data.title,
      },
    });

    if (existingCourse) {
      throw new HttpException(400, 'Course with this title already exists');
    }

    const instructorDetail = await prisma.user.findUnique({
      where: { id: instructorId },
    });

    if (!instructorDetail) {
      throw new HttpException(404, 'Instructor not found');
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
    data: IUpdatedCourseSchema,
  ) {
    await this._getCourse(courseId, instructorId);

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        ...data,
      },
    });

    //
    return updatedCourse;
  }

  async deleteCourse(instructorId: string, courseId: string) {
    await this._getCourse(courseId, instructorId);

    return await prisma.course.delete({
      where: { id: courseId },
    });
  }
  async createModule(data: ICreateModuleSchema) {
    const { title, courseId } = data;

    const existingModule = await prisma.module.findFirst({
      where: { title, courseId },
    });

    if (existingModule) {
      throw new HttpException(
        400,
        'Module with this title already exists in the course',
      );
    }

    return await prisma.module.create({
      data: {
        title,
        courseId,
      },
    });
  }
}

export default new CourseService();
