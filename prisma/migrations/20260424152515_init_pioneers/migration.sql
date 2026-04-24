-- CreateEnum
CREATE TYPE "Era" AS ENUM ('AncientMedieval', 'Mechanical', 'EarlyElectronic', 'ColdWar', 'PersonalComputing', 'InternetAge', 'AIEra');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Unknown');

-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('Paper', 'Book', 'System', 'Language', 'Algorithm', 'Other');

-- CreateTable
CREATE TABLE "Pioneer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "knownFor" TEXT,
    "intro" TEXT NOT NULL,
    "longBio" TEXT,
    "achievement" TEXT NOT NULL,
    "birthYear" INTEGER,
    "deathYear" INTEGER,
    "birthCity" TEXT,
    "birthCountry" TEXT NOT NULL,
    "nationality" TEXT,
    "century" INTEGER NOT NULL,
    "contributionYear" INTEGER NOT NULL,
    "era" "Era" NOT NULL,
    "gender" "Gender" NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "imageLocal" TEXT,

    CONSTRAINT "Pioneer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classification" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Classification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PioneerClassification" (
    "pioneerId" INTEGER NOT NULL,
    "classificationId" INTEGER NOT NULL,

    CONSTRAINT "PioneerClassification_pkey" PRIMARY KEY ("pioneerId","classificationId")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "pioneerId" INTEGER NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT,
    "field" TEXT,
    "year" INTEGER,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Award" (
    "id" SERIAL NOT NULL,
    "pioneerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER,

    CONSTRAINT "Award_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" SERIAL NOT NULL,
    "pioneerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "years" TEXT,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotableWork" (
    "id" SERIAL NOT NULL,
    "pioneerId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "type" "WorkType" NOT NULL DEFAULT 'Other',
    "year" INTEGER,

    CONSTRAINT "NotableWork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FunFact" (
    "id" SERIAL NOT NULL,
    "pioneerId" INTEGER NOT NULL,
    "fact" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "FunFact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Influence" (
    "id" SERIAL NOT NULL,
    "pioneerId" INTEGER NOT NULL,
    "direction" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Influence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pioneer_name_key" ON "Pioneer"("name");

-- CreateIndex
CREATE INDEX "Pioneer_era_idx" ON "Pioneer"("era");

-- CreateIndex
CREATE INDEX "Pioneer_contributionYear_idx" ON "Pioneer"("contributionYear");

-- CreateIndex
CREATE INDEX "Pioneer_birthCountry_idx" ON "Pioneer"("birthCountry");

-- CreateIndex
CREATE INDEX "Pioneer_gender_idx" ON "Pioneer"("gender");

-- CreateIndex
CREATE UNIQUE INDEX "Classification_name_key" ON "Classification"("name");

-- CreateIndex
CREATE INDEX "Influence_pioneerId_direction_idx" ON "Influence"("pioneerId", "direction");

-- AddForeignKey
ALTER TABLE "PioneerClassification" ADD CONSTRAINT "PioneerClassification_pioneerId_fkey" FOREIGN KEY ("pioneerId") REFERENCES "Pioneer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PioneerClassification" ADD CONSTRAINT "PioneerClassification_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_pioneerId_fkey" FOREIGN KEY ("pioneerId") REFERENCES "Pioneer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Award" ADD CONSTRAINT "Award_pioneerId_fkey" FOREIGN KEY ("pioneerId") REFERENCES "Pioneer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Institution" ADD CONSTRAINT "Institution_pioneerId_fkey" FOREIGN KEY ("pioneerId") REFERENCES "Pioneer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotableWork" ADD CONSTRAINT "NotableWork_pioneerId_fkey" FOREIGN KEY ("pioneerId") REFERENCES "Pioneer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FunFact" ADD CONSTRAINT "FunFact_pioneerId_fkey" FOREIGN KEY ("pioneerId") REFERENCES "Pioneer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Influence" ADD CONSTRAINT "Influence_pioneerId_fkey" FOREIGN KEY ("pioneerId") REFERENCES "Pioneer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
