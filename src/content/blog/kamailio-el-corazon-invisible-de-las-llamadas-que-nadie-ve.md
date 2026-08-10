---
title: "Kamailio: el corazón invisible de las llamadas que nadie ve"
pubDate: "2026-06-12"
description: "Si trabajas en operaciones de telecomunicaciones como yo, seguro has visto “Kamailio” aparecer en dashboards de Grafana, en logs de tu SBC, o en diagr"
categories: [techco-e-ia]
heroImage: "https://adrianlopeztech.wordpress.com/wp-content/uploads/2026/06/generated-image-june-12-2026-5_49pm.png"
---

Si trabajas en operaciones de telecomunicaciones como yo, seguro has visto “Kamailio” aparecer en dashboards de Grafana, en logs de tu SBC, o en diagramas de arquitectura de los proveedores. Y si eres como yo hace unos años, probablemente pensaste: “es otro softswitch open source más”.

Pues no. Kamailio es mucho más que eso.

Llevo años trabajando con IMS y CS Core, viendo pasar llamadas por infraestructura de proveedores tradicionales (Nokia, Ericsson, Huawei). Pero cuando empiezas a meterte en el mundo open source de la telefonía IP, te encuentras con que Kamailio está en todos lados. Y no es casualidad.

## ¿Qué es Kamailio?

Kamailio es un servidor SIP (Session Initiation Protocol) open source, licenciado bajo GPLv2, escrito en C puro. Su historia se remonta al año 2001, cuando nació como SIP Express Router (SER) en el Fraunhofer Institute FOKUS de Berlín. Pasó por varias transformaciones —OpenSER, luego Kamailio— y hoy es uno de los proyectos de telefonía open source más maduros que existen.

La última versión estable al momento de escribir esto es la 6.1.3, liberada en mayo de 2026. Sí, 25 años de desarrollo continuo.

Pero más que la historia, lo importante es qué hace. Kamailio es un **proxy SIP de alto rendimiento**. No es una centralita (PBX) como Asterisk o FreeSWITCH — no maneja medios, no reproduce música de espera, no graba llamadas. Kamailio hace una sola cosa y la hace extraordinariamente bien: **enrutar señalización SIP a velocidades absurdas con un consumo de recursos ridículamente bajo**.

Piénsalo como el velocista olímpico del mundo VoIP. Mientras que Asterisk es un atleta de decatlón que hace de todo, Kamailio es Usain Bolt: especializado, optimizado, implacable.

## ¿Por qué debería importarte?

Si trabajas en operaciones de voz celular como yo, probablemente tu infraestructura core está llena de equipos de proveedores tradicionales. Pero el mundo está cambiando. Cada vez más operadores están adoptando soluciones open source para capas de borde, SBCs virtualizados, y plataformas de enrutamiento.

Y Kamailio es la pieza central de muchas de esas arquitecturas.

Empresas como 1&1 (Alemania) manejan **millones de usuarios** sobre Kamailio. Cisco, Alcatel-Lucent y decenas de proveedores lo usan en producción. No es un proyecto de nicho: es infraestructura crítica funcionando en producción a escala carrier.

## La arquitectura que lo hace rápido

Lo que hace a Kamailio tan rápido es su arquitectura. La mayoría del software maneja cada conexión en un hilo o proceso separado. Eso funciona, pero cuando necesitas manejar cien mil llamadas simultáneas, se vuelve un problema.

Kamailio usa **múltiples procesos worker con memoria compartida**. Cuando arranca, crea un proceso maestro que lanza varios workers — típicamente uno por núcleo de CPU. Todos comparten la misma memoria, lo que significa que pueden acceder instantáneamente a la misma información sin necesidad de comunicarse entre ellos mediante sockets o pipes.

El resultado: un servidor con 8 cores puede procesar **más de 10,000 llamadas por segundo** en términos de mensajes SIP. Y usando menos memoria que tu navegador con 5 pestañas abiertas.

Además, si un worker se cuelga, los demás siguen trabajando y el proceso maestro lo reinicia automáticamente. Cero impacto en el servicio.

## ¿Para qué se usa Kamailio en el mundo real?

Aquí es donde la cosa se pone interesante. Kamailio no es una herramienta con un solo uso. Es más bien como un Lego: armas la funcionalidad que necesitas con módulos.

### 1. SIP Proxy / Registrar Server

El caso de uso más básico. Kamailio actúa como el directorio telefónico de tu red VoIP. Los teléfonos se registran con él diciendo “soy la extensión 1000 y estoy en esta IP”. Cuando alguien llama a la extensión 1000, Kamailio sabe exactamente dónde encontrarla.

Es el equivalente digital de la operadora que conectaba cables en un tablero, pero a velocidad de luz.

### 2. Session Border Controller (SBC)

Este es probablemente el uso más común en operadores. Kamailio se sienta en el borde de tu red protegiendo los sistemas internos del internet. Maneja:

- **NAT traversal** — ese problema eterno de dispositivos detrás de routers
- **Seguridad perimetral** — bloquea ataques de fuerza bruta, normaliza mensajes SIP mal formados
- **Interconexión** — traduce entre diferentes versiones de SIP, codecs, transportes

### 3. Load Balancer para servidores de aplicación

¿Tienes cinco servidores Asterisk o FreeSWITCH? Kamailio se pone al frente y distribuye las llamadas inteligentemente. Detecta cuando uno falla y automáticamente deja de enviarle tráfico. Puede hacer distribución basada en carga real de cada servidor.

