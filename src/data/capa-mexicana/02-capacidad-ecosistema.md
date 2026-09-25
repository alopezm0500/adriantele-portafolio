# Capacidad para el ecosistema — entradas concretas y herramientas que nadie tiene

Fecha: 2026-09-25 · Reconocimiento hecho por LeIA a petición de Adrian · Complemento de `mapa_contrapesos_mx_20260925.md`
Regla de Adrian: **sin cara pública ni nombre** en el eje público; sí se admite círculo de confianza (una organización sabe quién es; el público no).

---

## 0. Corrección importante al mapa (hallazgo de hoy)

**Protege.LA** (https://protege.la, de SocialTIC, contacto seguridad@socialtic.org) **ya cubre la capa de consumo en español**: tipología de ataques digitales, estafas, **autodiagnóstico de seguridad digital** (checklists), **guías**, **herramientas** y **rutas de aprendizaje para puntos de contacto**. Está activo (banner con material de julio-2026) y su audiencia son periodistas, activistas y organizaciones.

Esto corrige lo que afirmé antes: no es cierto que nadie haga guías de privacidad "de consumo" en español. Lo que sigue sin cubrirse es la **capa mexicana específica de telecom**: qué implica el registro de líneas a nivel de red, qué ve un operador, qué puede y qué no puede hacer una autoridad con esos datos. Es decir: contribuir a lo que existe > fundar algo nuevo.

### Protege.LA al detalle (verificado 2026-09-25)

- Proyecto de SocialTIC, **creado en 2018 y actualizado de forma continua**; en español y en lenguaje sencillo, dirigido a sociedad civil, periodistas y activistas de Latinoamérica.
- Contenido: guías (seguridad digital básica, proteger cuentas, qué hacer ante agresiones en línea), catálogo de **herramientas** filtrado por categorías (servicios en línea, móviles, infraestructura y sitios web, herramientas físicas, equipos de cómputo; subcategorías de cifrado, contraseñas, VPN, respaldos, comunicaciones seguras), tipología de ataques digitales, **checklist de autodiagnóstico** que devuelve recomendaciones personalizadas, y rutas de aprendizaje para "puntos de contacto".
- **Hueco preciso**: todo el material enseña a *protegerse* (herramientas, hábitos, cifrado). Nada enseña a **ejercer derechos**: solicitudes ARCO contra empresas privadas, registro de líneas, verificación de identidad, brokers de datos, filtraciones. Ese es exactamente el hueco imaginado, y es donde el conocimiento mexicano aporta.
- **Canal de colaboración (declarado por ellos)**: "Protege.la es un espacio abierto para compartir recursos... siéntete libre de enviar tus recursos/recomendaciones" → contacto **seguridad@socialtic.org**. Entrada de fricción bajísima: no pide código ni compromiso de tiempo, pide material.
- Consecuencia estratégica sugerida: una guía mexicana de privacidad presentada **como recurso a Protege.LA** cumple la regla "que la publique una organización" y evita fundar un proyecto propio sin audiencia.

---

## 1. Cinco entradas concretas (requisitos, horas, riesgo)

### 1. Localización en Privacy Guides (Crowdin) — **la más limpia, trabajo ya pedido**
- Verificado hoy: proyecto activo en https://crowdin.com/project/privacyguides; el sitio es código abierto (github.com/privacyguides/privacyguides.org) y lo construyen voluntarios; aceptan sugerencias de traducción por Crowdin.
- Requisitos: cuenta **seudónima**, inglés–español técnico, consistencia de glosario.
- Horas: 1 h para el primer aporte; 2-4 h/semana sostenidas rinden mucho.
- Riesgo: **nulo** en lo político (no toca México ni conocimiento interno de la operadora).

### 2. Código abierto de SocialTIC (GitHub)
- Verificado: https://github.com/socialtic existe.
- Requisitos: revisar repos e issues abiertos; empezar por un issue pequeño de documentación o bug.
- Horas: variable, 2-3 h por aporte.
- Riesgo: bajo. Si quiere cero atribución pública, cuenta seudónima de GitHub; si acepta que la org sepa quién es, cuenta propia.

### 3. Infraestructura y mantenimiento para una organización mexicana
- El trabajo que nadie quiere en organizaciones pequeñas: administrar, monitorear, respaldar servicios. Su homelab con Prometheus, Grafana y runbooks es exactamente ese músculo.
- Requisitos: 2-4 h/semana **sostenidas** (no sprint) y confianza mutua. La conversación de entrada tiene que declarar la regla desde el inicio: "trabajo sin cara pública".
- Canales: socialtic.org/contacto, articulo19.org, r3d.mx/quienes-somos (R3D tiene equipo profesional completo: abogada, dirección, arte, talento humano).
- Riesgo: bajo, y es donde su perfil rinde más.

### 4. Medición de censura (OONI) y relés de Tor
- Verificado: OONI pide aportes de localización, listas de sitios a testear y código (https://ooni.org/get-involved/); Tor Project pide voluntarios que donen ancho de banda, con requisitos según el tipo de relé y recursos legales (https://community.torproject.org/relay/).
- Recomendación: el carril OONI (mediciones y listas de sitios mexicanos) es más barato y más útil para México que operar un relé.
- Advertencia: un relé **nunca en casa** — su línea queda ligada a su nombre por el propio registro y el ISP ve el patrón de tráfico. Si algún día, en VPS en el extranjero.
- Horas: 1-2 h de montaje, mantenimiento casi nulo.

### 5. Dinero
- Verificado: R3D (https://r3d.mx) y ARTICLE 19 MX (campaña en https://participa.articulo19.org) aceptan donativos; ARTICLE 19 además tiene taller/registro en odoo-article19.com/event y su programa de seguridad integral para periodistas.
- Requisitos: ninguno. Horas: cero. Exposición: cero. Es la forma más eficiente por peso.

---

## 2. Herramientas que nadie tiene (a fondo)

Criterio: herramientas que **abatan el costo de ejercer un derecho** para alguien que no puede pagar un abogado. Si no reduce ese costo, no vale la pena.

### 2.1 Generador de solicitudes de derechos ARCO y de oposición
- **Qué es**: la persona escribe el nombre de la empresa, responde 3-4 preguntas y obtiene la solicitud formal (acceso, rectificación, cancelación u oposición) con los elementos que exige la ley, más el texto de seguimiento si le responden mal o no le responden.
- **Qué existe hoy (verificado por búsqueda)**: hay formularios oficiales **para sujetos obligados** (centrolaboral.gob.mx, datos-personales.scjn.gob.mx), pero **para empresas privadas no hay herramienta central**: cada una tiene su propia vía en su aviso de privacidad, y muchas ni canal tienen.
- **Hueco real**: el lado privado. Es donde están los datos de todos.
- **Requisito crítico**: verificar **quién recibe hoy las quejas** por incumplimiento ahora que el INAI no existe (probablemente la Secretaría Anticorrupción y Buen Gobierno / Transparencia para el Pueblo) — **(verificar) antes de publicar**.
- Horas de construcción: 20-40 h para una primera versión. Riesgo: bajo (no usa conocimiento interno).

### 2.2 Opt-out de data brokers mexicanos
- **Qué es**: inventario de quién vende datos de personas en México y generador de solicitudes de baja, con seguimiento de quién responde.
- **Hallazgo honesto**: en la búsqueda no apareció ningún servicio local; el mercado está dominado por servicios estadounidenses de borrado, financiados con publicidad y suscripción. **(verificar con barrido más amplio.)**
- **Riesgo/realidad**: el retorno es incierto; muchos brokers no responden y el inventario mexicano exige investigación previa. Es la más ambiciosa y la menos segura de las cuatro.

### 2.3 Verificador de exposición en filtraciones mexicanas
- **Qué es**: que una persona sepa si sus datos salieron en una filtración y qué hacer después.
- **Por qué nadie lo hace**: para decir "tus datos están ahí" hay que **poseer la filtración**, y poseer datos personales filtrados es en sí un riesgo legal y ético. Ahí se mueren casi todos los intentos.
- **Diseño que sí evita el problema**: verificación por **prefijo de hash** (la técnica de k-anonimato que usa Have I Been Pwned): el usuario manda solo los primeros caracteres del hash de su dato, nunca el dato. El servicio no custodia la filtración; solo compara hashes.
- Horas: 40-80 h. Riesgo: medio-alto en diseño, **nulo si no se poseen datos filtrados**. Requiere revisión legal antes de publicar.

### 2.4 Capa mexicana de modelado de amenazas
- **Qué es**: "estoy en tal situación —periodista, mujer con una expareja que la rastrea, activista, funcionaria—, ¿qué hago con mi línea, mis cuentas, mi teléfono?"
- **Honestidad**: Protege.LA ya tiene autodiagnóstico y rutas de aprendizaje. **No duplicar**: aportar el módulo de telecom (registro de líneas, qué ve un operador, SIM swap, verificación de identidad) a lo que ya existe, o entregarlo como anexo.
- Riesgo: cuidado aquí, porque el módulo técnico roza el conocimiento interno. La frontera: describir **cómo funciona** el sistema es explicable; lo que no puede salir es configuración interna, topología ni datos de la operadora.

### 2.5 Pericia técnica para litigio (memo privado, sin firma)
- La más valiosa y la única que necesita reglamento propio: explicar a quien litiga qué ve técnicamente un operador y qué implica el registro a nivel de red.
- Sin prisa, con reglas explícitas, y consciente del conflicto con su relación laboral.

---

## 3. Reglas de diseño comunes (si alguna se construye)

1. **Sin cuentas, sin logs, sin rastreadores.** Nada que custodiar es nada que filtrar.
2. **Estático y barato**: sitio estático (su stack Astro sirve) en Cloudflare Pages; cero backend si se puede.
3. **Offline primero**: que la herramienta funcione descargada, para quien la necesita sin conexión segura.
4. **Español de México**, no traducción automática.
5. **Revisión legal antes de tocar datos filtrados**, sin excepción.
6. **Que la publique una organización**, no él. Una herramienta huérfana no tiene lectores, y él renunció a la palanca de marca: necesita el altavoz de alguien más.

---

## 4. Límites honestos

- Nada de esto da crédito, audiencia ni marca. Es músculo aburrido y nadie se lo va a reconocer.
- Las organizaciones piden continuidad, no un sprint; compite con sus 2-3 horas diarias ya repartidas entre Identik, Xhunco y el libro.
- Los carriles 4 y 5 (medición/relés y pericia para litigio) implican conversaciones sobre identidad que conviene tener **antes** de empezar, no después.

## 5. Pendientes

- Verificar autoridad que recibe quejas de protección de datos tras la extinción del INAI.
- Barrido más amplio de opt-out de brokers y de herramientas de exposición en México/LATAM (Coding Rights, InternetLab, Derechos Digitales).
- Confirmar si R3D y ARTICLE 19 tienen canal público de voluntariado técnico.
