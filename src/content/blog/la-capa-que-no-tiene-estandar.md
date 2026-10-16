---
title: "La capa que no tiene estándar: el eslabón suelto del IoT industrial"
pubDate: "2026-10-16"
description: "Casi todos dibujamos el mismo mapa de capas entre un sensor y la decisión que se toma con su dato. Hay una línea de ese mapa —la plataforma— donde no hay un estándar ganador, y eso no es un descuido técnico: es el modelo de negocio de esa capa. Qué sí existe, qué perdió y cómo montarlo para no quedar amarrado."
categories: [technical]
---

Un colega del sector industrial resumió el otro día en LinkedIn, en ocho líneas, el mapa que casi todos dibujamos igual cuando hablamos de telemetría: dispositivo, conectividad, gateway y network server, transporte, integración industrial, plataforma, edge y valor. Es un mapa correcto. Y tiene un problema que no se ve hasta que alguien intenta implementarlo: una de esas líneas no tiene estándar.

Vengo de operar redes, donde ese problema no existe. En telefonía, si quiero que dos equipos de proveedores distintos intercambien voz, existen RFC, especificaciones de 3GPP y perfiles de la GSMA. No siempre es bonito, pero el acuerdo existe y está escrito. En telemetría industrial, las siete primeras capas del mapa tienen algo equivalente. La octava —la plataforma— es donde el oficio se vuelve artesanal, y conviene entender por qué.

## Plataforma no es un protocolo: es un acuerdo sobre el significado

Las capas de abajo son acuerdos sobre **bytes**. LoRaWAN define cómo se modula el radioenlace, MQTT define cómo viaja un mensaje sobre TCP, Modbus define el formato de una trama. Son deterministas, verificables y baratos de acordar: a nadie le cuesta dinero que otro sepa leer su trama.

La plataforma es lo contrario. Ahí no se acuerda el formato, se acuerda el **significado**: qué es un activo, cómo se llama, de qué planta forma parte, qué relación tiene con el sensor que lo mide, quién es el responsable cuando ese activo falla. Eso no es un protocolo, es el modelo del negocio del cliente. Y no hay forma de estandarizarlo globalmente, porque no existen dos plantas que nombren igual sus cosas.

De ahí sale la consecuencia incómoda: en esa capa cada proveedor reinventa el modelo, y el modelo es exactamente donde vive el amarre. El dato sale por MQTT, abierto y libre; el significado se queda dentro de la plataforma, cerrado y propio.

## Lo que sí existe: cuatro familias, ninguna dueña del terreno

Decir "no hay estándar" es impreciso. Hay bastante, y casi todo se ignora. Agrupado en cuatro familias:

**Gestión de dispositivos y gemelo digital.** Aquí sí existe un estándar formal: LwM2M, de OMA SpecWorks, construido sobre CoAP y pensado precisamente para administrar dispositivos restringidos —aprovisionarlos, actualizarlos, saber si están vivos—. Perdió. Lo que usa el mundo real son los gemelos propietarios: el Device Shadow de AWS, el Device Twin de Azure. Es el caso más limpio para responder la pregunta de siempre: la especificación abierta existe y ganó la que venía amarrada al proveedor.

**Modelo de datos y semántica.** Aquí hay varios compitiendo y ninguno domina: OGC SensorThings API, NGSI-LD (estándar de ETSI con implementación en FIWARE), oneM2M y su capa de servicio común, las descripciones de Thing de W3C en Web of Things, el Asset Administration Shell del mundo Industria 4.0 y SenML (RFC 8428) para el cuerpo de los mensajes. Su terreno natural son las smart cities, los proyectos públicos y las licitaciones que exigen neutralidad tecnológica. Señal de que nadie ganó: los propios organismos ya escriben documentos de interoperación **entre ellos** — oneM2M aprobó un technical report de interworking con SensorThings. Cuando dos estándares necesitan una especificación para hablarse, la pelea ya está perdida.

**El contrato de plataforma en industria.** Y aquí viene lo más interesante, porque sí hay algo y es reciente: Sparkplug. La versión 3.0 es la norma ISO/IEC 20237 desde 2023, y el detalle importa: no estandariza dashboards. Estandariza el árbol de temas (el namespace), el cuerpo del mensaje en Protobuf y los certificados de nacimiento y muerte del nodo, es decir, cómo sabe la plataforma que un dispositivo existe y cómo se entera de que dejó de existir. Eso —y no un panel bonito— es el contrato de plataforma que el mapa de mi colega deja en blanco. Lo que la industria vende hoy como Unified Namespace es la versión arquitectónica de la misma idea.

**El stack que gana sin ser estándar.** En la práctica, lo que se despliega es una combinación: MQTT para transportar, una base de series de tiempo (InfluxDB, TimescaleDB) para guardar, Grafana para mirar, Node-RED para las reglas y algún canal de notificación para avisar. No hay especificación que lo defina; hay un repertorio de herramientas libres que todo el mundo rearma igual. Eso está más cerca de una costumbre que de un estándar.

## La prueba de que el hueco es real no es técnica, es económica

