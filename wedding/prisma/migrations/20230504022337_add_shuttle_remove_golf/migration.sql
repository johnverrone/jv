/*
  Warnings:

  - You are about to drop the column `golf` on the `person` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "person" DROP COLUMN "golf",
ADD COLUMN     "shuttle" "Attendance" NOT NULL DEFAULT 'UNKNOWN';
