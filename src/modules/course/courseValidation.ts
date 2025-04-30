import { z } from "zod";

export const createCourseSchema =z.object({
  title:z
  .string({required_error:"Course title is required"})
  .min(3, { message: "Course title must be at least 3 characters" })
  .max(50, { message: "Course title must be at most 50 characters" }),
  content:z
  .string({required_error:"Course content is required"}) 
  .min(10, { message: "Course content must be at least 10 characters" })
  .max(500, { message: "Course content must be at most 500 characters" }),
  instructor:z
  .string({required_error:"Instructor name is required"})
  .min(3, { message: "Instructor name must be at least 3 characters" })   
  .min(50, { message: "Instructor name must be at most 50 characters" }),
  instructorId:z
  .string({required_error:"Instructor ID is required"}),    
  duration:z  
    .number({ required_error: "Course duration is required" }) 
    .int()
    .min(1, { message: "Course duration must be at least 1" }), 
    period: z
    .string({ required_error: "Course period is required" })
    .regex(/^(day|week|month|year)$/, {
      message: "Period must be one of the following: day, week, month, year",
    }),
}).strict();

export type ICreateCourseSchema = z.infer<typeof createCourseSchema>;
