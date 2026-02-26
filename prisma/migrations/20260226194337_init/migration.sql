-- CreateTable
CREATE TABLE "EnergyInvoice" (
    "id" TEXT NOT NULL,
    "installationNumber" TEXT NOT NULL,
    "utilityCompany" TEXT NOT NULL,
    "referenceMonth" TEXT NOT NULL,
    "consumptionKwh" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "taxes" DOUBLE PRECISION NOT NULL,
    "rawJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnergyInvoice_pkey" PRIMARY KEY ("id")
);
