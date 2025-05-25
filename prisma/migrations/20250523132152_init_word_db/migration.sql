-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "word" TEXT NOT NULL,
    "phonetic" TEXT NOT NULL,
    "roots" TEXT,
    "affixes" TEXT,
    "etymology" TEXT,
    "definitionEn" TEXT NOT NULL,
    "definitionZh" TEXT NOT NULL,
    "example" TEXT NOT NULL,
    "lastReviewed" DATETIME,
    "nextReview" DATETIME,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "known" BOOLEAN NOT NULL DEFAULT false
);
