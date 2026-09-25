# Mapa de contrapesos en privacidad y vigilancia — México 2026

Fecha: 2026-09-25 · Elaborado por LeIA para Adrian · Estado: **borrador de investigación, no es el análisis anti-sesgo completo**
Base metodológica: `Ideas/LeIA/metodologia_analisis_mercado.md` (barrido MX+LATAM+BR, mínimo 5 fuentes, red team de 8 preguntas, documentar búsquedas vacías). Aquí solo se cubre el barrido de "quién ya hace esto" y el estado de los contrapesos.

---

## 1. Por qué el diagnóstico de Adrian es correcto: los contrapesos institucionales se removieron

- **INAI**: extinto por reforma constitucional publicada el **20-dic-2024**; disolución el **21-mar-2025**. Sus funciones pasaron a *Transparencia para el Pueblo*, que **no** es órgano autónomo. Era el único ente que podía sancionar el mal uso de datos personales frente al Estado y a particulares.
  Fuente: es.wikipedia.org/wiki/Instituto_Nacional_de_Transparencia,_Acceso_a_la_Información_y_Protección_de_Datos_Personales
- **IFT**: disuelto el **17-oct-2025**. Sus funciones quedaron en la **Agencia de Transformación Digital y Telecomunicaciones (ATDT)** y la **Comisión Reguladora de Telecomunicaciones (CRT)**, ninguna autónoma. El IFT era autónomo por mandato constitucional.
  Fuente: es.wikipedia.org/wiki/Instituto_Federal_de_Telecomunicaciones
- **Consecuencia**: quien ejecuta el registro obligatorio de líneas (CRT) ya no tiene contrapeso institucional, y quien vigilaba el uso de datos personales (INAI) desapareció. La asimetría no es percepción: es diseño institucional.

## 2. Quién empuja hoy (contrapesos reales, verificados)

- **R3D – Red en Defensa de los Derechos Digitales** (https://r3d.mx). Litigio estratégico y documentación. Cuatro años litigando los contratos de Pegasus con la Sedena; un **Tribunal Colegiado confirmó su amparo en jul-2026**. Documenta abusos del registro de líneas (12-ene-2026) y la venta de paquetes de identidad para evadir la "prueba de vida" (04-may-2026). Tiene las cuatro áreas: privacidad, acceso, libertad de expresión, conocimiento libre. **Es el contrapeso más efectivo que existe hoy.**
- **ARTICLE 19 MX y Centroamérica** (https://articulo19.org). 20 años; programa de seguridad integral para periodistas, alertas, informes y litigio en libertad de expresión; trabajo en derechos digitales y Centroamérica. Audiencia: periodistas y personas defensoras.
- **SocialTIC** (https://socialtic.org). "Escuela de Datos": tutoriales, cursos y herramientas para que sociedad civil use datos y se proteja. Audiencia: organizaciones y activistas, no público general.
- **Fundación Datos Protegidos** (https://datosprotegidos.org). **Es chilena, no mexicana** (tiene "No Doy Mi RUT"): litigio, "Ejerce tu derecho", tecnología y género. Referencia regional, no actor local.
- **Privacy Guides** (https://www.privacyguides.org/es/). Sin fines de lucro, en español, con modelado de amenazas y reseñas de herramientas independientes. Es el mejor recurso *de consumo* que existe, pero es global: no cubre INE, CRT, registro de líneas ni el contexto mexicano.

## 3. Búsquedas vacías (lo que NO se encontró)

Documentar lo que no existe es parte de la metodología. No se localizó, en este barrido acotado:

1. **Un proyecto mexicano dedicado a privacidad "de consumo"**. CORRECCIÓN (2026-09-25): existe **Protege.LA** (https://protege.la, de SocialTIC, contacto seguridad@socialtic.org) con tipología de ataques, autodiagnóstico, guías, herramientas y rutas de aprendizaje, activo y en español. La capa de consumo NO está vacía. Lo que sigue sin cubrirse es la capa mexicana de **telecom**: qué implica el registro de líneas a nivel de red, qué ve un operador y qué puede hacer una autoridad con esos datos.
2. **Una explicación técnica pública de lo que implica el registro de líneas a nivel de red** (qué ve un operador, qué es metadato, qué puede y qué no puede hacer una autoridad). Nadie de la industria lo escribe con nombre.
3. **Herramientas públicas para que una persona revise si sus datos están en las filtraciones mexicanas recientes** y qué hacer después.
4. **Medición pública del impacto real** del corte de líneas no registradas del 30-jun-2026 (cuántas se desconectaron, cuántos amparos). Marcado **(verificar)**.

## 4. Lectura estratégica

- El cuello de botella del lado ciudadano **no es visibilidad ni canal: es capacidad**. Cuatro organizaciones, presupuesto escaso y expertos técnicos contados cubriendo a un Estado con 30.2 millones de registros y el aparato completo.
- Por eso, cualquier aporte de un ingeniero de core vale más como **capacidad** (traducción técnica, documentación, herramientas, pericia para litigio) que como **marca propia**: no hace falta una organización nueva ni una cara pública nueva, hace falta músculo para las que ya litigan y ganan.
- Y define el hueco real: **la capa de traducción + la capa técnica local** (mexicana, en español, de consumo) no está cubierta por nadie; las organizaciones no están dimensionadas para cubrirla porque su prioridad es el litigio y la protección de personas en riesgo.

## 5. Pendientes de este mapa

- Reconocimiento de entradas concretas y herramientas: ver `capacidad_ecosistema_20260925.md`.
- Ampliar el barrido: Cultivando Género, Luchadoras, Redes Ayuda (MX); Coding Rights e InternetLab (BR); Derechos Digitales (CL); Access Now y EFF (referencia). Falta verificar quién da apoyo técnico forense y quién recibe donativos.
- Red team de 8 preguntas y decisión de Adrian sobre nombre, canal y frontera de contenido.
