---
title: "6G: la discusión que importa no es la velocidad, es cuánto de 5G vamos a conservar"
pubDate: "2026-10-01"
description: "NGMN pidió a 3GPP una migración de 5G a 6G más simple y dejó a MRSS como solución base. Detrás del tecnicismo hay una pregunta que decide el costo de la próxima década: cuánto de la red que ya existe habrá que reemplazar."
categories: [sociedad-y-telecom, tech-en-rojo]
---

Cuando se anuncia una generación nueva de telefonía, la conversación pública se llena de gigabits por segundo. Quienes operamos redes miramos otra cosa: cuántas arquitecturas distintas vamos a tener que mantener vivas al mismo tiempo.

Por eso lo más importante que pasó alrededor de la 6G en septiembre no fue un anuncio de velocidad. Fue un documento de once páginas que pide frenar.

El 8 de septiembre de 2026, la alianza **NGMN** publicó una actualización de sus mensajes clave sobre arquitectura y migración hacia 6G, aprobada por su consejo el 3 de septiembre y dirigida expresamente a la plenaria de septiembre de **3GPP**, justo cuando ese organismo define las prioridades de la fase de estudio de la próxima generación. TeleSemana lo resumió sin rodeos: [NGMN pidió a 3GPP una migración de 5G a 6G más simple](https://www.telesemana.com/blog/2026/09/10/la-6g-entra-en-la-hora-de-las-decisiones-ngmn-pide-a-3gpp-una-migracion-de-5g-a-6g-mas-simple/).

Y cuando la organización que reúne a los operadores que van a pagar la red pide "más simple" en lugar de "más rápida", conviene leer el detalle.

## Qué pidió NGMN, en mis palabras

El documento no propone una tecnología nueva ni anuncia capacidades espectaculares. Propone una forma de decidir. Sus mensajes clave se pueden ordenar así:

- **Una ruta principal, definida pronto.** La industria debe converger cuanto antes en un solo camino de migración —con *Multi-RAT Spectrum Sharing* (MRSS) como solución base— para evitar que cada generación sume combinaciones nuevas que después tienen que soportar los terminales, la red de radio y el core.
- **Las alternativas quedan condicionadas.** Cualquier camino adicional debe demostrar que resuelve una necesidad de despliegue que MRSS no cubre bien y que su valor extra justifica la complejidad extra que introduce.
- **Criterios explícitos y selección activa.** Las decisiones sobre opciones adicionales deben basarse en evidencia suficiente sobre eficiencia de MRSS, viabilidad de implementación, impacto en hardware, costo total de propiedad, complejidad operativa y viabilidad comercial. Nada de mantener cinco puertas abiertas "por si acaso": hay que ir cerrando conforme llega la evidencia.
- **El core de 6G cambia la ecuación.** Si el core de 6G termina siendo una evolución del core de 5G o una arquitectura claramente distinta, el valor relativo de cada opción de migración en radio cambia por completo.

El propio documento lo dice con una frase que en operaciones se entiende demasiado bien: los operadores pueden ser reacios a desplegar soluciones cuya complejidad y costo de migración no se justifiquen con beneficios suficientemente materiales.

Dicho de otro modo: **que algo se pueda construir no significa que deba formar parte de la red**.

## Qué es MRSS y por qué es la pieza central

MRSS no es un producto nuevo, es una manera de convivir. Significa que 5G y 6G **comparten el mismo espectro y los mismos recursos de radio de forma dinámica**, en lugar de que cada generación tenga su carril propio durante años.

Lo que NGMN pide estudiar a fondo es justamente lo difícil de esa promesa: el costo del canal de control, el reparto dinámico entre usuarios de 5G y de 6G en la misma portadora, la compartición dinámica de recursos de banda base, el soporte tanto de portadoras FDD como TDD, y la agregación de portadoras de 6G.

Traducido a la vida real de quien opera: sin MRSS, la llegada de 6G significa reordenar espectro, sumar equipos, sumar procesos y sumar pruebas. Con MRSS, la red nueva se monta encima de la que ya está encendida y el usuario ni se entera de cuándo cambió de generación: no hay que cambiarle el equipo a nadie por decreto.

En una región como América Latina esto pesa más que en otros mercados. El espectro es escaso, caro y está repartido en bloques pequeños y fragmentados; reordenarlo para estrenar generación es de las operaciones más caras y más lentas que existen. Compartir el espectro es mucho más barato que pedirle a todos los usuarios que cambien de teléfono para poder reutilizarlo.

## La lección que ya pagamos con 5G

Esta es la parte que conozco de cerca, porque trabajo en operaciones de core.

5G arrancó con una arquitectura *Non-Standalone* (NSA): la radio nueva se apoyaba en el core de 4G. Fue una decisión inteligente para lanzar antes y empezar a vender. El problema es que "lanzar antes" no fue un atajo, fue una segunda red caminando en paralelo durante años.

Lo que eso significa en el día a día no aparece en los folletos. Significa dos maneras de encaminar una llamada, nodos que hablan dos generaciones a la vez, alarmas duplicadas, herramientas duplicadas, pruebas duplicadas y una pregunta recurrente en cada incidente: **¿este nodo lo atiende el equipo de datos o el equipo de voz?** Significa que cada actualización hay que validarla dos veces, porque una mitad de la red ya vive en SA y la otra sigue dependiendo de NSA. Y significa, sobre todo, guardias.

He participado en migraciones de core para operadoras de la región y la lección es siempre la misma: **no migras tecnología, migras tráfico vivo**. La tecnología se instala en una ventana de mantenimiento; migrar es mover clientes reales de un nodo a otro sin que ningún teléfono suene a la mitad. Cada ventana de esas es una apuesta: si algo se calcula mal, no pierdes un indicador en un tablero, dejas sin llamadas y sin datos a gente que quizá está esperando una llamada importante.

Ese es el costo que las fases de estudio casi nunca ponen en el papel. La factura no llega en la compra del equipo, llega en los años siguientes: en capacitación, en documentación, en integradores, en herramientas, en personal que tiene que saber más cosas para hacer el mismo trabajo. La complejidad no se cobra una vez; se cobra cada año.

Por eso entiendo el tono del documento de NGMN. No es una reflexión académica sobre arquitecturas: es gente que ya pagó la cuenta de la generación anterior.

## La asimetría: quién escribe el menú y quién compra el menú

Aquí hay una parte incómoda que conviene decir en voz alta, y el análisis de TeleSemana lo expone bien.

NGMN no es un foro técnico más: es una organización impulsada por operadores. En el propio documento aparecen los equipos de **China Mobile** (que lidera el proyecto), **Vodafone** (co-líder), y también **BT, Deutsche Telekom, Orange, Telefónica, SK Telecom, MTN y Smart PH**. Es decir: quienes firman son, en buena medida, las empresas que después despliegan y mantienen.

3GPP funciona distinto, y no es un organismo de fabricantes: participan operadores, proveedores de infraestructura, fabricantes de semiconductores y de dispositivos, y buena parte de las decisiones se construyen por consenso. Pero el trabajo técnico depende mucho de las contribuciones de quienes tienen capacidad de investigación y desarrollo. Un operador puede tener claro cuánto quiere invertir y cuántas arquitecturas está dispuesto a mantener; otra cosa es tener cientos de ingenieros durante años trabajando en nuevas formas de onda, algoritmos de radio, chipsets, interfaces y señalización, generando simulaciones, prototipos y patentes capaces de convertir una idea en especificación.

No es una conspiración. Un fabricante también necesita estándares globales, escala y productos que alguien compre: una tecnología brillante sin mercado no es un éxito. Pero la ecuación no es la misma para quien desarrolla una capacidad —que puede representar innovación, propiedad intelectual y una nueva generación de producto— que para quien tendrá que convivir con ella quince años, integrando otra arquitectura y otra capa de operación dentro de una red que ya tiene varias generaciones encima.

Los operadores tienen la última palabra sobre lo que compran. Los proveedores tienen una influencia enorme sobre el menú. Y los criterios que pide NGMN —impacto en hardware, efecto en el core, complejidad operativa, costo total— son precisamente las preguntas de quien va a pagar la cuenta, no de quien tiene que demostrar que algo es técnicamente posible.

## Qué significa esto para México y América Latina

En el cuarto donde se decide, la región no está. Compramos el resultado del menú, con menos escala para negociarlo y con menos ingenieros por línea que cualquiera de las operadoras que firman ese documento.

Eso tiene una consecuencia práctica: **cada punto de complejidad que se agregue al estándar lo va a pagar la operación con menos manos disponibles**. Un mercado que compra red no necesita la generación más sofisticada; necesita la que pueda operar completo, los 365 días del año, con el equipo que tiene y con la gente que puede contratar.

Mi lectura, como ingeniero que vive del lado de la operación, es que para la región MRSS vale doble: además del espectro, permite conservar procesos, herramientas y conocimiento que ya existen. Y eso, en un mercado donde el talento técnico de core y radio es escaso y se pelea entre pocas empresas, no es un detalle de eficiencia: es capacidad de mantener el servicio.

## Lo que yo voy a vigilar

Tres señales, en orden de importancia para quien opera:

**1. La evidencia técnica de MRSS.** Eficiencia real, costo del canal de control, reparto dinámico de recursos de banda base y comportamiento con portadoras FDD y TDD. Si eso no se demuestra, la decisión se pospone y el costo se traslada a quien tenga que desplegar sin certezas.

**2. Si el core de 6G es evolución del de 5G o algo distinto.** Es, en mi opinión, la pregunta más grande de todo el expediente, y la que menos titulares recibe. De ella depende si lo que hago hoy —voz, core, señalización— se conserva o se reemplaza, y no es lo mismo integrar una capa nueva que rehacer la que ya funciona.

**3. Cuánto le queda todavía a 5G.** En julio de 2026, TeleSemana documentó una demostración de AT&T y Ericsson que usó infraestructura 5G para desarrollar capacidades de sensorización, esas que suelen presentarse como exclusivas de 6G. Si el software, la IA y más capacidad de proceso permiten agregar funciones sin cambiar la infraestructura, la frontera entre una generación y la siguiente se vuelve borrosa. Y si esa frontera se borra, la discusión deja de ser cómo migrar a 6G y pasa a ser cuánto tiempo más puede trabajar 5G.

## Mi opinión, sin humo

Trabajo en operaciones de core en una operadora en México, así que mi sesgo es claro: veo todos los días lo que cuesta mantener una red viva, y por eso leo la petición de NGMN con simpatía.

Dicho eso, no creo que la discusión real sea entre operadores buenos y fabricantes malos. Es una discusión sobre **quién paga la complejidad** y cuándo se decide pagarla. Durante la fase de investigación, mantener muchas opciones abiertas es cómodo: nadie sabe cuál funcionará mejor y nadie quiere cerrar una apuesta tecnológica que podría valer oro. El problema es que esa comodidad de laboratorio se convierte, en la fase comercial, en arquitecturas que alguien tiene que financiar, integrar y operar durante la próxima década.

La flexibilidad es una virtud mientras se discute el estándar. Se convierte en deuda técnica en cuanto se enciende la primera celda.

Si algo aprendí en estos años es que la red que sobrevive no es la más avanzada: es la que se puede mantener un martes a las tres de la mañana, con la gente que tienes, la documentación que existe y las herramientas que alguien capacitó. La 6G no se va a medir por los gigabits del anuncio, sino por cuánto de la red que ya existe nos va a dejar conservar.

¿Crees que esta vez la próxima generación llegue más simple, o vamos a pagar otra década de convivencia entre generaciones?

---

**Fuentes principales:** NGMN Alliance, *6G Architecture and Migration Options – An Operator View*, mensajes clave actualizados, versión 1.0 del 8 de septiembre de 2026 (aprobada por el consejo de NGMN el 3 de septiembre de 2026), documento público del programa 6G; NGMN, *6G Architecture and Migration Options – An Operator View*, junio de 2026; TeleSemana, "La 6G entra en la hora de las decisiones: NGMN pide a 3GPP una migración de 5G a 6G más simple", 10 de septiembre de 2026; TeleSemana, "Los operadores dicen basta otra vez: el 6G no puede repetir los errores del 5G", 3 de junio de 2026; TeleSemana, "Estamos hablando demasiado pronto de 6G: la demostración de AT&T y Ericsson debería reabrir el debate sobre la migración desde 5G", 14 de julio de 2026.

**Nota metodológica:** los mensajes clave, los criterios de evaluación y la lista de operadores participantes se toman directamente del documento público de NGMN (8 de septiembre de 2026). La lectura sobre la asimetría entre NGMN y 3GPP, la interpretación de la experiencia NSA→SA y el detalle de la demostración de AT&T y Ericsson provienen del análisis de TeleSemana del 10 de septiembre de 2026 y del artículo del 14 de julio de 2026, y se presentan con esa atribución; el detalle de la demostración se recoge de una sola fuente. Las apreciaciones sobre operación, migración de tráfico vivo y costo de la complejidad son mi lectura desde la operación de core, no datos de un informe.
