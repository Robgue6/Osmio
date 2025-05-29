-- CreateTable
CREATE TABLE "DelegationOperation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "operationType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'En attente',
    "formData" JSONB,
    "notes" TEXT,

    CONSTRAINT "DelegationOperation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DelegationOperation" ADD CONSTRAINT "DelegationOperation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
