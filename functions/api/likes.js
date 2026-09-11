// Pages Function: likes sin login para el blog.
// - Sin cookies, sin terceros, sin librerías: solo D1 (binding LIKES_DB).
// - Un like por visitante por artículo (hash de IP+UA+slug con sal).
// - GET    /api/likes?slug=<slug>  -> { count, liked }
// - POST   /api/likes  { slug }    -> registra like (idempotente)
// - DELETE /api/likes  { slug }    -> quita el like

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

const SLUG_RE = /^[a-z0-9-]{1,120}$/;
const SALT = 'tcs-likes-v1';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function badRequest(message) {
  return json({ error: message }, 400);
}

async function visitorId(request, slug) {
  const ip = request.headers.get('CF-Connecting-IP') || '';
  const ua = request.headers.get('User-Agent') || '';
  const data = new TextEncoder().encode(`${SALT}|${ip}|${ua}|${slug}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function readSlug(request) {
  if (request.method === 'GET') {
    const slug = (new URL(request.url).searchParams.get('slug') || '').trim().toLowerCase();
    return slug;
  }
  try {
    const body = await request.json();
    return String(body?.slug || '').trim().toLowerCase();
  } catch {
    return '';
  }
}

async function countFor(env, slug) {
  const row = await env.LIKES_DB.prepare('SELECT COUNT(*) AS n FROM likes WHERE slug = ?')
    .bind(slug)
    .first();
  return Number(row?.n || 0);
}

async function likedBy(env, slug, visitor) {
  const row = await env.LIKES_DB.prepare('SELECT 1 AS ok FROM likes WHERE slug = ? AND visitor = ?')
    .bind(slug, visitor)
    .first();
  return Boolean(row);
}

function storageMissing(env) {
  return !env || !env.LIKES_DB;
}

export async function onRequestGet({ request, env }) {
  if (storageMissing(env)) return json({ error: 'likes no configurados' }, 503);
  const slug = await readSlug(request);
  if (!SLUG_RE.test(slug)) return badRequest('slug inválido');
  const visitor = await visitorId(request, slug);
  const [count, liked] = await Promise.all([countFor(env, slug), likedBy(env, slug, visitor)]);
  return json({ count, liked });
}

export async function onRequestPost({ request, env }) {
  if (storageMissing(env)) return json({ error: 'likes no configurados' }, 503);
  const slug = await readSlug(request);
  if (!SLUG_RE.test(slug)) return badRequest('slug inválido');
  const visitor = await visitorId(request, slug);
  await env.LIKES_DB.prepare('INSERT OR IGNORE INTO likes (slug, visitor) VALUES (?, ?)')
    .bind(slug, visitor)
    .run();
  const count = await countFor(env, slug);
  return json({ count, liked: true });
}

export async function onRequestDelete({ request, env }) {
  if (storageMissing(env)) return json({ error: 'likes no configurados' }, 503);
  const slug = await readSlug(request);
  if (!SLUG_RE.test(slug)) return badRequest('slug inválido');
  const visitor = await visitorId(request, slug);
  await env.LIKES_DB.prepare('DELETE FROM likes WHERE slug = ? AND visitor = ?')
    .bind(slug, visitor)
    .run();
  const count = await countFor(env, slug);
  return json({ count, liked: false });
}

export async function onRequest({ request }) {
  return json({ error: 'método no permitido', method: request.method }, 405);
}
