/*
  Warnings:

  - You are about to drop the column `patientNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `receiptsId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `timeStamp` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SensorReadings" ADD COLUMN "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birthDate" DATETIME,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("birthDate", "email", "fullName", "id", "password") SELECT "birthDate", "email", "fullName", "id", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
