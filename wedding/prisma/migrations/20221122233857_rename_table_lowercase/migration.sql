/*
  Warnings:

  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Person";

-- CreateTable
CREATE TABLE "person" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "attendance" "Attendance" NOT NULL DEFAULT 'UNKNOWN',
    "golf" "Attendance" NOT NULL DEFAULT 'UNKNOWN',
    "welcome" "Attendance" NOT NULL DEFAULT 'UNKNOWN',
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "person_email_key" ON "person"("email");
