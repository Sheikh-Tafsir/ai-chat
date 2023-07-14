-- CreateTable
CREATE TABLE "PdfStore" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "PdfStore_pkey" PRIMARY KEY ("id")
);
