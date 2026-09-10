-- CreateTable
CREATE TABLE "ProjectUpload" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT,
    "fileUrl" TEXT,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "projectLink" TEXT,
    "userId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectUpload_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectUpload" ADD CONSTRAINT "ProjectUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUpload" ADD CONSTRAINT "ProjectUpload_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
