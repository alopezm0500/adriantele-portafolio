---
title: "Lo que 800 MHz no compra: la física, la bolsa y el trabajo que no se subasta"
pubDate: "2026-10-09"
description: "SpaceX acordó comprar el portafolio nacional de 800 MHz de Grain Management para volverse operador móvil en Estados Unidos. Los operadores cayeron más del 6.5% en bolsa: la parte económica de un anuncio que todavía no es una red."
categories: [sociedad-y-telecom]
heroImage: "../../assets/blog/lo-que-800-mhz-no-compra.jpg"
---

El 8 de octubre SpaceX anunció que adquirió el portafolio nacional de 800 MHz de Grain Management: hasta 14 MHz pareados de banda baja en todo Estados Unidos, sujeto a la aprobación de la FCC y sin monto revelado. La reacción de Elon Musk en su propia red fue esta: "para el observador casual esto no parecerá gran cosa; para quien entiende las guerras del espectro, es un terremoto".

Tiene razón en que no se entiende a primera vista, pero no por lo que él dice. Lo que se movió no fue la cobertura de un satélite: fue la definición de lo que hace falta para ser operador móvil. Y en esa lista, el espectro es justamente la parte que se puede comprar.

## Qué compró exactamente

- El 100% del portafolio nacional de 800 MHz de Grain Management: hasta 14 MHz pareados en la banda de 800, en todo el país.
- SpaceX lo describió con una arquitectura, no con un producto: su 2 GHz es la capa de **capacidad**, el 800 MHz es la capa de **cobertura**, y las dos se combinan con un "despliegue terrestre avanzado".
- La misma semana, la FCC autorizó 15,000 satélites de Starlink para conectividad directa a dispositivo.

No es un satélite más grande. Es una red móvil por capas, dicha en voz alta por quien la va a construir.

## Donde la física sí manda

A 800 MHz la longitud de onda ronda los 37.5 centímetros, contra unos 15 centímetros a 2 GHz. En espacio libre esa diferencia vale cerca de 8 dB a favor de la banda baja (20·log₁₀(2000/800) = 7.96 dB), más difracción alrededor de obstáculos y mejor cobertura amplia. Por eso los operadores han pagado fortunas por 600, 700, 800 y 850 MHz.

Pero la banda baja no es magia, y hay dos matices que se pierden en el titular.

El primero es que 14 MHz pareados **no son capacidad**: son cobertura. En un servicio directo a dispositivo se trabaja con portadoras angostas, y el 800 MHz sirve para que el enlace exista donde no hay sitio terrestre, no para darle ancho de banda a una ciudad.

El segundo es que el problema difícil es el enlace de **subida**. El teléfono transmite con la potencia y la antena que caben en una mano, a cientos de kilómetros de un receptor que se mueve. Ninguna banda arregla eso por sí sola: se arregla con apertura del lado del satélite —antenas más grandes, más generaciones—, y ese es exactamente el tipo de problema que SpaceX ya resolvió antes con otras restricciones físicas.

## El argumento que se está usando mal

El CEO de AT&T, John Stankey, calificó la estrategia móvil de SpaceX como "no viable" y apuntó a la penetración en interiores: replicar la cobertura diseñada de un estadio, un hospital o un rascacielos no es colgar una radio en una azotea. Según reportes, su objeción incluye además que los small cells junto a las antenas de Starlink en casas y negocios costarían como una red de torres y requerirían permiso de los dueños de los inmuebles (Axios, 29-sep-2026; Light Reading, 10-sep-2026).

La física de la primera parte es correcta. Como respuesta estratégica, "los satélites no atraviesan paredes" es el argumento más débil posible: SpaceX nunca dijo que iba a resolver todo desde órbita; dijo que iba a combinar satélite y terrestre. Discutir la atenuación del concreto con quien diseñó su sistema de radio es discutir el clima.

Y sin embargo, la conclusión optimista tampoco se sostiene sola, porque el punto de fondo de Stankey no es la física: es el **costo de la capa terrestre y el derecho de paso**. Sitios, energía, fibra, permisos, arrendamientos. Es exactamente lo que un operador ya tiene y un satelital no, y no se compra en una transacción de espectro.

## Lo que hay detrás de la radio

Aquí está el hueco del debate. Todo el mundo discute la capa de radio —propagación, espectro, satélites— y casi nadie discute lo que se necesita para que un teléfono marque y del otro lado suene.

