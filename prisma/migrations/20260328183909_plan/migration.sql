/*
  Warnings:

  - You are about to drop the column `features` on the `Plan` table. All the data in the column will be lost.
  - Added the required column `canShare` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasSecurity` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numPeopleToShare` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "features",
ADD COLUMN     "canShare" BOOLEAN NOT NULL,
ADD COLUMN     "hasSecurity" BOOLEAN NOT NULL,
ADD COLUMN     "numPeopleToShare" INTEGER NOT NULL;
