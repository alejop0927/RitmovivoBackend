/*
  Warnings:

  - A unique constraint covering the columns `[usuario_id]` on the table `instructores` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "instructores" ADD COLUMN     "usuario_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "instructores_usuario_id_key" ON "instructores"("usuario_id");

-- AddForeignKey
ALTER TABLE "instructores" ADD CONSTRAINT "instructores_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
