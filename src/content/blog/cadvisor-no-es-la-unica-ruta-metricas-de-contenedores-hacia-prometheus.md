---
title: "cAdvisor no es la única ruta: las cinco formas de llevar tus contenedores a Prometheus"
pubDate: "2026-10-06"
description: "¿Y si no quiero correr un contenedor con privilegios solo para ver cuánta RAM gasta Grafana? Cinco rutas reales para medir contenedores, qué cuesta cada una, cuál usa el mercado y en qué caso conviene cada una."
categories: [technical]
---

Llevo dos entregas escribiendo el laboratorio de observabilidad y, cuando llegó el momento de meter los contenedores a Prometheus, me detuve en una pregunta que parecía tonta: **¿cAdvisor es la única forma?**

No lo es. Y esa pregunta tonta se merecía este artículo. Porque si voy a teclear un `compose.yaml` con un contenedor que corre con `privileged: true` —que es exactamente lo que pide el arranque rápido de cAdvisor—, quiero saber qué estoy comprando a cambio y qué otras rutas existen antes de entregar la llave del reino.

Van las cinco, con lo que cuesta cada una, cuál usa el mercado y en qué caso se recomienda.

## El problema de fondo: Prometheus no sabe qué es un contenedor

Prometheus es, en el fondo, una base de datos de series temporales con un raspador pegado. Sabe pedir una URL, leer texto plano y guardar números con etiquetas y fecha. Lo que **no** sabe —ni le interesa— es que existe algo llamado contenedor, namespace o cgroup.

El contenedor, del otro lado, no publica nada. El kernel lleva su contabilidad en los cgroups y en `/proc`, en archivos que nadie consulta si no escribes el programa que los consulte.

Entre esas dos mitades hace falta un traductor. Ese es todo el oficio de un *exporter*:

```
   cgroups y /proc          (el kernel sabe, nadie pregunta)
        │
        │  1. un proceso los lee
        ▼
   EXPORTER ──────────────►  GET /metrics   (texto plano)
        │                          ▲
        │                          │  2. Prometheus raspa cada 15 s
        │                          │
        │                     PROMETHEUS ──► TSDB (series con etiquetas)
        │                                        ▲
        │                                        │  3. consultas PromQL
        │                                     GRAFANA
```

De ahí salen las dos únicas arquitecturas que existen para llenar ese hueco:

- **Un exporter con endpoint propio.** Un proceso escucha en un puerto y publica `/metrics`; Prometheus lo raspa. Es el caso de cAdvisor, Telegraf y Netdata.
- **Un puente, sin proceso nuevo.** Alguien escribe los números en un formato que algo **que ya está siendo raspado** lee por su cuenta. Es el caso del collector `textfile` de node-exporter.

Esa es la primera decisión real, y es más importante de lo que parece: proceso nuevo con puerto nuevo, o reutilizar un raspado que ya funciona.

## Ruta 1: cAdvisor

**Qué es.** Un demonio de Google cuyo único trabajo es leer los cgroups y publicar, por contenedor, CPU, memoria, red, disco, número de procesos y tiempos de arranque. Su propia documentación lo define así: recoge, agrega, procesa y exporta información de los contenedores en ejecución, "por contenedor y a nivel de máquina".

**Cómo se conecta.** Es un exporter clásico: expone `/metrics` en texto plano y se agrega un `job` en `prometheus.yml`. Prometheus lo raspa cada 15 segundos y Grafana consulta la TSDB como con cualquier otra serie. Dentro de un compose, Prometheus lo alcanza por el nombre del servicio (`cadvisor:8080`), no por `localhost`.

**Lo que cuesta.** Es el más invasivo de la lista. Para leer los cgroups del host necesita `privileged: true` —que en la práctica equivale a root— más montajes de solo lectura de `/`, `/sys`, `/var/run` y `/dev/disk`, y el dispositivo `/dev/kmsg` para enterarse de los eventos de OOM. También es el más pesado en memoria de las opciones de exporter, y hay que decir que su costado bueno en métricas es el costado malo en superficie de ataque: ve mucho porque puede ver mucho.

**Cuándo sí.** Cuando quieres el estándar, y cuando quieres que lo que aprendas te sirva fuera de casa. Las series que produce son las mismas que ves en cualquier clúster de Kubernetes: `container_cpu_usage_seconds_total`, `container_memory_working_set_bytes`, `container_network_receive_bytes_total`, `container_fs_reads_bytes_total`, `container_oom_events_total`, `container_pressure_memory_stalled_seconds_total`. En una tabla que verás en juntas y en entrevistas, esos nombres son los que aparecen.

**Cuándo no.** Cuando el requisito es no dar privilegios, o cuando el host es tan humilde que un lector de cgroups universal es un lujo.

## Ruta 2: las métricas del propio demonio de Docker

**Qué es.** El demonio de Docker sabe publicar métricas en formato Prometheus. Se activa con una línea en `/etc/docker/daemon.json`:

```json
{
  "metrics-addr": "127.0.0.1:9323"
}
```

