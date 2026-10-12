---
title: "Tu llamada no entra más rápido en 5G: la paradoja que Ookla midió en ocho mercados"
pubDate: "2026-10-12T10:00:00"
description: "Pruebas controladas en ocho mercados dejan un resultado incómodo: la voz sobre 5G conecta en 1.96 segundos de mediana contra 1.87 de VoLTE. El mejor tiempo del estudio no es 5G: es una red 4G en Seúl."
categories: [sociedad-y-telecom]
---

Hay un número que no va a aparecer en ninguna diapositiva de promoción. En pruebas controladas sobre ocho mercados, la voz sobre 5G —VoNR— conecta en 1.96 segundos de mediana. La voz sobre 4G —VoLTE— conecta en 1.87. La tecnología nueva es, en el agregado, ligeramente más lenta que la vieja. Y de los operadores con volumen suficiente en las dos tecnologías, solo seis de ocho conectaron más rápido en 5G que en 4G.

Ookla publicó el análisis el 6 de octubre y lo tituló sin adornos: la paradoja de la voz en 5G. Su subtítulo es todavía más claro, y vale la pena leerlo dos veces: las mejores redes de voz del mundo están construidas sobre pies de VoLTE maduros; la superioridad de VoNR depende de la implementación, no es inherente a la tecnología.

Eso es exactamente lo que llevo años viendo desde el lado que opera. La voz no es un servicio que se despliega: es un servicio que se afina. Y afinar toma una década.

## Qué se midió y qué no

El estudio usa pruebas controladas (RootMetrics, o Speedtest Drive en algunos mercados): equipos idénticos, scripts idénticos y rutas predefinidas, recorridas por equipos entrenados. No es dato de multitud de usuarios medido desde una app; es el mismo instrumento pasando por los mismos lugares, y eso permite comparar entre países sin la contaminación habitual.

Los mercados son Seúl, Londres, Malasia (nacional), Nueva York, Singapur, Lisboa y Luanda, medidos en el segundo semestre de 2025, más Manila en el primer semestre de 2026.

La métrica es una sola, y es la correcta para hablar con personas: **tiempo de establecimiento de llamada**, de presionar “llamar” a escuchar el tono de retorno.

Hay que subrayar lo que el estudio **no** mide. No mide calidad de audio, no mide llamadas caídas, no mide qué pasa en el minuto 40 de una llamada cuando el usuario se mueve entre celdas. Y no mide la causa de nada: eso lo veremos en la segunda parte de esta serie, porque es justo la mitad que un cronómetro externo no puede ver.

## La mediana no premia a la generación

- VoNR: 1.96 s de mediana global. VoLTE: 1.87 s. La diferencia es de alrededor del 5%, dentro del margen que el propio estudio considera comparable.
- VoLTE tiene, además, una proporción ligeramente mayor de llamadas por debajo de la meta de 2 segundos.
- La divergencia real no está en la mediana, sino en las colas y en la dispersión entre operadores.

Y el mejor tiempo de todo el estudio no es 5G. Es de LG U+ en Seúl: 0.73 segundos de mediana en VoLTE, con SK Telecom a 0.99 segundos en la misma ciudad. Los dos coreanos quedan por debajo de cualquier despliegue de VoNR medido, incluido el mejor de todos, que también es asiático: Singtel en Singapur, con 1.07 segundos en VoNR, mejor que su propio VoLTE (1.22 s) y con más del 90% de llamadas bajo los 2 segundos.

En Europa el panorama es el mismo: en Londres, EE conecta en 1.37 s y Three en 1.41 s, ambas en VoLTE, con más del 93% de llamadas dentro de la meta. En Lisboa, MEO logra 1.67 s, también en VoLTE.

Traducido: la generación explica menos que la madurez. VoLTE lleva una década de refinamiento —señalización SIP optimizada, portadores dedicados de calidad de servicio, continuidad de llamada hacia redes viejas— y eso no es una actualización que se instala, es trabajo acumulado.

## Lo que la mediana esconde

Un cronómetro de voz no debería leerse en la mediana. Se lee en dos números: qué porcentaje de llamadas cae bajo el umbral que el usuario percibe como instantáneo, y qué tan gruesa es la cola.

Ese umbral es de 2 segundos. Por debajo, el establecimiento se siente inmediato; arriba de 4 o 5 segundos, la persona empieza a dudar de si la llamada falló y cuelga. El estudio lo atribuye a un trabajo de 1968 sobre tiempos de respuesta conversacionales entre humanos y computadoras, y aquí conviene un matiz honesto: ese trabajo fija los umbrales clásicos en 0.1, 1 y 10 segundos, no en 2. El 2 no salió de ahí. Es una convención de experiencia de usuario que la industria adoptó, y que Ookla usa como referencia porque es la que se entiende. Vale la pena decirlo, porque el número circula como si fuera una constante física y no lo es.

