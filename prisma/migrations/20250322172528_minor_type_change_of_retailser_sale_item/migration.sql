/*
  Warnings:

  - Changed the type of `gstRate` on the `RetailerSaleItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "RetailerSaleItem" DROP COLUMN "gstRate",
ADD COLUMN     "gstRate" "GSTRATE" NOT NULL;