**Cómo se conecta.** Es un `job` más en `prometheus.yml` apuntando a `9323`. Cero contenedores nuevos, cero montajes, cero privilegios. Probablemente la métrica más barata de todo este artículo.

**Lo que cuesta.** Lo que no da. La documentación de Docker lo dice sin rodeos: *"Actualmente, solo puedes monitorear Docker en sí mismo. Todavía no puedes monitorear tu aplicación con este target"*. Y remata con un aviso que conviene leer dos veces: las métricas disponibles y sus nombres están en desarrollo activo y pueden cambiar en cualquier momento.

¿Qué entrega entonces? Información del demonio: cuántos contenedores hay en cada estado (`engine_daemon_container_states`, "el conteo de contenedores en varios estados"), cuánto tardan las acciones sobre contenedores (`engine_daemon_container_actions_seconds`) y las latencias de las acciones de red (`engine_daemon_network_actions_seconds_count`). Nada de "cuánta RAM usa el contenedor de Grafana".

**Cuándo sí.** Siempre, como capa barata: saber si el demonio está sano y cuántos contenedores hay por estado es útil y sale gratis.

**Cuándo no.** Cuando lo que quieres es atribuir consumo a un contenedor. Para eso no sirve, y no es un defecto de configuración: es el alcance de la herramienta.

## Ruta 3: Telegraf con el plugin `inputs.docker`

**Qué es.** Telegraf es el agente de InfluxData, un solo binario con cientos de plugins. El plugin `inputs.docker` consulta la API del demonio y produce métricas por contenedor: `docker_container_cpu`, `docker_container_mem`, `docker_container_net` y `docker_container_blkio`.

**Cómo se conecta.** Aquí está su encanto: para leer la API del demonio le basta **montar el socket** (`/var/run/docker.sock`), de solo lectura. Nada de `privileged`, nada de montar el sistema de archivos del host. Y del lado de la salida tiene dos caminos: exponer un endpoint de Prometheus (`outputs.prometheus_client`) para que Prometheus lo raspe, o empujar los datos a InfluxDB si vives en ese mundo.

**Lo que cuesta.** Es un proceso más en la familia Influx, con sus propias convenciones. Los nombres de sus series son suyos, no los de Kubernetes: el día que migres al clúster, tu tablero no se traduce solo. Y trae menos detalle que cAdvisor: sin sistemas de archivos por contenedor, sin eventos de OOM.

**Cuándo sí.** Cuando ya escribes YAML de agentes, cuando el requisito de seguridad prohíbe privilegios, o cuando quieres contenedores y aplicaciones medidas por el mismo agente.

**Cuándo no.** Cuando el objetivo del ejercicio es aprender el estándar de Kubernetes, o cuando no quieres agregar otra tecnología solo para medir contenedores.

## Ruta 4: script propio y el collector `textfile` de node-exporter

**Qué es.** Ningún software nuevo. node-exporter es el exporter que ya tienes midiendo el host, y sabe leer archivos `.prom` de un directorio. Así que un script —de veinte líneas— lee los cgroups o `docker stats` y escribe un archivo con el formato:

```
# HELP ram_contenedor Memoria en bytes por contenedor
# TYPE ram_contenedor gauge
ram_contenedor{contenedor="grafana"} 536870912
```

**Cómo se conecta.** No hay exporter nuevo que raspar: la serie aparece dentro del `/metrics` de node-exporter, en el mismo `job` que ya existe. El ciclo es una entrada de cron o un timer de systemd que regenera el archivo cada minuto.

**Lo que cuesta.** La responsabilidad. La calidad del dato ahora es tuya: si el script falla, la serie se queda congelada y nadie te avisa. También hay una muestra por corrida, así que la resolución depende del reloj y no del raspado.

**Cuándo sí.** Cuando la métrica que quieres **no** la produce ningún exporter —los nanobot de mi bastión son unidades systemd, no contenedores— y cuando el objetivo es didáctico: escribir el `.prom` a mano es la mejor forma de entender qué hay del otro lado de un `GET /metrics`.

**Cuándo no.** Cuando existe un exporter mantenido que ya lo hace. Y hay un detalle importante: es un **puente**, útil para decenas de series, nunca para miles.

## Ruta 5: Netdata

**Qué es.** Un agente que trae el monitoreo de contenedores resuelto de fábrica, con su propia interfaz, sus propios tableros y su propia base de datos. Su plugin de cgroups es el que hace el trabajo.

**Cómo se conecta.** Por defecto, a sí mismo: Netdata no necesita a Prometheus para funcionar, y esa es justamente su diferencia. También puede exportar sus métricas en formato Prometheus si quieres, pero llega con su propio almacenamiento y su propia manera de ver las cosas.

**Lo que cuesta.** Una filosofía distinta instalada en la misma máquina. Si el objetivo del laboratorio es aprender Prometheus y Grafana, Netdata resuelve el problema antes de que lo entiendas —y en una laptop de 8 GB, además, con su propio consumo.

**Cuándo sí.** Cuando no quieres aprender PromQL ni configurar tableros, y lo que necesitas es ver los contenedores funcionando hoy.

