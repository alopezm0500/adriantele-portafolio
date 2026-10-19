---
title: "Laboratorio de observabilidad en casa (1): Prometheus, Grafana y por qué existe cada pieza"
pubDate: "2026-10-06"
description: "Empiezo un laboratorio de observabilidad en mi propia laptop: Prometheus, Grafana y node_exporter corriendo como contenedores, definidos por completo en archivos. En esta primera entrega: la estructura, los YAML que la sostienen y qué decisión implica cada uno."
categories: [technical]
---

Llevo años usando tableros de monitoreo. Los heredé montados: cuando llegué a operaciones, Prometheus y Grafana ya estaban ahí, con sus dashboards, sus alertas y sus reglas escritas por alguien más. Los sé leer, sé qué significan y sé cuándo un indicador está mintiendo. Lo que nunca había hecho era **levantar la pila yo mismo, desde cero, en mi propia casa**.

Esa es la diferencia que quiero cerrar con este laboratorio. No quiero aprender a usar una herramienta: quiero entender por qué se despliega así y no de otra forma, por qué el archivo de configuración tiene exactamente esos campos y qué se rompe cuando falta uno. Y quiero hacerlo con mi hardware, mis restricciones y mis cortes de luz, no en un entorno de laboratorio con recursos infinitos.

Este es el arranque de esa serie: qué voy a construir, con qué piezas, y qué decide cada archivo de configuración.

## Qué voy a construir

La idea es una pila mínima, con la misma forma que tiene en cualquier empresa pero a escala de una laptop: tres contenedores, todos binarios escritos en Go, ninguno compilado en mi máquina.

```
        MI LAPTOP (kernel, /proc, /sys)
        ┌──────────────────────────────┐
        │ CPU · RAM · disco · red      │
        └──────────────┬───────────────┘
                       │ lectura de solo lectura (:9100)
               ┌───────┴───────────────┐
               │ node-exporter         │  traduce el estado de la
               │ monta / como /host:ro │  máquina a texto plano
               └───────┬───────────────┘
                       │ scrape cada 15 s (Prometheus jala, nadie empuja)
               ┌───────┴───────────────┐
               │ Prometheus    :9090   │  guarda series · 15 días
               └───────┬───────────────┘
                       │ consultas PromQL por HTTP
               ┌───────┴───────────────┐
               │ Grafana       :3000   │  no guarda nada: pregunta y dibuja
               └───────┬───────────────┘
                       │
        navegador en http://127.0.0.1:3000
```

Cuatro piezas, y conviene decirlas con nombre completo porque cada una existe por una razón distinta:

**El exporter.** Un proceso que no monitorea nada por su cuenta: solo **traduce**. `node-exporter` lee los contadores que el kernel ya lleva en `/proc` y `/sys` y los publica como texto plano en un endpoint `/metrics`. Ahí adentro hay cientos de líneas del estilo `node_memory_MemAvailable_bytes 3221225472`. No empuja información a ningún lado: espera a que alguien lo lea.

**Prometheus.** Es quien va a buscar esos datos, cada 15 segundos, a la lista de objetivos que yo le defina. Cada objetivo con su intervalo es un *job*. Esto es lo que más me costó interiorizar: **nadie empuja, el servidor jala**. Es el modelo *pull*, y es justo lo contrario de cómo funciona casi todo lo que uno ha tocado antes en operaciones.

**Grafana.** El que pregunta y dibuja. No almacena métricas, no tiene base de datos de indicadores: hace consultas a Prometheus y las grafica. Si Grafana se cae, mis datos siguen ahí intactos. Si Prometheus se cae, Grafana dibuja huecos. Esa separación explica por sí sola buena parte de los incidentes que veré en esta serie, y por eso la verificación va por capas.

**Y falta la cuarta, que viene después.** Los contenedores de Docker también generan datos —su CPU, su memoria, su red, su I/O—, pero `node-exporter` no los expone (su collector de cgroups solo cuenta cuántos hay, no cuánto consumen). Para ver el consumo por contenedor se necesita `cAdvisor`, y eso lo dejo para una entrega posterior. Aquí lo menciono porque conviene saber desde ahora que el laboratorio va a crecer.

## El dato, en su forma mínima

Antes de los archivos, la parte conceptual, porque sin esto los YAML parecen recetas copiadas.

Una medición se guarda como **nombre + etiquetas + (timestamp, valor)**. Así:

```
node_load1{host="bastion", job="node", instance="node-exporter:9100"} 1.54
```

Ese es el formato de una *serie temporal*. Y las etiquetas no son decorativas: son las que permiten, el día que tenga tres máquinas monitoreadas, compararlas en la misma gráfica sin duplicar consultas ni dashboards.

Dos ideas que voy a usar de inmediato y que conviene tener presentes:

