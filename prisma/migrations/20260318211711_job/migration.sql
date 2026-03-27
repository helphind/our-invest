-- CreateTable
CREATE TABLE "FundConfig" (
    "id" TEXT NOT NULL,
    "monthlyAmount" DOUBLE PRECISION NOT NULL,
    "isAutoGenerate" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" TIMESTAMP(3),

    CONSTRAINT "FundConfig_pkey" PRIMARY KEY ("id")
);
