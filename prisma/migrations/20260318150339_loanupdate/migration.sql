/*
  Warnings:

  - You are about to drop the column `remainingAmount` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_emiId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_loanId_fkey";

-- AlterTable
ALTER TABLE "Loan" DROP COLUMN "remainingAmount",
DROP COLUMN "totalAmount",
ADD COLUMN     "remainingPayable" DECIMAL(14,2) NOT NULL DEFAULT 0,
ADD COLUMN     "remainingPrincipal" DECIMAL(14,2) NOT NULL DEFAULT 0,
ADD COLUMN     "totalPayable" DECIMAL(14,2) NOT NULL DEFAULT 0,
ALTER COLUMN "principal" SET DEFAULT 0,
ALTER COLUMN "interestRate" SET DEFAULT 8.0;

-- DropTable
DROP TABLE "Payment";