- **Contador contra tasa.** `node_cpu_seconds_total` solo sube; es un contador acumulado desde el arranque. Graficado directo no dice nada útil. Lo que se grafica es su velocidad: `rate(node_cpu_seconds_total[5m])`, es decir cuánto subió por segundo en los últimos cinco minutos.
- **Instantánea contra rango.** Consultar "cuál es el valor ahora" y consultar "cómo se comportó en el tiempo" son dos operaciones distintas en la API de Prometheus (`/api/v1/query` y `/api/v1/query_range`). Un tablero se alimenta casi siempre de la segunda.

## Los archivos: qué decide cada uno

Aquí está el corazón de la primera entrega. El laboratorio completo son **seis archivos de texto** y una contraseña. Nada de clics, nada de configuración escondida en una interfaz.

```
lab-observabilidad/
├── compose.yaml                                  ← los 3 servicios
├── .env                                          ← la contraseña de Grafana
├── verificar.sh                                  ← comprobación por capas
├── prometheus/
│   └── prometheus.yml                            ← qué se scrapea y cada cuánto
└── grafana/
    └── provisioning/
        ├── datasources/prometheus.yml            ← conecta Grafana con Prometheus
        └── dashboards/
            ├── dashboards.yml                    ← de dónde lee los dashboards
            └── bastion-basico.json               ← el dashboard como código
```

### `compose.yaml`: qué corre y con cuántos recursos

Es el archivo que describe los tres servicios. Lo interesante no son las imágenes, son las decisiones que van pegadas a cada una:

```yaml
services:
  node-exporter:
    image: prom/node-exporter:v1.12.1
    restart: unless-stopped
    pid: host
    volumes:
      - /:/host:ro,rslave        # la raíz real de la laptop, solo lectura
    command:
      - --path.rootfs=/host
    mem_limit: 128m
```

El montaje `/:/host:ro` con `--path.rootfs=/host` es el detalle que más se equivoca la gente: sin él, el exporter reporta los datos **del contenedor**, no de mi laptop. Reportaría un sistema diminuto, con un disco de pocos megabytes, y el tablero se vería "plausible" pero sería mentira. `pid: host` sirve para lo mismo con los procesos: ver los del sistema operativo real.

```yaml
  prometheus:
    image: prom/prometheus:v3.15.0
    restart: unless-stopped
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --storage.tsdb.retention.time=15d
      - --web.enable-lifecycle
    ports:
      - "127.0.0.1:9090:9090"
    mem_limit: 512m
    depends_on:
      - node-exporter
```

Tres decisiones que vale la pena leer despacio. **La retención de 15 días** es lo que mantiene el disco bajo control: Prometheus guarda en bloques y borra solo lo viejo; con esta cantidad de series eso es alrededor de un gigabyte. **`--web.enable-lifecycle`** permite recargar la configuración sin reiniciar (`curl -X POST localhost:9090/-/reload`), algo que en producción ahorra ventanas de mantenimiento. Y **`127.0.0.1:9090:9090`** —no `9090:9090`— es deliberado: publicar el puerto solo en el loopback significa que el servicio existe para esta máquina y nadie más. Prometheus no tiene autenticación por diseño, así que exponerlo a la red sería regalarle a cualquiera el mapa completo de la casa, incluidos nombres de contenedores y rutas.

```yaml
  grafana:
    image: grafana/grafana:13.2.3
    restart: unless-stopped
    environment:
      GF_SECURITY_ADMIN_USER: admin
      GF_SECURITY_ADMIN_PASSWORD: ${GF_ADMIN_PASSWORD:?define GF_ADMIN_PASSWORD en el archivo .env}
      GF_ANALYTICS_REPORTING_ENABLED: "false"
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning:ro
    ports:
      - "127.0.0.1:3000:3000"
```

Grafana sí tiene login, y su configuración por variables de entorno es una forma de no dejar credenciales dentro de la imagen. El detalle feo y útil a la vez es `${GF_ADMIN_PASSWORD:?...}`: esa sintaxis hace que el arranque **falle** si la variable no está definida, en lugar de levantar un Grafana con la contraseña por defecto que todo el mundo conoce. Prefiero un error ruidoso a un servicio con credenciales adivinables.

Y arriba del todo, enlazando las piezas:

```yaml
volumes:
  prom_data:
  grafana_data:
```

Los volúmenes nombrados son lo que hace que apagar la pila (`docker compose down`) no borre la historia. Solo `docker compose down -v` la destruye, y eso conviene saberlo antes de escribirlo por accidente.

### `prometheus.yml`: qué se jala y cada cuánto

Este es el archivo que más importa entender, porque es donde vive el modelo *pull*:

```yaml
global:
  scrape_interval: 15s
  scrape_timeout: 10s
  evaluation_interval: 15s

scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ['localhost:9090']

  - job_name: node
    static_configs:
      - targets: ['node-exporter:9100']
        labels:
          host: bastion
```

`scrape_interval` es la resolución del laboratorio: cada 15 segundos habrá un punto por serie. Bajarlo da más detalle y multiplica el uso de disco; subirlo ahorra recursos y puede esconder picos que duran segundos. No hay valor correcto, hay valor elegido.

