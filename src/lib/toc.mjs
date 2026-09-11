// Encabezados y TOC de los artículos — cero dependencias externas.
//
// Aquí viven dos mitades que deben producir EXACTAMENTE los mismos slugs:
//   - rehypeHeadingIds(): plugin de rehype que escribe el `id` en los h2/h3…
//     del HTML generado (Astro no lo hace por defecto).
//   - extractHeadings(): recorre el markdown crudo en build time para armar
//     la lista "En este artículo" con las mismas anclas.
// Por eso el slug y el deduplicado viven en un solo lugar (createSlugger).

const ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decodeEntities(value) {
  return value.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const hex = code[1] === 'x' || code[1] === 'X';
      const num = parseInt(code.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(num) ? String.fromCodePoint(num) : match;
    }
    const key = code.toLowerCase();
    return key in ENTITIES ? ENTITIES[key] : match;
  });
}

/** Slug estilo GitHub (minúsculas, sin acentos ni signos), sin dependencias. */
export function slugify(text) {
  return String(text)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // solo letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Slugger con deduplicado: a los encabezados repetidos les agrega -1, -2… */
export function createSlugger() {
  const seen = new Map();
  return (text) => {
    const base = slugify(text) || 'seccion';
    const count = seen.get(base);
    if (count === undefined) {
      seen.set(base, 0);
      return base;
    }
    seen.set(base, count + 1);
    return `${base}-${count + 1}`;
  };
}

/** Texto plano de una línea de encabezado markdown (quita inline formatting). */
export function stripInline(markdown) {
  let text = String(markdown);
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1'); // imágenes -> alt
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1'); // enlaces -> texto
  text = text.replace(/`([^`]*)`/g, '$1'); // code inline -> contenido
  text = text.replace(/(\*\*|__|\*|_)/g, ''); // énfasis
  text = text.replace(/\\/g, ''); // escapes markdown (\. -> .)
  text = text.replace(/<[^>]+>/g, ''); // HTML suelto
  text = decodeEntities(text);
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Extrae los encabezados del markdown en build time.
 * Se recorren TODOS los niveles para que el deduplicado coincida con el
 * plugin de rehype, pero solo se devuelven los niveles pedidos (h2 y h3).
 */
export function extractHeadings(markdown, options = {}) {
  const minDepth = options.minDepth ?? 2;
  const maxDepth = options.maxDepth ?? 3;
  const slug = createSlugger();
  const headings = [];
  let inFence = false;
  let fenceChar = '';

  for (const rawLine of String(markdown).split(/\r?\n/)) {
    const fence = rawLine.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      if (!inFence) {
        inFence = true;
        fenceChar = fence[1][0];
      } else if (fence[1][0] === fenceChar) {
        inFence = false;
      }
      continue;
    }
    if (inFence) continue;

    const match = rawLine.match(/^(#{1,6})\s+(.*?)(?:\s+#+)?\s*$/);
    if (!match) continue;

    const depth = match[1].length;
    const text = stripInline(match[2]);
    const id = slug(text);
    if (depth >= minDepth && depth <= maxDepth) {
      headings.push({ depth, text, id });
    }
  }

  return headings;
}

/** Todos los nodos de texto (y el alt de imágenes) de un nodo hast. */
function textOf(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value || '';
  if (node.type === 'element' && node.tagName === 'img') {
    return node.properties?.alt ?? '';
  }
  if (Array.isArray(node.children)) {
    return node.children.map(textOf).join('');
  }
  return '';
}

function walk(node, visit) {
  visit(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, visit);
  }
}

/**
 * Plugin de rehype: agrega `id` a los encabezados h1–h6 del markdown.
 * Usa el mismo slugger que extractHeadings(), así que las anclas del TOC
 * apuntan exactamente a los ids del HTML.
 */
export function rehypeHeadingIds() {
  return (tree) => {
    const slug = createSlugger();
    walk(tree, (node) => {
      if (node && node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
        node.properties = node.properties || {};
        if (node.properties.id == null) {
          node.properties.id = slug(textOf(node));
        }
      }
    });
  };
}
