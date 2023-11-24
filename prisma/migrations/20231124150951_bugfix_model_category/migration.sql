/*
  Warnings:

  - You are about to drop the column `postId` on the `category` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Category_postId_fkey` ON `category`;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `postId`;
