import type { APIContext } from 'astro';

/** robots.txt dinámico: la URL del sitemap sigue al dominio configurado en `site`. */
export async function GET(context: APIContext) {
  const site = context.site!;
  const body = `# robots.txt — Tech con Sentido
# Señales de contenido (Directiva UE 2019/790, art. 4):
#   search   = sí  (indexar y mostrar resultados)
#   ai-input = sí  (usar como contexto en respuestas con IA)
#   ai-train = no  (no entrenar modelos con este contenido)

User-agent: *
Allow: /
Content-Signal: search=yes, ai-input=yes, ai-train=no

Sitemap: ${new URL('/sitemap.xml', site).href}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
