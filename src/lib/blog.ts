export const CATEGORIES: Record<string, string> = {
  'techco-e-ia': 'Techco e IA',
  'por-si-no-sabias': 'Por si no sabías',
  'sociedad-y-telecom': 'Sociedad y Telecom',
  technical: 'Technical',
  portafolio: 'Portafolio',
  'sin-categoria': 'Sin categoría',
  'tech-en-rojo': 'Tech en Rojo',
  'tech-humano': 'Tech Humano',
  'tech-abierto': 'Tech Abierto',
};

export function catName(key: string): string {
  return CATEGORIES[key] ?? key;
}

/** Acentos de color por categoría (pensados para fondo oscuro). */
export const CAT_COLORS: Record<string, string> = {
  'tech-en-rojo': '#d97b7b',
  'tech-humano': '#d9a36b',
  'tech-abierto': '#82ad92',
  'techco-e-ia': '#8b85ff',
  'por-si-no-sabias': '#86aee0',
  'sociedad-y-telecom': '#6fb3bd',
  technical: '#9d8bd9',
  portafolio: '#d9a0b8',
  'sin-categoria': '#9aa0b0',
};

export function catColor(key: string): string {
  return CAT_COLORS[key] ?? '#8b85ff';
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Tiempo de lectura estimado: 200 palabras por minuto. */
export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