Los ejemplos que el estudio deja ver son demoledores, y los saco a la mesa con nombre:

- **Starhub, Singapur.** Su VoNR tiene una mediana de 1.82 s, que a primera vista se ve muy respetable. Pero su percentil 95 se dispara a **6.33 s** y solo el 57% de las llamadas VoNR cumplió la meta de 2 segundos. En su VoLTE, en cambio, casi el 80% de las muestras cumple y el p95 se queda en 2.38 s. Es decir: en VoNR conecta 32% más lento que lo que ya lograba en 4G.
- **KT, Corea.** Su VoNR queda 13% por detrás de su propio VoLTE, en el país con las mejores redes de voz del mundo.
- **M1, Singapur.** Su VoNR aparece en el estudio con una mediana de 3.62 s, y aun así mejora 43.5% contra su VoLTE… que medía 6.41 s. No es un logro del 5G: es una línea base en 4G que nunca se arregló, y la tecnología nueva solo la maquilla. Casi tres de cada cuatro llamadas de esa red se cursaron por VoNR, con colas extremas que apuntan a reglas de política mal puestas, cobertura incompleta o cuellos de botella de señalización.

Ahí está la lección que ningún comunicado va a recoger: **el 5G no arregla lo que no se optimizó en 4G**. Si tu VoLTE tarda 6 segundos, mudarte a VoNR no te vuelve rápido; te vuelve menos malo.

## La brecha entre operadores pesa más que la brecha entre tecnologías

Este es, para mí, el hallazgo más útil del estudio, y el que menos se va a citar.

En Asia desarrollada, el porcentaje de llamadas bajo 2 segundos va de **98.5% de SK Telecom** a **0.1% de M1 en Singapur**. Mismo continente, mismos teléfonos en el bolsillo de la gente, algunas de las redes más avanzadas del planeta. En Singapur, dentro del mismo mercado y bajo el mismo regulador: Singtel con 1.07 s en VoNR frente a M1 con 3.62 s. En Reino Unido: EE y Three arriba del 93% de cumplimiento, mientras otro grupo de operadores se queda cerca de los 2.3 s con apenas 30 a 35% de cumplimiento.

Es decir: la diferencia entre dos operadores del mismo país es mucho mayor que la diferencia entre VoLTE y VoNR a nivel global. La tecnología de acceso no te salva de la disciplina operativa, y la disciplina operativa te alcanza para ganarle a la tecnología.

## La herencia sí se paga

Cuando no hay VoLTE ni VoNR, o cuando la cobertura falla, el teléfono tiene que caer hacia atrás. El estudio pone números a ese retroceso y son los más duros del documento: las llamadas con **CSFB** —regresar a 2G o 3G para completar la llamada— tienen una mediana de **4.48 segundos**, más del doble que VoLTE, con un percentil 95 de 10.75 s y **5.5% de las llamadas por arriba de los 10 segundos**. En VoLTE esa proporción es de 0.49%: once veces menos.

Dos viñetas que muestran lo mismo en dos continentes:

- **Luanda.** Africell, operando con CSFB, entrega 4.97 s de mediana y **0% de cumplimiento** de la meta de 2 segundos. Unitel, con VoLTE desplegado, logra 2.49 s y 55% de cumplimiento. Sigue lejos de los mercados maduros, pero ya es otro deporte.
- **Manila.** Globe logra 1.65 s de mediana —con 99.85% de su tráfico de voz en VoLTE— y se coloca al nivel de operadores maduros como MEO en Portugal. Smart queda en 2.30 s, pero con un percentil 95 de 7.23 s: más del triple de su mediana. Y DITO, la tercera operadora y la única con core 5G construido desde cero, no comercializa VoNR todavía: como sus usuarios están acampados en la capa 5G, el dispositivo ejecuta fallback a 4G para poder completar la llamada. Resultado: 4.59 s de mediana, con 89% de sus llamadas de voz pasando por ese mecanismo.

Ese último caso es un recordatorio útil para cualquier discusión de arquitectura: **una red SA sin voz nativa no es más rápida que una red 4G; es una red 4G con un salto adicional en el camino**.

## Por qué posponer VoNR puede ser una decisión racional

Aquí el estudio se vuelve interesante para quien decide presupuesto, no solo para quien opera.

