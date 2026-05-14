export function mapUser(u: Record<string, unknown>) {
  return {
    id: u['id'],
    nombre: u['nombre'],
    apellido: u['apellido'],
    email: u['email'],
    rol: u['rol'],
    telefono: u['telefono'] ?? null,
    createdAt: u['created_at'],
  };
}

export function mapInstructor(i: Record<string, unknown>) {
  return {
    id: i['id'],
    nombre: i['nombre'],
    apellido: i['apellido'],
    especialidad: i['especialidad'] ?? [],
    bio: i['bio'] ?? '',
    experiencia: i['experiencia'] ?? 0,
    rating: i['rating'] ?? 0,
  };
}

export function mapClase(c: Record<string, unknown>) {
  return {
    id: c['id'],
    nombre: c['nombre'],
    descripcion: c['descripcion'] ?? '',
    instructor: c['instructores'] ? mapInstructor(c['instructores'] as Record<string, unknown>) : null,
    nivel: c['nivel'],
    duracion: c['duracion'],
    capacidad: c['capacidad'],
    inscritos: c['inscritos'] ?? 0,
    estilo: c['estilo'] ?? '',
  };
}

export function mapHorario(h: Record<string, unknown>) {
  return {
    id: h['id'],
    clase: h['clases'] ? mapClase(h['clases'] as Record<string, unknown>) : null,
    instructor: h['instructores'] ? mapInstructor(h['instructores'] as Record<string, unknown>) : null,
    fecha: h['fecha'],
    horaInicio: h['hora_inicio'],
    horaFin: h['hora_fin'],
    salon: h['salon'],
    disponible: h['disponible'],
  };
}

export function mapInscripcion(i: Record<string, unknown>) {
  return {
    id: i['id'],
    usuario: i['usuarios'] ? mapUser(i['usuarios'] as Record<string, unknown>) : null,
    horario: i['horarios'] ? mapHorario(i['horarios'] as Record<string, unknown>) : null,
    estado: i['estado'],
    fechaInscripcion: i['created_at'],
  };
}
