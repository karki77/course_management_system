import { prisma } from "../../config";
import HttpException from "../../utils/api/httpException";
import { ICreateCourseSchema } from "./courseValidation";

class CourseService {
    async createCourse(data: ICreateCourseSchema) {
        const existingCourse = await prisma.course.findFirst({
            where: {
                title: data.title,
            },
        });

        if (existingCourse) {
            throw new HttpException(400, "Course with this title already exists");
        }

        const course = await prisma.course.create({
            data: {
                title: data.title,
                content: data.content,
                duration: data.duration,
                period: data.period,
                instructor: {
                    connect: { id: data.instructorId }, // Assuming instructorId is passed in the data
                },     
            },
        });

        return course;
    }
}