- **Core de red.** Sesión, movilidad, políticas, calidad de servicio. Es donde vive si una llamada se sostiene cuando el usuario se mueve.
- **Voz.** IMS, VoLTE y VoWiFi, interconexión con la red telefónica pública y llamada de emergencia con localización. Un operador se juzga, entre otras cosas, por si el 911 funciona y llega con ubicación.
- **Numeración.** Códigos de país y de red, rangos asignados, portabilidad. Sin número, no hay suscriptor.
- **Identidad.** SIM y eSIM, perfilado remoto, autenticación.
- **Dinero.** Tarificación en línea y fuera de línea, facturación, cobranza.
- **Cumplimiento.** Interceptación legal, resguardo de datos, obligaciones de servicio.
- **Operación.** Guardias, escalamiento, gestión de incidentes, gente que responde a las tres de la mañana.

Nada de esa lista se resuelve con un comunicado. El espectro se compra en un trimestre; esa parte se construye en años y, sobre todo, se hereda de quien ya la sabe hacer. No es un argumento de "por qué SpaceX va a fracasar": es la razón por la que esta historia va a terminar en acuerdos con operadores establecidos, y no en un choque frontal contra ellos.

## El calendario que nadie pone en la mesa

La transacción tiene que pasar por la FCC, y eso es solo el primer trámite. Comprar espectro no es recibir autorización de operar: desplegar una capa terrestre implica licencia de servicio, condiciones regulatorias y obligaciones de construcción y cobertura con plazos.

Hay un detalle que cambia la posición de partida: el servicio directo a dispositivo de Starlink en Estados Unidos opera hoy apoyado en espectro de otra compañía —el bloque PCS de T-Mobile— (verificar). Si eso es correcto, esta compra no le agrega cobertura: le cambia el estatus. De inquilino en el espectro de un tercero a titular de su propia licencia, con las obligaciones que eso trae.

## La historia real es de tres actores

El 800 MHz que SpaceX acaba de comprar no salió de una subasta: T-Mobile se lo vendió a Grain en marzo de 2025 en una operación de alrededor de 2,900 millones de dólares, junto con tenencias de 600 MHz, y la FCC aprobó la transferencia en julio de 2026. El plan original de Grain era rentar ese espectro a empresas de servicios públicos u operadores móviles, y ya lo estaba ofreciendo para servicios directos a dispositivo. AST SpaceMobile había mostrado interés, y su Block 2 se produce con capacidad de 800 MHz (verificar). Dos meses después del cierre, Grain revendió a SpaceX.

Es decir: no estamos ante un anuncio de producto de Musk, sino ante una jugada de espectro con tres actores, en la que el espectro cambió de manos dos veces en diecinueve meses porque apareció un comprador dispuesto a pagar por lo que antes solo servía para rentar a utilities. Es el mismo patrón que se vio en la subasta mexicana de [2.3 GHz para redes industriales](/blog/redes-industriales-23-ghz-que-licita-mexico/): el espectro se ordena, se licita y se revende en meses; la obligación de operar la hereda quien lo compre.

## La parte económica: no se movió el activo, se movió el relato

El mercado no reaccionó al precio. Reaccionó al estatus.

Ese 800 MHz le costó a Grain alrededor de 2,900 millones de dólares en marzo de 2025, en la operación con T-Mobile que además incluía tenencias de 600 MHz. Aun suponiendo que SpaceX pagó un múltiplo generoso, la cifra queda en el orden del capex de dos o tres semanas de cualquiera de los tres operadores estadounidenses.

El castigo fue de otra escala: las acciones de AT&T, Verizon y T-Mobile cayeron más de 6.5% en la operación extrabursátil del jueves (Reuters). En compañías de esa capitalización, una caída así borra decenas de miles de millones de dólares de valor de mercado en una sola sesión. La diferencia entre lo que costó el espectro y lo que costó la noticia es la medida de lo que el mercado estaba tarifando, y eso no es cobertura: es prima de riesgo.

Se repreciaron cuatro cosas a la vez.

