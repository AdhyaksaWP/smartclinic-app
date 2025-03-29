-- CreateTable
CREATE TABLE "SensorReadings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "height" REAL NOT NULL,
    "weight" REAL NOT NULL,
    "temperature" REAL NOT NULL,
    "heartbeat" REAL NOT NULL,
    "oxygenLevel" REAL NOT NULL,
    "bloodPresuure" REAL NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "SensorReadings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
