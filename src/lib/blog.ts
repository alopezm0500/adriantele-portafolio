export const CATEGORIES: Record<string, string> = {
  'techco-e-ia': 'Techco e IA',
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
  'tech-en-rojo': '#fb4934',
  'tech-humano': '#fe8019',
  'tech-abierto': '#b8bb26',
  'techco-e-ia': '#83a598',
  'sociedad-y-telecom': '#689d6a',
  technical: '#b16286',
  portafolio: '#d3869b',
  'sin-categoria': '#a89984',
};

export function catColor(key: string): string {
  return CAT_COLORS[key] ?? '#d3869b';
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
