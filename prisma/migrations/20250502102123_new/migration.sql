/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId]` on the table `CourseEnrollment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CourseEnrollment_userId_courseId_key" ON "CourseEnrollment"("userId", "courseId");