Si esto fuera solo una discusión de ingeniería, daría igual. Lo que lo vuelve un problema de negocio es la historia del mercado.

En 2019, IoT Analytics contó **620 plataformas IoT** operando en el mundo, 450 más que en un análisis equivalente de 2017. Nunca se volvió a alcanzar esa cifra. En los años siguientes muchas desaparecieron o pivotearon en silencio, con salidas notables de SAP, Google Cloud e IBM. La conclusión de su reporte de 2025 es demoledora y está bien redactada: el mercado pasó de "océano azul" prometido a "lago rojo", hoy dominado por los hiperescaladores, y buena parte de los compradores nunca encontró valor suficiente en una plataforma horizontal. La proyección de McKinsey de 11 billones de dólares para 2025 no llegó.

El caso que mejor ilustra el punto es Google: retiró Cloud IoT Core el **16 de agosto de 2023**, avisando con un año de anticipación. Sus clientes se quedaron migrando.

Ahora piénsalo desde el otro lado. Si la capa de plataforma estuviera estandarizada, cambiar de proveedor sería cambiar el broker y volver a apuntar los datos. Se convirtió en un proyecto de meses porque dentro de la plataforma vivían el modelo de activos, las reglas y los tableros. Esa es la definición operativa del amarre: **no se pierde el transporte, se pierde el significado**.

Y por eso el desorden de esa capa no es un accidente que nadie ha querido arreglar: es su modelo de negocio. En cuanto MQTT se volvió gratuito y aburrido, el transporte dejó de valer dinero. El único margen que queda en el medio de la pila es el enredo del modelo semántico.

## Quien firma la plataforma no es quien recibe la alarma

Hay una segunda razón, organizacional, y explica el fallo que mi colega describe mejor que cualquier carencia técnica: el dato llega al tablero y nadie decide nada.

Quien aprueba la compra de una plataforma es la gerencia de TI o de operaciones; quien recibe la alarma a las tres de la mañana es el supervisor de la planta. Los dos tienen incentivos distintos, y solo uno de ellos vive las consecuencias. El resultado es un artefacto de **reporte** disfrazado de herramienta de operación: cien series visibles, ninguna con dueño.

Yo agregaría un quinto fallo a su lista, que es el más caro de todos: **nadie asigna responsable de la alarma**. Sin dueño, sin escalamiento y sin registro de la acción tomada, el dato nunca se convierte en decisión. No es un problema de software y no se resuelve con un estándar, porque es un problema de proceso: el sistema se juzga por lo que hace cuando nadie lo está mirando.

## Por qué en infraestructura esa misma capa sí se estandarizó

Aquí conviene un contraste, y lo tengo fresco porque lo estoy viviendo en mi laboratorio de observabilidad en casa. En el mundo de los servidores, esa misma capa —la de almacenamiento, reglas y alertas— **sí** se estandarizó, y no por mérito de nadie: Prometheus y OpenMetrics fijaron un formato de exposición, y a partir de ahí cualquiera escribe un collector. En mi caso concreto, expongo métricas propias con el collector de textfile de node-exporter: un archivo de texto plano con el nombre de la métrica, sus etiquetas y su valor. Treinta líneas de script y ya tengo mi propia serie disponible. Grafana, del otro lado, lee cualquier fuente.

¿Por qué ahí sí y en la planta no? Por dos condiciones que la telemetría industrial no cumple: el consumidor es otro ingeniero, y el modelo de datos es simple —un nombre, unas etiquetas, un valor y una marca de tiempo—. Cuando esas dos condiciones se dan, la capa se estandariza sola porque a nadie le sirve ser dueño del significado. Cuando el consumidor es el dueño de la planta y el modelo es su organigrama, cada quien inventa el suyo.

## Cómo montarlo sin quedar amarrado

Esto es lo que yo haría, y es material de diseño, no de opinión:

- **El modelo de activos es tuyo y vive fuera de la plataforma.** Un archivo versionado con los activos, su jerarquía y sus relaciones. La plataforma lo lee; no lo define. Es la única pieza que no se reconstruye migrando.
- **El contrato de transporte, lo más aburrido posible.** MQTT y, si el cliente es industrial, Sparkplug, para que la plataforma sepa qué nodo nació y cuál murió sin que nadie lo configure a mano.
- **La notificación, desacoplada y con dueño.** Alerta que llega a una persona con nombre, escalamiento si no responde y bitácora de la acción. Es el entregable real del sistema; el tablero es accesorio.
- **El histórico, propio y exportable.** Base de series de tiempo bajo tu control. Los datos crudos son lo que se lleva el cliente cuando cambia de proveedor, y es lo que hace que el cambio sea una decisión suya y no un rescate.
- **El costo por nodo a cinco años.** Batería, reemplazo, conectividad, consumo de plataforma. Lo que cuesta el dispositivo hoy es la parte que menos importa del cálculo.
- **Validación en campo.** Cobertura, interferencia, temperatura y humedad no se reproducen en el laboratorio.
- **El tablero, desechable.** Si un dashboard bien hecho toma más de un día, probablemente sea una decisión disfrazada de gráfica.

