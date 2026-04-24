-- CreateTable
CREATE TABLE "PioneerView" (
    "id" SERIAL NOT NULL,
    "pioneerId" INTEGER NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipHash" TEXT,

    CONSTRAINT "PioneerView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PioneerView_pioneerId_idx" ON "PioneerView"("pioneerId");

-- CreateIndex
CREATE INDEX "PioneerView_viewedAt_idx" ON "PioneerView"("viewedAt");

-- AddForeignKey
ALTER TABLE "PioneerView" ADD CONSTRAINT "PioneerView_pioneerId_fkey" FOREIGN KEY ("pioneerId") REFERENCES "Pioneer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
