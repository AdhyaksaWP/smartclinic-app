/*
  Warnings:

  - Added the required column `bmi` to the `SensorReadings` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SensorReadings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "height" REAL NOT NULL,
    "weight" REAL NOT NULL,
    "temperature" REAL NOT NULL,
    "heartbeat" REAL NOT NULL,
    "oxygenLevel" REAL NOT NULL,
    "bloodPresuure" REAL NOT NULL,
    "bmi" REAL NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "SensorReadings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SensorReadings" ("bloodPresuure", "heartbeat", "height", "id", "oxygenLevel", "temperature", "userId", "weight") SELECT "bloodPresuure", "heartbeat", "height", "id", "oxygenLevel", "temperature", "userId", "weight" FROM "SensorReadings";
DROP TABLE "SensorReadings";
ALTER TABLE "new_SensorReadings" RENAME TO "SensorReadings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
