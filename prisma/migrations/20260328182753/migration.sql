/*
  Warnings:

  - You are about to drop the column `activityAlerts` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `pushNotifications` on the `Settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "features" JSONB;

-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "activityAlerts",
DROP COLUMN "pushNotifications",
ADD COLUMN     "activityStatus" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "autoDelete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "autoSync" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "dataCollection" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "defaultPermission" "Permission" NOT NULL DEFAULT 'VIEW',
ADD COLUMN     "desktopNotifications" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "offlineAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publicProfile" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requireAuth" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sharingNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC',
ADD COLUMN     "uploadQuality" TEXT NOT NULL DEFAULT 'ORIGINAL',
ALTER COLUMN "theme" SET DEFAULT 'SYSTEM';
