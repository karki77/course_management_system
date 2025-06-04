import { prisma } from '../../config/setup/dbSetup';

import HttpException from '../../utils/api/httpException';
import type {
  ICreateCourseSchema,
  IUpdatedCourseSchema,
  ICreateModuleSchema,
  ICreateLessonSchema,
  ILessonProgressSchema,
} from '../course/courseValidation';

/**
 * Course Service
 */
class CourseService {
  async _getCourse(courseId: string, instructorId: string) {
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: instructorId,
      },
    });
    if (!course) {
      throw new HttpException(404, 'Course not found!');
    }
    return course;
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

  async createLesson(data: ICreateLessonSchema) {
    const { title, moduleId, content, videoUrl } = data;

    const existingLesson = await prisma.lesson.findFirst({
      where: { title, moduleId, content, videoUrl },
    });

    if (existingLesson) {
      throw new HttpException(
        400,
        'Lesson with this title already exists in the module',
      );
    }

    return await prisma.lesson.create({
      data: {
        title,
        moduleId,
        content,
        videoUrl,
      },
    });
  }

  async LessonProgress(userId: string, data: ILessonProgressSchema) {
    const { courseId, lessonId } = data;

    // Verify the lesson exists and belongs to the course
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        module: {
          courseId,
        },
      },
    });

    if (!lesson) {
      throw new HttpException(404, 'Lesson not found in this course');
    }

    // Get or create progress record
    const progress =
      (await prisma.lessonProgress.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      })) ||
      (await prisma.lessonProgress.create({
        data: {
          userId,
          courseId,
          completedLessons: [],
          progressPercentage: 0,
        },
      }));

    // Update completed lessons if not already completed
    if (!progress.completedLessons.includes(lessonId)) {
      // Get total lesson count for the course
      const totalLessons = await prisma.lesson.count({
        where: {
          module: {
            courseId,
          },
        },
      });

      const updatedCompletedLessons = [...progress.completedLessons, lessonId];
      const progressPercentage =
        (updatedCompletedLessons.length / totalLessons) * 100;

      return await prisma.lessonProgress.update({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        data: {
          completedLessons: updatedCompletedLessons,
          progressPercentage,
          lastAccessDate: new Date(),
        },
      });
    }

    return progress;
  }
}

export default new CourseService();
