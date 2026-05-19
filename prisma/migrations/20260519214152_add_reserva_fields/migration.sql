-- AlterTable
ALTER TABLE "reservas" ADD COLUMN     "con_profesor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "numero_personas" INTEGER NOT NULL DEFAULT 1;
