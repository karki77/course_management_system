import { prisma } from '../../config';
import HttpException from '../../utils/api/httpException';
import { ICreateCourseSchema } from './courseValidation';

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
}

export default new CourseService();
