/*
  Warnings:

  - You are about to alter the column `gstRate` on the `FarmerSaleItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "FarmerSaleItem" ALTER COLUMN "gstRate" SET DATA TYPE INTEGER;
