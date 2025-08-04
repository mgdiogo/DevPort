/*
  Warnings:

  - You are about to drop the column `display_name` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_display_name_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "display_name",
ADD COLUMN     "birthday" TIMESTAMP(3),
ADD COLUMN     "name" TEXT,
ADD COLUMN     "surname" TEXT;