### 4. Plataforma de enrutamiento carrier-grade

Este es el uso que más me interesa personalmente. Kamailio puede ser el cerebro que decide cómo enrutar millones de llamadas a través de múltiples proveedores, países y tecnologías.

Tienes diez proveedores de terminación, cada uno con tarifas diferentes para distintos destinos. Kamailio consulta una base de datos en tiempo real, determina la ruta más barata, intenta el proveedor principal y hace failover automático a alternativas si algo falla. Todo en milisegundos.

**Least Cost Routing (LCR)** en su máxima expresión.

### 5. WebRTC Gateway

Cada vez más relevante. WebRTC permite hacer llamadas desde un navegador sin plugins. Kamailio actúa como traductor entre el mundo WebRTC y el mundo SIP tradicional, permitiendo que usuarios en navegadores llamen a teléfonos normales y viceversa.

### 6. IMS / VoLTE

Y sí, Kamailio también tiene módulos para IMS. Puede funcionar como CSCF (Call Session Control Function) en plataformas VoLTE. No es un reemplazo directo de un Nokio o Ericsson IMS completo, pero para implementaciones más ligeras o como SBC en el borde IMS, es una opción real.

## Las métricas que ves en Grafana

Si tienes Kamailio en tu infraestructura, probablemente lo estás monitoreando con Prometheus + Grafana. Y si no, deberías. Estas son las métricas clave que deberías tener en tu dashboard:

### Core Statistics

- `core:rcv_requests` — Mensajes SIP recibidos
- `core:fwd_requests` — Mensajes SIP reenviados
- `core:rcv_replies` — Respuestas SIP recibidas
- `core:fwd_replies` — Respuestas SIP reenviadas

### Shared Memory (shmem)

- `shmem:total_size` — Memoria compartida total asignada
- `shmem:free_size` — Memoria compartida libre
- `shmem:used_size` — Memoria compartida en uso
- `shmem:real_used_size` — Memoria realmente usada (incluyendo fragmentación)
- `shmem:fragments` — Fragmentos de memoria (cuando crece, puede indicar fragmentación)

**Ojo con esta:** si `used_size` se acerca a `total_size` o los fragments crecen, tienes un problema de memoria. Es de las primeras métricas que reviso cuando algo huele mal.

### Transaction Module (tmx)

- `tmx:UAS_transactions` — Transacciones como servidor (UAS)
- `tmx:UAC_transactions` — Transacciones como cliente (UAC)
- `tmx:active_transactions` — Transacciones activas actualmente
- `tmx:inuse_transactions` — Transacciones en uso en este momento

### Stateless (sl)

- `sl:sent_replies` — Respuestas stateless enviadas
- `sl:sent_err_replies` — Respuestas de error enviadas

### User Location (usrloc)

- `usrloc:registered_users` — Usuarios registrados actualmente
- `usrloc:location-contacts` — Contactos registrados
- `usrloc:location-expires` — Contactos próximos a expirar

### TCP

- `tcp:send_queued_bytes` — Bytes en cola de envío TCP
- `tcp:send_queued_msg` — Mensajes en cola de envío TCP
- Conexiones TCP activas, tiempo de establecimiento, etc.

### Dialog

- Diálogos activos por perfil (útil para ver cuántas llamadas activas hay por proveedor o ruta)
- `kamailio_dlg_profile_get_size_dialog{profile="PROVEEDOR_A"}`

### Dispatcher

- Estado de cada gateway en los grupos de dispatcher
- `kamailio_dispatcher_list_target{set_id="200", set_name="Carrier 1"}`

## ¿Cómo se monitorea?

Hay varias formas de exponer estas métricas a Prometheus:

1. **Módulo xhttp_prom** — Kamailio expone sus métricas directamente en una URL `/metrics`. Es la más directa.
1. **Exportador externo** — Usas un exporter como [kamailio_exporter](https://github.com/angarium-cloud/kamailio_exporter) que se conecta a Kamailio vía BINRPC y expone las métricas. Más flexible, permite métricas personalizadas.
1. **StatsD** — El módulo `statsd` de Kamailio envía métricas a un servidor StatsD, que luego se convierten a Prometheus.

Personalmente prefiero el exportador externo porque da más control y permite recolectar métricas adicionales como estado de RTPengine, perfiles de diálogo personalizados, y mapeo de nombres a grupos de dispatcher.

## ¿Vale la pena?

Depende de tu contexto. Si trabajas en un operador tradicional con infraestructura 100% de proveedor, probablemente no reemplazarás tu SBC Nokia con Kamailio de la noche a la mañana. Pero conocerlo te da una perspectiva valiosa.

Si estás en el proceso de modernización —virtualización, cloudificación, adopción de open source— Kamailio es una herramienta que deberías tener en el radar. Es maduro, está respaldado por una comunidad activa, tiene conferencias anuales (Kamailio World en Berlín), y hay empresas que ofrecen soporte comercial.

Y si estás en el camino de “volverte techco”, como yo, entender Kamailio te da una pieza fundamental del rompecabezas. Porque el futuro de las telecomunicaciones no va a ser 100% open source ni 100% vendor lock-in. Va a ser un híbrido. Y cuanto más entiendas ambas caras del espectro, mejor preparado vas a estar.

---

*¿Tienes Kamailio en tu infraestructura? ¿Lo has considerado? Cuéntame en los comentarios
