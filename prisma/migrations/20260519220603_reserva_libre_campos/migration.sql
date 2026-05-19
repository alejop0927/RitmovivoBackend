-- DropForeignKey
ALTER TABLE "reservas" DROP CONSTRAINT "reservas_horario_id_fkey";

-- AlterTable
ALTER TABLE "reservas" ADD COLUMN     "fecha" TIMESTAMP(3),
ADD COLUMN     "hora_fin" TEXT,
ADD COLUMN     "hora_inicio" TEXT,
ADD COLUMN     "salon" TEXT,
ALTER COLUMN "horario_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_horario_id_fkey" FOREIGN KEY ("horario_id") REFERENCES "horarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
