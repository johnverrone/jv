-- CreateEnum
CREATE TYPE "Attendance" AS ENUM ('ATTENDING', 'NOT_ATTENDING', 'UNKNOWN');

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "attendance" "Attendance" NOT NULL DEFAULT 'NOT_ATTENDING';
