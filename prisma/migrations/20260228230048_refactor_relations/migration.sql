/*
  Warnings:

  - You are about to drop the column `consumptionKwh` on the `EnergyInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `installationNumber` on the `EnergyInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `taxes` on the `EnergyInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `utilityCompany` on the `EnergyInvoice` table. All the data in the column will be lost.
  - You are about to alter the column `totalAmount` on the `EnergyInvoice` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(15,2)`.
  - A unique constraint covering the columns `[referenceMonth,clientId]` on the table `EnergyInvoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientId` to the `EnergyInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consumptionElectricalEnergyKwh` to the `EnergyInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consumptionEnergyGDKwh` to the `EnergyInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consumptionEnergySCEEKwh` to the `EnergyInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consumptionTotalKwh` to the `EnergyInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `EnergyInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `electricalEnergyAmount` to the `EnergyInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `electricalEnergyUnitPrice` to the `EnergyInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `electricalEnergyUnitTaxe` to the `EnergyInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energyAmount` to the `EnergyInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energyGDAmount` to the `EnergyInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energyGDUnitPrice` to the `EnergyInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energyGDUnitTaxe` to the `EnergyInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energySCEEAmount` to the `EnergyInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energySCEEUnitPrice` to the `EnergyInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energySCEEUnitTaxe` to the `EnergyInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issueDate` to the `EnergyInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicLightingContributionAmount` to the `EnergyInvoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EnergyInvoice" DROP COLUMN "consumptionKwh",
DROP COLUMN "installationNumber",
DROP COLUMN "taxes",
DROP COLUMN "utilityCompany",
ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "consumptionElectricalEnergyKwh" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "consumptionEnergyGDKwh" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "consumptionEnergySCEEKwh" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "consumptionTotalKwh" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "electricalEnergyAmount" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "electricalEnergyUnitPrice" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "electricalEnergyUnitTaxe" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "energyAmount" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "energyGDAmount" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "energyGDUnitPrice" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "energyGDUnitTaxe" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "energySCEEAmount" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "energySCEEUnitPrice" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "energySCEEUnitTaxe" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "issueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "publicLightingContributionAmount" DECIMAL(15,2) NOT NULL,
ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(15,2);

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
