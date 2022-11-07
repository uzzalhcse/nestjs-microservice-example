/*
  Warnings:

  - You are about to alter the column `productId` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Order` MODIFY `productId` INTEGER NOT NULL;
