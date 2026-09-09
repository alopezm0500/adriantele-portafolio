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
