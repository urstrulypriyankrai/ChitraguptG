/*
  Warnings:

  - You are about to alter the column `totalAmount` on the `FarmerSale` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `amountPaid` on the `FarmerSale` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `balance` on the `FarmerSale` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - Changed the type of `gstRate` on the `FarmerSaleItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "FarmerSale" ALTER COLUMN "totalAmount" SET DATA TYPE INTEGER,
ALTER COLUMN "amountPaid" SET DEFAULT 0,
ALTER COLUMN "amountPaid" SET DATA TYPE INTEGER,
ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "balance" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "FarmerSaleItem" DROP COLUMN "gstRate",
ADD COLUMN     "gstRate" "GSTRATE" NOT NULL;