El `job_name: prometheus` que apunta a sí mismo parece un chiste, pero es el chiste más rentable del archivo: Prometheus se monitorea solo, así que tengo visibilidad de cuántas series carga en memoria, cuánto tarda cada scrape y cuántos le fallan. El primer indicador que hay que aprender a leer de una pila de monitoreo es la pila de monitoreo.

Y `targets: ['node-exporter:9100']` tiene una trampa que quiero dejar escrita: **dentro de la red de Docker, los servicios se hablan por el nombre del servicio, no por `localhost`**. `localhost` dentro de un contenedor es el contenedor mismo, así que confundir esto produce un target en estado `down` que parece problema de red cuando en realidad es un nombre mal escrito.

Etiquetas como `host: bastion` parecen sobrar cuando hay una sola máquina. No sobran: son las que van a permitir agregar la NAS y el servidor de casa sin rehacer el dashboard.

### `grafana/provisioning/`: los dashboards como código

La carpeta `provisioning` es la parte que convierte esto en *infraestructura como código*. El datasource se declara así:

```yaml
datasources:
  - name: Prometheus
    type: prometheus
    url: http://prometheus:9090
    uid: prometheus
    isDefault: true
    editable: false
    jsonData:
      timeInterval: 15s
```

`url: http://prometheus:9090` otra vez el nombre del servicio. El `uid` fijo existe porque los dashboards guardados en JSON referencian ese identificador: sin él, cada instalación nueva crearía un datasource con un identificador distinto y los paneles quedarían huérfanos. Y `timeInterval: 15s` debe coincidir con el `scrape_interval`; si no coincide, Grafana puede pedir datos con una granularidad que no existe y dibujar huecos que parecen fallas del sistema.

El segundo archivo de la carpeta solo le dice a Grafana **dónde** buscar dashboards en disco, y con qué frecuencia releerlos. El contenido del dashboard —`bastion-basico.json`— queda como un archivo versionable más. Corregir un panel es editar el JSON y reiniciar el contenedor, y si algún día rompo el volumen de Grafana, borro, levanto y todo vuelve a quedar igual.

Eso es lo que se llama provisionar, y es lo que quiero aprender de verdad: los clics no son reproducibles, los archivos sí. Un tablero hecho a mano en la interfaz es conocimiento que se va con la máquina; un tablero en un YAML o un JSON es conocimiento que viaja.

### `.env` y `verificar.sh`

El `.env` guarda la contraseña de Grafana, fuera del control de versiones y con permisos restringidos. El `verificar.sh` —que no es parte del servicio, sino mi herramienta de diagnóstico— comprueba el laboratorio **por capas**, de abajo hacia arriba: que Docker responda, que los tres contenedores estén arriba, que los endpoints HTTP contesten, que los targets de Prometheus estén en `up`, y que efectivamente haya datos guardándose en la base. La regla es no pasar de capa hasta que la de abajo esté en verde. Cuando algo falle —y va a fallar— el diagnóstico ya está acotado a una sola capa.

## Lo que este laboratorio no tiene

Para no vender algo que no es: esta pila **no tiene** alertas, ni notificaciones, ni alta disponibilidad, ni TLS, ni autenticación en Prometheus. Tampoco guarda logs —eso es otra pata de la observabilidad, con otras herramientas— ni métricas de negocio, que en mis proyectos viven en PostgreSQL y requieren su propio camino.

Es un taller, no un servicio. Su valor no está en vigilar mi laptop, sino en que cada pieza quedó escrita, entendida y reproducible. Lo que sí va a tener desde el primer día es algo que en el trabajo doy por sentado: el registro de por qué cada decisión de configuración es como es. Esa parte, sospecho, es la que más me va a servir.

## Qué sigue en la serie

- **Entrega 2:** arrancar la pila, recorrer el flujo completo de los datos y leer el primer tablero, incluido lo que dice y lo que no dice sobre mi propia máquina.
- **Entrega 3:** los contenedores como objetivo, con `cAdvisor`, porque el consumo por contenedor es justamente lo que el exporter de sistema no ve.
- **Entrega 4:** métricas propias, cuando lo que quiero medir no lo expone nadie: ahí entra el collector de archivos de texto y un script propio.
- **Y una posible entrega 5:** Grafana leyendo directo una base de datos PostgreSQL, para tableros de negocio sin pasar por Prometheus.

Escribo esto mientras la pila todavía no está encendida, que es el momento más honesto para documentar una decisión: cuando aún no sé qué me va a salir mal.

*Nota: las versiones fijadas (Prometheus v3.15.0, Grafana 13.2.3, node-exporter v1.12.1) se verificaron en los registros oficiales al momento de escribir esta entrega, el 6 de octubre de 2026. Los consumos estimados de memoria y disco son cálculos sobre una laptop con 7.7 GB de RAM, no mediciones del despliegue en marcha.*
