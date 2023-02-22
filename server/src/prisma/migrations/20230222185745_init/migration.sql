-- DropForeignKey
ALTER TABLE `Replies` DROP FOREIGN KEY `Replies_assigned_fkey`;

-- AlterTable
ALTER TABLE `Replies` MODIFY `assigned` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Replies` ADD CONSTRAINT `Replies_assigned_fkey` FOREIGN KEY (`assigned`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
