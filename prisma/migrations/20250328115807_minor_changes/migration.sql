/*
  Warnings:

  - You are about to drop the column `discountAmount` on the `ReturnItem` table. All the data in the column will be lost.
  - You are about to drop the column `gstAmount` on the `ReturnItem` table. All the data in the column will be lost.
  - You are about to drop the column `originalSaleItemId` on the `ReturnItem` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `ReturnItem` table. All the data in the column will be lost.
  - Added the required column `gstRate` to the `ReturnItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReturnItem" DROP COLUMN "discountAmount",
DROP COLUMN "gstAmount",
DROP COLUMN "originalSaleItemId",
DROP COLUMN "subtotal",
ADD COLUMN     "gstRate" "GSTRATE" NOT NULL;
