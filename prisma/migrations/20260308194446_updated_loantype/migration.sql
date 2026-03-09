-- CreateEnum
CREATE TYPE "LoanType" AS ENUM ('NORMAL', 'INSTANT');

-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "loanType" "LoanType" NOT NULL DEFAULT 'NORMAL';

-- CreateIndex
CREATE INDEX "Member_email_idx" ON "Member"("email");

-- CreateIndex
CREATE INDEX "Member_phone_idx" ON "Member"("phone");
