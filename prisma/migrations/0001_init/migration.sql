-- CreateEnum
CREATE TYPE "FeedMethod" AS ENUM ('BREAST', 'BOTTLE', 'PUMPED', 'SOLID');

-- CreateEnum
CREATE TYPE "FeedSide" AS ENUM ('LEFT', 'RIGHT', 'BOTH');

-- CreateEnum
CREATE TYPE "DiaperType" AS ENUM ('WET', 'DIRTY', 'MIXED', 'DRY');

-- CreateEnum
CREATE TYPE "StoolConsistency" AS ENUM ('LOOSE', 'PASTY', 'FIRM');

-- CreateEnum
CREATE TYPE "SleepQuality" AS ENUM ('POOR', 'FAIR', 'GOOD', 'GREAT');

-- CreateEnum
CREATE TYPE "BabySex" AS ENUM ('FEMALE', 'MALE', 'UNKNOWN');

-- CreateTable
CREATE TABLE "Caregiver" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Caregiver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Baby" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "sex" "BabySex",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Baby_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedLog" (
    "id" TEXT NOT NULL,
    "babyId" TEXT NOT NULL,
    "caregiverId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "method" "FeedMethod" NOT NULL,
    "volumeMl" INTEGER,
    "side" "FeedSide",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaperLog" (
    "id" TEXT NOT NULL,
    "babyId" TEXT NOT NULL,
    "caregiverId" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "type" "DiaperType" NOT NULL,
    "color" TEXT,
    "consistency" "StoolConsistency",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiaperLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SleepLog" (
    "id" TEXT NOT NULL,
    "babyId" TEXT NOT NULL,
    "caregiverId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "durationMinutes" INTEGER,
    "quality" "SleepQuality",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SleepLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthLog" (
    "id" TEXT NOT NULL,
    "babyId" TEXT NOT NULL,
    "caregiverId" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "weightGrams" INTEGER,
    "lengthCm" DOUBLE PRECISION,
    "headCircumferenceCm" DOUBLE PRECISION,
    "temperatureC" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GrowthLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BabyToCaregiver" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Caregiver_email_key" ON "Caregiver"("email");

-- CreateIndex
CREATE INDEX "FeedLog_babyId_startTime_idx" ON "FeedLog"("babyId", "startTime");

-- CreateIndex
CREATE INDEX "FeedLog_caregiverId_startTime_idx" ON "FeedLog"("caregiverId", "startTime");

-- CreateIndex
CREATE INDEX "DiaperLog_babyId_occurredAt_idx" ON "DiaperLog"("babyId", "occurredAt");

-- CreateIndex
CREATE INDEX "DiaperLog_caregiverId_occurredAt_idx" ON "DiaperLog"("caregiverId", "occurredAt");

-- CreateIndex
CREATE INDEX "SleepLog_babyId_startTime_idx" ON "SleepLog"("babyId", "startTime");

-- CreateIndex
CREATE INDEX "SleepLog_caregiverId_startTime_idx" ON "SleepLog"("caregiverId", "startTime");

-- CreateIndex
CREATE INDEX "GrowthLog_babyId_recordedAt_idx" ON "GrowthLog"("babyId", "recordedAt");

-- CreateIndex
CREATE INDEX "GrowthLog_caregiverId_recordedAt_idx" ON "GrowthLog"("caregiverId", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "_BabyToCaregiver_AB_unique" ON "_BabyToCaregiver"("A", "B");

-- CreateIndex
CREATE INDEX "_BabyToCaregiver_B_index" ON "_BabyToCaregiver"("B");

-- AddForeignKey
ALTER TABLE "FeedLog" ADD CONSTRAINT "FeedLog_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedLog" ADD CONSTRAINT "FeedLog_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "Caregiver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaperLog" ADD CONSTRAINT "DiaperLog_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaperLog" ADD CONSTRAINT "DiaperLog_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "Caregiver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SleepLog" ADD CONSTRAINT "SleepLog_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SleepLog" ADD CONSTRAINT "SleepLog_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "Caregiver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthLog" ADD CONSTRAINT "GrowthLog_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthLog" ADD CONSTRAINT "GrowthLog_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "Caregiver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BabyToCaregiver" ADD CONSTRAINT "_BabyToCaregiver_A_fkey" FOREIGN KEY ("A") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BabyToCaregiver" ADD CONSTRAINT "_BabyToCaregiver_B_fkey" FOREIGN KEY ("B") REFERENCES "Caregiver"("id") ON DELETE CASCADE ON UPDATE CASCADE;
