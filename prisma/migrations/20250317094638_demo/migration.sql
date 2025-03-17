/*
  Warnings:

  - You are about to alter the column `creditBalance` on the `Party` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Party" ADD COLUMN     "productId" TEXT,
ALTER COLUMN "creditBalance" SET DEFAULT 0,
ALTER COLUMN "creditBalance" SET DATA TYPE INTEGER;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
