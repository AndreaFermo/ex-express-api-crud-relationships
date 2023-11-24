-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `Category_postId_fkey`;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `categoryId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
