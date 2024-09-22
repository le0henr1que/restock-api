/*
  Warnings:

  - Added the required column `organizationUserId` to the `TB_USER_ASSIGNMENT` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationUserId` to the `TB_USER_ROLE` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PersonTypeEnum" AS ENUM ('CRIANCA', 'ADULTO');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AssignmentsEnum" ADD VALUE 'ORGANIZATION';
ALTER TYPE "AssignmentsEnum" ADD VALUE 'PLAN';

-- DropForeignKey
ALTER TABLE "TB_USER_ASSIGNMENT" DROP CONSTRAINT "TB_USER_ASSIGNMENT_userId_fkey";

-- DropForeignKey
ALTER TABLE "TB_USER_ROLE" DROP CONSTRAINT "TB_USER_ROLE_userId_fkey";

-- AlterTable
ALTER TABLE "TB_USER_ASSIGNMENT" ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "organizationUserId" VARCHAR NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "TB_USER_ROLE" ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "organizationUserId" VARCHAR NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "TB_ORGANIZATION" (
    "_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3),
    "planId" VARCHAR,
    "ownerId" VARCHAR,
    "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "deletedAt" TIMESTAMPTZ(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "TB_ORGANIZATION_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "OrganizationUser" (
    "organizationId" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,

    CONSTRAINT "OrganizationUser_pkey" PRIMARY KEY ("organizationId","userId")
);

-- CreateTable
CREATE TABLE "TB_PLAN" (
    "_id" TEXT NOT NULL,
    "planIdPlatform" VARCHAR,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "buttonText" VARCHAR(255) NOT NULL DEFAULT 'Assinar Plano',
    "benefitList" VARCHAR(500)[],
    "price" DECIMAL(10,2) NOT NULL,
    "durationInDays" INTEGER NOT NULL,
    "userLimit" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3),
    "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "deletedAt" TIMESTAMPTZ(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "TB_PLAN_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "TB_SUBSCRIPTION" (
    "_id" TEXT NOT NULL,
    "planId" VARCHAR NOT NULL,
    "startDate" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMPTZ(3) NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "deletedAt" TIMESTAMPTZ(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "organizationId" VARCHAR NOT NULL,

    CONSTRAINT "TB_SUBSCRIPTION_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "TB_QUOTA" (
    "_id" TEXT NOT NULL,
    "organizationId" VARCHAR NOT NULL,
    "usersCreated" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3),
    "planId" VARCHAR NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "TB_QUOTA_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "TB_CELL" (
    "_id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(3),
    "name" VARCHAR(255) NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "userId" TEXT NOT NULL,

    CONSTRAINT "TB_CELL_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "TB_PERSON" (
    "_id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(3),
    "name" VARCHAR(255) NOT NULL,
    "personType" "PersonTypeEnum" NOT NULL DEFAULT 'ADULTO',
    "isHost" BOOLEAN NOT NULL DEFAULT false,
    "isVisitor" BOOLEAN NOT NULL DEFAULT false,
    "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "cellId" VARCHAR,

    CONSTRAINT "TB_PERSON_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TB_CELL_userId_key" ON "TB_CELL"("userId");

-- AddForeignKey
ALTER TABLE "TB_ORGANIZATION" ADD CONSTRAINT "TB_ORGANIZATION_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "TB_USER"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TB_ORGANIZATION" ADD CONSTRAINT "TB_ORGANIZATION_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TB_PLAN"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationUser" ADD CONSTRAINT "OrganizationUser_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "TB_ORGANIZATION"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationUser" ADD CONSTRAINT "OrganizationUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TB_USER"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TB_SUBSCRIPTION" ADD CONSTRAINT "TB_SUBSCRIPTION_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "TB_ORGANIZATION"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TB_SUBSCRIPTION" ADD CONSTRAINT "TB_SUBSCRIPTION_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TB_PLAN"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TB_QUOTA" ADD CONSTRAINT "TB_QUOTA_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "TB_ORGANIZATION"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TB_QUOTA" ADD CONSTRAINT "TB_QUOTA_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TB_PLAN"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TB_CELL" ADD CONSTRAINT "TB_CELL_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TB_USER"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TB_PERSON" ADD CONSTRAINT "TB_PERSON_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "TB_CELL"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TB_USER_ASSIGNMENT" ADD CONSTRAINT "TB_USER_ASSIGNMENT_organizationId_userId_fkey" FOREIGN KEY ("organizationId", "userId") REFERENCES "OrganizationUser"("organizationId", "userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TB_USER_ROLE" ADD CONSTRAINT "TB_USER_ROLE_organizationId_userId_fkey" FOREIGN KEY ("organizationId", "userId") REFERENCES "OrganizationUser"("organizationId", "userId") ON DELETE SET NULL ON UPDATE CASCADE;