1. **Un cuarto operador.** La tesis de valor del móvil estadounidense durante una década fue la consolidación. Un entrante con espectro de banda baja, constelación ya autorizada y promesa de despliegue terrestre rompe esa tesis: devuelve al precio la posibilidad de una competencia más intensa y de un precio por gigabyte más bajo.
2. **Que lo mayorista se vuelva retail.** Hoy los tres operadores monetizan el satélite por dos vías: cobran al cliente final una suscripción satelital y participan del ingreso de los acuerdos con operadores satelitales. Si SpaceX vende directo al consumidor, esos dos flujos dejan de ser complemento y se convierten en competencia.
3. **El espectro como activo financiero.** Grain compró a un operador, no desplegó nada y revendió a un satelital en diecinueve meses. Eso revalúa la banda baja como clase de activo: si alguien paga por espectro sin intención de operarlo, el costo de reposición sube para todos. Y abre la pregunta incómoda que ya circula entre analistas: qué otra licencia ociosa de banda baja termina en manos de un operador satelital.
4. **La asimetría de obligaciones.** Es la parte económicamente sólida del episodio y casi nunca se menciona. Una licencia terrestre de espectro móvil viene con obligaciones de construcción y cobertura: el operador tiene que desplegar donde el mercado no paga, porque el título se lo exige. Una constelación satelital no hereda esa carga del mismo modo: cubrir zonas rurales y sin servicio es su caso de negocio, no su obligación regulatoria. El entrante compite por el ingreso urbano rentable sin cargar con el costo de servicio universal que sostiene al incumbente. Eso, y no la propagación, es la ventaja competitiva que se acaba de crear.

Hay tres razones para no leer la caída como sentencia. La primera: no compraron una red, compraron un permiso en trámite, y la transacción sigue sujeta a la FCC. La segunda: los operadores ya construyeron su propia capa satelital —en mayo de 2026 AT&T, T-Mobile y Verizon acordaron en principio una empresa conjunta de conexión directa a dispositivo para cerrar zonas muertas, y en octubre la formalizaron—, con la lectura de la industria de que quieren un estándar abierto y no uno propietario. La tercera: el mercado sobrerreacciona a los titulares de Musk, y hoy el directo a dispositivo es capacidad marginal para zonas sin cobertura, no un sustituto del tráfico urbano. Repreciar el valor terminal de una operadora por 14 MHz de banda baja es adelantarse varios años.

Lo que sí queda claro es por qué la caída fue rápida y en bloque: en una industria que reparte casi todo su flujo libre en dividendos, cualquier noticia que insinúe capex adicional, presión de precios o un competidor con capital barato se castiga primero y se analiza después. Y el capital de SpaceX, desde su salida a bolsa de junio de 2026, es barato: cotiza en Nasdaq como la mayor colocación de la historia y su capitalización se cuenta en billones de dólares (verificar: los reportes varían entre 1.75 y más de 2.7 billones). Un competidor que financia cobertura con acciones es un problema distinto a uno que la financia con deuda.

## Qué significa para México y América Latina

Aquí el patrón es distinto y conviene no trasladar el titular. En la región, el servicio directo a celular no ha avanzado por compra de espectro, sino por alianza: Direct-to-Cell ya opera comercialmente en Chile y Perú a través de Entel, mientras que en México no está disponible (verificar).

Eso deja a los operadores de la región en una posición que no es de desventaja: son la red anfitriona. Tienen el espectro, los sitios, el core, la numeración y las obligaciones de cobertura. Lo que está en disputa no es quién llega al cielo, sino cómo se reparte el ingreso del suscriptor que pasa de la célula al satélite y de regreso, y quién atiende al cliente cuando algo falla. Es la misma pregunta que aparece en cualquier red que se opera para un tercero, y es una pregunta de negocio, no de radiofrecuencia.

## Qué voy a vigilar

1. **Cómo sale la aprobación de la FCC.** Si llega con condiciones de construcción y cobertura con plazos, o si sale limpia. Ahí se ve si la capa terrestre es un plan con fecha o una intención.
2. **Si SpaceX compra o se asocia con un operador terrestre.** La capa de cobertura no aparece sola: o hay sitios, o hay acuerdos.
3. **Qué hace AST SpaceMobile**, que ya tenía el 800 MHz en el diseño de su Block 2 y se quedó sin el espectro.
4. **El primer anuncio de direct-to-cell en México**, y con qué operador. Ahí se sabrá si el modelo de la región es alianza o competencia.
5. **Si aparece otro comprador no operador de banda baja en Estados Unidos.** Si el espectro se vuelve refugio de capital, la prima de riesgo del sector no se retira con el siguiente reporte trimestral.

