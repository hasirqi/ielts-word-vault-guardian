/*
  Warnings:

  - The primary key for the `Word` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `sequenceNumber` to the `Word` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Word" (
    "sequenceNumber" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id" TEXT NOT NULL,
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
INSERT INTO "new_Word" ("affixes", "definitionEn", "definitionZh", "etymology", "example", "id", "known", "lastReviewed", "nextReview", "phonetic", "reviewCount", "roots", "word") SELECT "affixes", "definitionEn", "definitionZh", "etymology", "example", "id", "known", "lastReviewed", "nextReview", "phonetic", "reviewCount", "roots", "word" FROM "Word";
DROP TABLE "Word";
ALTER TABLE "new_Word" RENAME TO "Word";
CREATE UNIQUE INDEX "Word_id_key" ON "Word"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