Ese conjunto, y no la elección de plataforma, es lo que separa un despliegue que se puede mantener de uno que se recicla cada tres años cuando el proveedor cambia de estrategia.

## Qué voy a vigilar

1. **Sparkplug.** Si la versión 4 consolida el namespace unificado, el hueco de la capa "plataforma" se estrecha por el lado industrial (verificar el estado del ciclo de revisión).
2. **La próxima muerte de un servicio de plataforma en un hiperescalador.** El episodio de Google en 2023 no fue un accidente aislado, fue una señal de dónde vive el valor y dónde no.
3. **Los estándares semánticos.** SensorThings y NGSI-LD funcionan en licitaciones públicas; la pregunta es si alguna vez salen de ahí hacia la planta mediana.
4. **El dueño de la alarma.** No hay estándar para eso, ni lo habrá: es proceso. Pero es lo que decide si un proyecto de telemetría vive o muere en el segundo año.

La conclusión es incómoda para la industria, porque dice que la parte más interesante del problema no está en el radio ni en el protocolo, sino en las dos líneas del mapa donde no hay nada que comprar y todo que diseñar: el modelo de activos y la respuesta operativa. Los sensores funcionan, el dato llega, los tableros se ven bonitos. Que alguien tome una decisión con eso sigue siendo trabajo humano.

## Fuentes

- IoT Analytics, 17 de septiembre de 2025: [From blue ocean to red lake: What happened to the 620+ IoT platforms, and what is ahead](https://iot-analytics.com/what-happened-to-iot-platforms-whats-next/) (620 plataformas contadas en 2019, 450 más que en 2017; salidas de SAP, Google Cloud e IBM; mercado hoy dominado por hiperescaladores; la promesa de 11 billones de dólares de McKinsey para 2025; el patrón "océano azul a lago rojo").
- Google Cloud: [Cloud IoT Core deprecation](https://cloud.google.com/iot/docs/iot-core-deprecation) — servicio retirado el 16 de agosto de 2023.
- ISO/IEC 20237:2023 (Sparkplug 3.0), ficha de la norma en el [catálogo de ISO/IEC](https://standards.iteh.ai/catalog/standards/iso/de0a21c9-8fb4-40ba-a739-339f77098c69/iso-iec-20237-2023); contexto de su aprobación como estándar internacional en [HiveMQ](https://www.hivemq.com/blog/iiot-milestone-as-sparkplug-becomes-international-standard/).
- OMA SpecWorks: [Lightweight M2M (LwM2M)](https://www.openmobilealliance.org/release/LightweightM2M/) — estándar de gestión de dispositivos sobre CoAP.
- Open Geospatial Consortium: [OGC SensorThings API](https://www.ogc.org/standards/sensorthings/); ETSI ISG CIM: [NGSI-LD, sitio oficial](https://ngsi-ld.org/); oneM2M: [documento de interoperación con SensorThings aprobado en el 63º pleno técnico](https://www.onem2m.org/membership/executive-viewpoints/904-roland-hechwartner-tp63-mainz); W3C: [Web of Things Thing Description](https://www.w3.org/TR/wot-thing-description/); IETF: [RFC 8428 (SenML)](https://www.rfc-editor.org/rfc/rfc8428).
- Prometheus / OpenMetrics: [formato de exposición](https://prometheus.io/docs/instrumenting/exposition_formats/) y [collector de textfile de node-exporter](https://github.com/prometheus/node_exporter#textfile-collector) — la ruta que uso en mi [laboratorio de observabilidad en casa](/blog/laboratorio-de-observabilidad-en-casa-1-prometheus-grafana-y-por-que-existe-cada-pieza/).

**Nota metodológica.** El mapa de ocho capas que abre el artículo lo publicó un especialista del sector industrial en un comentario de LinkedIn; lo uso como marco de discusión y no reproduzco su texto. Los cuatro fallos frecuentes que menciono como suyos (elegir tecnología antes de definir el problema, validar en laboratorio, no calcular el costo por dispositivo a largo plazo y el tablero que nadie mira) son también de ese comentario; el quinto, el dueño de la alarma, es mío. Las cifras de 620 plataformas, las salidas de SAP, Google Cloud e IBM, la proyección de McKinsey y el desplazamiento del mercado hacia los hiperescaladores provienen del análisis público de IoT Analytics de septiembre de 2025. La fecha de retiro de Cloud IoT Core (16 de agosto de 2023) está publicada por Google. La equiparación entre Sparkplug 3.0 e ISO/IEC 20237 es la referencia normativa; la existencia de una versión 4 en revisión la marco como "(verificar)" porque la he visto solo en material de proveedores. La afirmación de que los gemelos propietarios (Device Shadow de AWS, Device Twin de Azure) ganaron terreno frente a LwM2M es mi lectura del mercado, no un dato medido: no conozco un conteo público de despliegues por estándar. El contraste con Prometheus se apoya en mi propia experiencia montando el laboratorio y en la documentación pública del formato de exposición. No incluyo datos, configuraciones ni topologías de ninguna red de trabajo; los mecanismos se explican en genérico y solo con estándares públicos.
