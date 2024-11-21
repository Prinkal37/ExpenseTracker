/*
  Warnings:

  - Added the required column `category` to the `Credit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Debit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Credit" ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Debit" ADD COLUMN     "category" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
