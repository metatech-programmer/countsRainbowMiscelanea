// ─── EPG Service (Basic) ─────────────────────────────────────────────────────
// Provides a basic electronic program guide using channel metadata.
// Since full EPG XML parsing is heavy, this generates time-based mock
// programming based on channel category as a foundation layer.

export interface ProgramInfo {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  progress: number; // 0–1
  isLive: boolean;
}

// ── Time-slot program templates by category ─────────────────────────────────
const PROGRAM_TEMPLATES: Record<string, string[]> = {
  Noticias: ['Noticiero matutino', 'Edición mediodía', 'Noticias de la tarde', 'Noticiero central', 'Última hora', 'Análisis nocturno'],
  Deportes: ['Deportes al día', 'Resumen de liga', 'Fútbol en vivo', 'Deportes prime', 'Crónica deportiva', 'Análisis táctico'],
  Películas: ['Cine matutino', 'Película de la tarde', 'Cine clásico', 'Estreno de la noche', 'Cine de acción', 'Cine de autor'],
  Kids: ['Dibujos animados', 'Aventuras', 'Hora del cuento', 'Diversión creativa', 'Series juveniles', 'Caricaturas clásicas'],
  Música: ['Morning Hits', 'Top 40', 'Clásicos del rock', 'Reggaetón party', 'Baladas latinas', 'DJ Session nocturna'],
  Entretenimiento: ['Magazine matutino', 'Talk show', 'Variedades', 'Reality del día', 'Late show', 'Farándula'],
  Documentales: ['Naturaleza salvaje', 'Historia mundial', 'Ciencia y tecnología', 'Planeta Tierra', 'Biografías', 'Misterios del universo'],
  Generalista: ['Buenos días', 'Programa matutino', 'Mediodía en vivo', 'Tarde activa', 'Prime time', 'Cierre nocturno'],
  Series: ['Serie matutina', 'Maratón de series', 'Serie de la tarde', 'Estreno semanal', 'Serie prime', 'Nocturno de series'],
  Anime: ['Anime clásico', 'Shonen hour', 'Anime de la tarde', 'Nuevos episodios', 'Maratón anime', 'Anime nocturno'],
};

const DEFAULT_PROGRAMS = ['Programación en vivo', 'En directo', 'Transmisión continua', 'Señal en vivo', 'Contenido especial', 'Programación general'];

/**
 * Generates a deterministic program schedule for a channel based on
 * its category and the current time. Each program slot is ~4 hours.
 */
export function getCurrentProgram(category: string, channelName: string): ProgramInfo {
  const now = new Date();
  const hour = now.getHours();
  const slotIndex = Math.floor(hour / 4); // 6 slots per day (0-5)
  const templates = PROGRAM_TEMPLATES[category] || DEFAULT_PROGRAMS;
  const title = templates[slotIndex % templates.length];

  // Slot boundaries
  const slotStart = new Date(now);
  slotStart.setHours(slotIndex * 4, 0, 0, 0);
  const slotEnd = new Date(slotStart);
  slotEnd.setHours(slotStart.getHours() + 4);

  // Progress within slot
  const elapsed = now.getTime() - slotStart.getTime();
  const duration = slotEnd.getTime() - slotStart.getTime();
  const progress = Math.min(1, Math.max(0, elapsed / duration));

  return {
    title,
    description: `${channelName} — ${title}`,
    startTime: slotStart,
    endTime: slotEnd,
    progress,
    isLive: true,
  };
}

/**
 * Gets the next program after the current one.
 */
export function getNextProgram(category: string, channelName: string): ProgramInfo {
  const now = new Date();
  const hour = now.getHours();
  const slotIndex = Math.floor(hour / 4);
  const nextSlotIndex = (slotIndex + 1) % 6;
  const templates = PROGRAM_TEMPLATES[category] || DEFAULT_PROGRAMS;
  const title = templates[nextSlotIndex % templates.length];

  const slotStart = new Date(now);
  slotStart.setHours((slotIndex + 1) * 4, 0, 0, 0);
  if (slotStart < now) slotStart.setDate(slotStart.getDate() + 1);
  const slotEnd = new Date(slotStart);
  slotEnd.setHours(slotStart.getHours() + 4);

  return {
    title,
    description: `${channelName} — ${title}`,
    startTime: slotStart,
    endTime: slotEnd,
    progress: 0,
    isLive: false,
  };
}

/** Format time as HH:MM */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}
