-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientNumber" TEXT NOT NULL,
    "installationNumber" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnergyInvoice" (
    "id" TEXT NOT NULL,
    "referenceMonth" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "consumptionElectricalEnergyKwh" DOUBLE PRECISION NOT NULL,
    "consumptionEnergySCEEKwh" DOUBLE PRECISION NOT NULL,
    "consumptionTotalKwh" DOUBLE PRECISION NOT NULL,
    "compensatedEnergyGDKwh" DOUBLE PRECISION NOT NULL,
    "electricalEnergyUnitPrice" DECIMAL(15,2) NOT NULL,
    "electricalEnergyUnitTaxe" DECIMAL(15,2) NOT NULL,
    "electricalEnergyAmount" DECIMAL(15,2) NOT NULL,
    "energySCEEUnitPrice" DECIMAL(15,2) NOT NULL,
    "energySCEEUnitTaxe" DECIMAL(15,2) NOT NULL,
    "energySCEEAmount" DECIMAL(15,2) NOT NULL,
    "compensatedEnergyGDUnitPrice" DECIMAL(15,2) NOT NULL,
    "compensatedEnergyGDUnitTaxe" DECIMAL(15,2) NOT NULL,
    "compensatedEnergyGDAmount" DECIMAL(15,2) NOT NULL,
    "publicLightingContributionAmount" DECIMAL(15,2) NOT NULL,
    "energyAmount" DECIMAL(15,2) NOT NULL,
    "totalAmount" DECIMAL(15,2) NOT NULL,
    "rawJson" JSONB NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnergyInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_cnpj_key" ON "Company"("cnpj");

-- CreateIndex
CREATE INDEX "Client_companyId_idx" ON "Client"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_installationNumber_companyId_key" ON "Client"("installationNumber", "companyId");

-- CreateIndex
CREATE INDEX "EnergyInvoice_clientId_idx" ON "EnergyInvoice"("clientId");

-- CreateIndex
CREATE INDEX "EnergyInvoice_referenceMonth_idx" ON "EnergyInvoice"("referenceMonth");

-- CreateIndex
CREATE UNIQUE INDEX "EnergyInvoice_referenceMonth_clientId_key" ON "EnergyInvoice"("referenceMonth", "clientId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyInvoice" ADD CONSTRAINT "EnergyInvoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