Muchos operadores desplegaron 5G standalone primero para datos —capacidad, latencia, rebanadas— y mantuvieron VoLTE como ancla de voz sobre una capa de cobertura en banda baja. No es pereza: es diseño. La voz no consume capacidad espectral de forma significativa, y funciona mejor con cobertura contigua en frecuencias bajas, que entran a interiores y a zonas rurales. Y el fallback de 5G a 4G para completar llamadas no es deuda técnica acumulada: es gestión de riesgo mientras la huella SA y la madurez operativa no alcanzan.

El caso greenfield confirma el diagnóstico por contraste. Boost Mobile logró 1.81 s de mediana en VoNR en Nueva York, por delante de T-Mobile (2.34 s), la otra operadora estadounidense que lideró la comercialización de VoNR. La diferencia no es de tecnología: la red de Boost se construyó desde cero sobre el SA de EchoStar y no cargaba con nada que respetar. Las redes con historia cargan con su historia.

Los beneficios de VoNR son reales, pero llegan al final: converger voz y datos en un solo core, retirar dependencias de voz heredadas, liberar capacidad de 4G y ganar control de política y analítica. Ese ahorro se cobra cuando la cobertura SA es suficientemente ubicua, el parque de dispositivos acompaña y la voz está endurecida en movilidad, handover entre generaciones, emergencias y roaming. Antes de eso, el usuario no percibe ninguna diferencia y el operador ya gastó.

## Lo que este estudio deja pendiente

La conclusión operativa del documento es dura y sencilla: donde se optimiza VoNR, gana (Singtel, Yes en Malasia). Donde no, el 4G optimizado sigue siendo mejor. Y la voz, que es el servicio que todo mundo asume que “simplemente funciona”, sigue siendo el que menos atención recibe en una era de inversión orientada a datos.

Queda una pregunta abierta, y es la que más me interesa: **¿por qué** la cola de un operador llega a 6.33 segundos mientras su mediana se queda en 1.82?

Un cronómetro externo no puede responder eso. Puede decirte que tarda, no por qué tarda. Eso vive en otra parte: en los temporizadores, en el paging, en la señalización y en quién se queda esperando respuesta. De eso va la [segunda parte de esta serie](/blog/la-mitad-que-el-cronometro-no-ve/).

## Fuentes

- Ookla, 6 de octubre de 2026: [The 5G Voice Paradox: Why VoNR Isn't Always Better (Yet)](https://www.ookla.com/articles/5g-voice-call-setup-times). Fuente de todos los tiempos de establecimiento, percentiles y porcentajes de cumplimiento citados.
- Miller, R. B. (1968): [Response time in man-computer conversational transactions](https://dl.acm.org/doi/abs/10.1145/1476589.1476628), AFIPS Fall Joint Computer Conference, Vol. 33. Umbrales clásicos de 0.1, 1 y 10 segundos (lectura de [Jakob Nielsen](https://www.nngroup.com/articles/response-times-3-important-limits/)).
- ETSI TS 122 067: especificación del servicio de precedencia y preferencia multi-nivel (eMLPP), donde la condición de “fast call set-up” se asocia a un objetivo cercano a los 2 segundos. Citada en el estudio de Ookla.
- GSMA Intelligence (2025, 2024): cifras de penetración de VoLTE en Reino Unido (~93%), Malasia (~92%), Angola (~24%) y Filipinas (~31% en 2025, desde 14% en 2023 y con pronóstico arriba de 43% para 2026). Citadas en el estudio de Ookla.
- Ookla: [Boost Mobile: what the U.S. is losing](https://www.ookla.com/articles/boost-mobile-what-the-u-s-is-losing).
- The Verge: [EchoStar abandons further rollout of its 5G network](https://www.theverge.com/report/766038/dish-echostar-spectrum-att-sale-fourth-carrier).
- SoyaCincau, 5 de octubre de 2026: [Yes 5G gets VoNR right in Malaysia](https://soyacincau.com/2026/10/05/ookla-voice-over-nr-yes-5g-volte-report/).

**Nota metodológica.** Todos los tiempos de establecimiento, percentiles y porcentajes de este artículo provienen del estudio de Ookla citado arriba y no de mediciones propias: son datos de un tercero, replicados con su atribución. Las ventanas de medición (segundo semestre de 2025 y primer semestre de 2026) significan que los números describen esos periodos y no la red de hoy; los operadores medidos son los que el estudio seleccionó en cada mercado, así que esto no es un ranking nacional completo. Las cifras de penetración provienen de GSMA Intelligence tal como aparecen citadas por Ookla y no se recalcularon. La observación sobre los umbrales del trabajo de 1968 y sobre el origen del umbral de 2 segundos es propia y se apoya en las fuentes enlazadas. En este artículo no se usa ningún dato de redes, configuraciones o incidentes internos de operador alguno.
