-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "telefono" TEXT,
    "rol" TEXT NOT NULL DEFAULT 'estudiante',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instructores" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "especialidad" TEXT[],
    "bio" TEXT,
    "experiencia" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "instructores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clases" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "nivel" TEXT NOT NULL,
    "instructor_id" TEXT,
    "duracion" INTEGER NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "inscritos" INTEGER NOT NULL DEFAULT 0,
    "estilo" TEXT NOT NULL,

    CONSTRAINT "clases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horarios" (
    "id" TEXT NOT NULL,
    "clase_id" TEXT NOT NULL,
    "instructor_id" TEXT,
    "fecha" DATE NOT NULL,
    "hora_inicio" TEXT NOT NULL,
    "hora_fin" TEXT NOT NULL,
    "salon" TEXT NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "horarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscripciones" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "horario_id" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'activa',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "horario_id" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "clase_id" TEXT NOT NULL,
    "puntuacion" INTEGER NOT NULL,
    "comentario" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "clases" ADD CONSTRAINT "clases_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horarios" ADD CONSTRAINT "horarios_clase_id_fkey" FOREIGN KEY ("clase_id") REFERENCES "clases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horarios" ADD CONSTRAINT "horarios_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_horario_id_fkey" FOREIGN KEY ("horario_id") REFERENCES "horarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_horario_id_fkey" FOREIGN KEY ("horario_id") REFERENCES "horarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_clase_id_fkey" FOREIGN KEY ("clase_id") REFERENCES "clases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