Un espectro con reglas claras es condición necesaria. Lo que no se subasta —core, numeración, emergencias, operación— es lo que sigue decidiendo quién es operador y quién solo tiene licencia. Y lo que el mercado castigó el jueves no fue una red que ya existe, sino la opción de construir una con dinero más barato y menos obligaciones que los demás.

## Fuentes

- CNBC, 8 de octubre de 2026: [SpaceX spectrum license hammers shares of AT&T, Verizon and T-Mobile](https://www.cnbc.com/2026/10/08/spacex-spectrum-license-att-verizon-tmobile.html).
- Reuters, vía Digg, 8 de octubre de 2026: [SpaceX spectrum deal hits shares of AT&T, Verizon and T-Mobile](https://digg.com/world-business/nxmsjrie).
- Yahoo Finance, 8 de octubre de 2026: [Telecom stocks tumble on SpaceX spectrum acquisition news](https://finance.yahoo.com/markets/stocks/articles/telecom-stocks-tumble-spacex-spectrum-210324491.html).
- Vantage Markets, 9 de octubre de 2026: [SpaceX Spectrum Deal: US Carrier Shares Fall After 800 MHz News](https://www.vantagemarkets.com/market-news/spacex-spectrum-deal-carrier-shares-fall-after-800-mhz-news-october-9-2026/).
- Stocktwits, vía TradingView: [ASTS Stock Slides After-Hours As SpaceX Snags Grain Spectrum](https://www.tradingview.com/news/stocktwits:dacbdfc04094b:0-asts-stock-slides-after-hours-as-spacex-snags-grain-spectrum-analyst-who-called-the-deal-says-ligado-is-next/) (incluye la lectura del analista Roger Entner y su "Ligado is next").
- AT&T, 14 de mayo de 2026: [AT&T, T-Mobile, and Verizon Plan to Launch New Joint Venture](https://about.att.com/story/2026/new-joint-venture.html).
- Satnews, 4 de octubre de 2026: [AT&T, T-Mobile, and Verizon Form Joint Venture to Standardize Satellite Direct-to-Device Connectivity](https://satnews.com/2026/10/04/att-t-mobile-and-verizon-form-joint-venture-to-standardize-satellite-direct-to-device-connectivity/).
- Business Insider, octubre de 2026: [SpaceX wins FCC approval for 15,000 Starlink satellites](https://www.businessinsider.com/spacex-wins-fcc-approval-for-15-000-starlink-satellites-2026-10).
- Axios, 29 de septiembre de 2026: [AT&T CEO says Elon Musk's SpaceX phone strategy not "viable"](https://www.axios.com/2026/09/29/att-ceo-john-stankey-spacex-elon-musk).
- Light Reading, 10 de septiembre de 2026: [AT&T CEO not a big fan of SpaceX's small cell mobile plan](https://www.lightreading.com/satellite/at-t-ceo-not-a-big-fan-of-spacex-s-small-cell-mobile-plan).
- Broadband Breakfast: [Grain Looking to Market 800 MHz for Direct-to-Cell](https://broadbandbreakfast.com/grain-looking-to-market-800-mhz-for-direct-to-cell/).
- Fierce Network: [Grain Management wants to use 800 MHz for satellite D2D](https://www.fierce-network.com/wireless/grain-management-wants-use-800-mhz-satellite-d2d).
- Yahoo Finance: [ASTS Stock Slides After-Hours As SpaceX Snags Grain Spectrum](https://finance.yahoo.com/markets/stocks/articles/asts-stock-slides-hours-spacex-012411879.html).

**Nota metodológica.** El monto de la operación T-Mobile–Grain (~2,900 millones de dólares, con tenencias de 600 MHz) proviene de una sola fuente periodística y se marca por verificar, igual que el detalle del bloque PCS de T-Mobile como base del servicio directo a dispositivo de Starlink y la disponibilidad de Direct-to-Cell en México. Las cifras exactas de la caída del 8 de octubre varían por fuente (los reportes van de "más de 6.5%" a 7.3% en operación extrabursátil) y la capitalización de SpaceX se cita con reservas: los reportes posteriores a su salida a bolsa van de 1.75 a más de 2.7 billones de dólares. Todos los datos de mercado son de cierre o de operación extrabursátil del 8 y 9 de octubre de 2026 y no se recalcularon.