**Cuándo no.** Cuando el propósito es montar la pila que se usa en una empresa, donde la pieza es Prometheus y Netdata no está en el camino.

## Lo que se está moviendo alrededor

Dos cosas que vale la pena mirar, porque explican hacia dónde va el ecosistema:

- **Kubernetes.** cAdvisor va embebido en el kubelet. Es la razón de que las series `container_*` de cualquier clúster tengan exactamente los nombres que listé arriba, y también de que casi nadie lo despliegue a mano: en un clúster ya está puesto, se llame o no cAdvisor.
- **Grafana Alloy.** El reemplazo de su agente clásico trae un componente llamado `prometheus.exporter.cadvisor`, es decir: incluso la herramienta nueva de Grafana terminó corriendo cAdvisor por dentro. Alloy además tiene descubrimiento de contenedores (`discovery.docker`), pero eso es otra tarea: sirve para encontrar los endpoints `/metrics` de tus aplicaciones, no para medir los recursos del contenedor.
- **OpenTelemetry.** Su *receiver* `docker_stats` consulta la API de estadísticas del demonio y extrae CPU, memoria, red y blkio por contenedor. Es la apuesta a futuro —mismo protocolo para todo—, hoy marcada como **alpha**: sirve para aprender, no todavía para cargarle la operación de nadie.
- **Los servicios administrados.** Datadog, New Relic y compañía no despliegan cAdvisor: llevan su propio agente, que lee las mismas fuentes —la API del demonio y los cgroups— por su cuenta. La lección del mercado no es que cAdvisor sea universal, es que **todo el mundo lee los mismos archivos del kernel**, y cada uno decide cuánto privilegio pedir para hacerlo.

## Cómo decidir, en una pasada

- ¿Es Kubernetes, o quieres tableros que se parezcan a los de un clúster? **cAdvisor.**
- ¿Solo quieres saber si el demonio está sano y cuántos contenedores hay? **Las métricas del demonio.** Una línea, cero contenedores.
- ¿El requisito es no dar privilegios y ya vives entre YAML de agentes? **Telegraf.**
- ¿La métrica no es de un contenedor, o quieres aprender cómo se fabrica un número? **Script propio con el collector `textfile`.**
- ¿No quieres configurar nada y te da igual el estándar? **Netdata.**
- Y una regla transversal: **nunca dos exporters midiendo lo mismo por el mismo camino.** Duplicas series, confundes el tablero y gastas disco. Uno mide; los demás complementan.

## Lo que elegí, y por qué

Me quedo con cAdvisor, y no por gusto: por transferencia. Ya tengo un tablero funcionando en casa con node-exporter; lo que me falta es la otra mitad del oficio, la que en el trabajo doy por sentada porque llegó instalada. Operar cAdvisor entiende sus límites y sus métricas es aprender a leer lo mismo que voy a encontrar en un clúster real, con los mismos nombres y el mismo formato de tabla.

Pero me llevo dos cosas de este recorrido. La primera es activar también las métricas del demonio: son gratis y me dan una lectura que cAdvisor no da. La segunda es que la pregunta incómoda —*¿privileged, de verdad?*— no se responde con un "así se hace", se responde conociendo las alternativas y el precio de cada una.

Sospecho que ese es el verdadero aprendizaje del laboratorio: no encender la pila, sino saber por qué se enciende así.

Esta pieza es el mapa; la aterrizo en la entrega 3 de la serie, cuando los contenedores aparezcan en el tablero.

Queda una segunda mitad del problema que aquí no toqué, y es la que más importa cuando la aplicación es de verdad: el contador del contenedor no es el contador del negocio. De eso va [Quién cuenta las llamadas](/blog/quien-cuenta-las-llamadas-contadores-de-aplicacion-en-kubernetes/).

## Nota metodológica

Los nombres de las métricas de cAdvisor citadas aquí los verifiqué contra el árbol de la versión **v0.60.6** (`lib/metrics/testdata/prometheus_metrics`), y los del demonio de Docker contra `daemon/internal/metrics/metrics.go` de Moby. La frase entrecomillada de Docker es traducción del aviso que aparece en su documentación oficial. Fuentes:

- cAdvisor — <https://github.com/google/cadvisor>
- Métricas de Prometheus en el demonio de Docker — <https://docs.docker.com/engine/daemon/prometheus/>
- Plugin `inputs.docker` de Telegraf — <https://github.com/influxdata/telegraf/tree/master/plugins/inputs/docker>
- Collector `textfile` de node-exporter — <https://github.com/prometheus/node_exporter#textfile-collector>
- Plugin de cgroups de Netdata — <https://learn.netdata.cloud/docs/agent/collectors/cgroups.plugin>
- Componente `prometheus.exporter.cadvisor` de Grafana Alloy — <https://grafana.com/docs/alloy/latest/reference/components/prometheus/prometheus.exporter.cadvisor/>
- Receiver `docker_stats` de OpenTelemetry — <https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/dockerstatsreceiver>
