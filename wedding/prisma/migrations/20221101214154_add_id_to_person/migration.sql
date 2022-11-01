/*
  Warnings:

  - The primary key for the `Person` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Person" DROP CONSTRAINT "Person_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Person_pkey" PRIMARY KEY ("id");
