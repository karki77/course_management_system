-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "period" TEXT,
ALTER COLUMN "duration" DROP NOT NULL;
