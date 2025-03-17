/*
  Warnings:

  - The primary key for the `Party` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProductSupplier` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "CreditLedger" DROP CONSTRAINT "CreditLedger_partyId_fkey";

-- DropForeignKey
ALTER TABLE "ProductSupplier" DROP CONSTRAINT "ProductSupplier_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "StockHistory" DROP CONSTRAINT "StockHistory_partyId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierPayment" DROP CONSTRAINT "SupplierPayment_partyId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_partyId_fkey";

-- AlterTable
ALTER TABLE "CreditLedger" ALTER COLUMN "partyId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Party" DROP CONSTRAINT "Party_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Party_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Party_id_seq";

-- AlterTable
ALTER TABLE "ProductSupplier" DROP CONSTRAINT "ProductSupplier_pkey",
ALTER COLUMN "supplierId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ProductSupplier_pkey" PRIMARY KEY ("productId", "supplierId");

-- AlterTable
ALTER TABLE "Purchase" ALTER COLUMN "supplierId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "StockHistory" ALTER COLUMN "partyId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SupplierPayment" ALTER COLUMN "partyId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "partyId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "ProductSupplier" ADD CONSTRAINT "ProductSupplier_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockHistory" ADD CONSTRAINT "StockHistory_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierPayment" ADD CONSTRAINT "SupplierPayment_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;
