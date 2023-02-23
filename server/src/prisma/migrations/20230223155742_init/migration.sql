/*
  Warnings:

  - Made the column `assigned` on table `Replies` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Replies` DROP FOREIGN KEY `Replies_assigned_fkey`;

-- AlterTable
ALTER TABLE `Replies` MODIFY `assigned` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Replies` ADD CONSTRAINT `Replies_assigned_fkey` FOREIGN KEY (`assigned`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
