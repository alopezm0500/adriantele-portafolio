---
title: "Anatomía de un panel de Grafana: del clic al archivo"
pubDate: "2026-10-06"
description: "Un panel de Grafana no es magia ni una caja negra: es un objeto dentro de un archivo de texto. Esto es lo que hay debajo del botón Add to dashboard, las tres maneras de crear el mismo panel y las decisiones que solo se entienden cuando ya tienes datos reales en la pantalla."
categories: [technical]
---

En la entrega anterior cerré con una instrucción de tres palabras: *Add to dashboard*. Funciona. Haces clic, la gráfica aparece, el tablero crece. Pero cuando me senté a escribirlo me di cuenta de que no había entendido nada: había producido un panel sin saber qué era un panel, y lo único que podía explicar era la secuencia de clics. Si mañana se borra el volumen de Grafana, mi tablero desaparece y no tengo la menor idea de dónde vivía.

Esta pieza es la que me faltaba para cerrar esa parte. Va como intermedio de la serie del laboratorio de observabilidad, porque el tema se salió del guion que tenía: no es cómo conectar cAdvisor, es **qué guarda Grafana cuando haces clic**.

## Un tablero es un archivo de texto

Empecé por mirar el que ya tenía funcionando. El dashboard "Bastión · básico" que quedó provisionado en la entrega 1 no es más que un archivo:

```bash
~/lab-observabilidad/grafana/provisioning/dashboards/bastion-basico.json
```

Cuatro paneles: RAM usada, disco libre, carga del sistema y uptime. Cuatro gráficas que llevo días viendo, y detrás de cada una hay exactamente el mismo objeto repetido cuatro veces, con distintos valores. Ni una línea de código compilado, ni un formato binario, ni una base de datos con un esquema secreto: texto plano que puedo abrir con cualquier editor.

Eso cambió mi forma de ver la herramienta. La interfaz de Grafana no *es* el tablero, la interfaz es un editor del tablero. Lo que existe de verdad es el archivo.

## Las cinco decisiones de cada panel

El panel que quiero para ver la memoria de mis contenedores se ve así:

```json
{
  "type": "timeseries",
  "title": "RAM por contenedor",
  "datasource": { "type": "prometheus", "uid": "prometheus" },
  "gridPos": { "h": 8, "w": 12, "x": 0, "y": 0 },
  "fieldConfig": {
    "defaults": {
      "unit": "bytes",
      "custom": { "lineWidth": 2, "fillOpacity": 10 }
    },
    "overrides": []
  },
  "options": {
    "legend": { "displayMode": "table", "placement": "bottom", "calcs": ["lastNotNull", "max"] },
    "tooltip": { "mode": "multi" }
  },
  "targets": [
    {
      "datasource": { "type": "prometheus", "uid": "prometheus" },
      "expr": "sum by (container_label_com_docker_compose_service) (container_memory_working_set_bytes{job=\"cadvisor\", name!=\"\"})",
      "legendFormat": "{{container_label_com_docker_compose_service}}",
      "refId": "A"
    }
  ]
}
```

Todo panel responde cinco preguntas, y una sola vez cada una:

- **`type`** — qué dibujo. `timeseries` es la línea en el tiempo; también existe `stat` para un número grande, `gauge` para un velocímetro, `table` para una tabla. Cambiar de `timeseries` a `stat` no toca la consulta: es la misma pregunta con otro traje.
- **`datasource`** — de dónde vienen los datos. `uid: prometheus` es el origen que provisioné por archivo en la entrega 1. Grafana soporta muchas fuentes a la vez, y aquí está el primer mensaje importante: el panel no sabe de Prometheus, sabe preguntar.
- **`targets[].expr`** — la pregunta, en PromQL. `refId: A` es solo el nombre interno de esa consulta dentro del panel; cuando tienes tres consultas en el mismo panel, son A, B y C.
- **`legendFormat`** — cómo se llama cada línea. Sin esto verías `{container_label_com_docker_compose_service="grafana", instance="cadvisor:8080", job="cadvisor", ...}` en la leyenda. Con la plantilla entre dobles llaves, esa misma serie se llama simplemente `grafana`.
- **`fieldConfig.defaults.unit`** y **`gridPos`** — cómo se formatea el número y dónde se acomoda. `gridPos` es una cuadrícula de 24 columnas: `w: 12` es medio ancho, `h: 8` una altura cómoda, y la pareja `x`/`y` la posición.

Nada más. El resto del JSON —`options.legend`, `custom.lineWidth`, `calcs`— es cosmética, y esa sí conviene dejar que la UI la genere: nadie quiere escribir a mano el grosor de una línea.

## Dos decisiones que solo se entienden con datos en pantalla

**Primera: no dividas en la consulta.** Mi primer impulso fue convertir bytes a megabytes dentro de PromQL, algo así como dividir entre 1024 dos veces. Es un error de novato con consecuencias reales: si el número ya viene en MB, la gráfica se queda sin contexto cuando un contenedor pasa de 1024 MB, y el eje te muestra "1024" en lugar de "1 GiB". La consulta devuelve **bytes crudos** y el panel hace la conversión con `"unit": "bytes"`. Grafana formatea la misma serie en KB, MB o GiB según el valor, sin que yo pierda precisión en el camino.

**Segunda: `legendFormat` no es un detalle estético, es la diferencia entre un tablero que se lee y uno que se descifra.** Yo llegué a este tema por una consulta de inventario, escrita justamente para no adivinar:

```
count by (container_label_com_docker_compose_service) (container_memory_working_set_bytes{name!=""})
```

Esa consulta no mide nada: cuenta series. Me devolvió cuatro resultados, uno por servicio, cada uno con valor 1. Su valor estaba en otra parte: me dijo **cómo se llaman** las cosas. Y ahí me llevé la primera sorpresa, porque venía arrastrando una duda de la entrega 2 sobre si el label `name` traía o no una barra al inicio:

```
{container_label_com_docker_compose_service="grafana", name="obs-grafana", image="grafana/grafana:13.2.3", ...}
```

Sin barra. El nombre es el `container_name` que yo escribí en el compose, tal cual. Pero lo verdaderamente útil fue descubrir que tenía dos formas de identificar cada contenedor, y que **la etiqueta del servicio de compose es mejor clave que el nombre del contenedor**: es estable, legible, no arrastra prefijos y sobrevive si algún día cambio un `container_name`. Por eso la consulta del panel agrupa por servicio y no por nombre.

## Los números que hicieron todo esto más interesante

Con el panel de memoria funcionando y la consulta de porcentaje en Explore, salió la tabla que llevaba dos entregas esperando:

- **grafana:** 63.8% de su límite → alrededor de **447 MB**
- **prometheus:** 9.9% → unos 69 MB
- **cadvisor:** 16.2% → unos 41 MB
- **node-exporter:** 11.3% → unos 14 MB

El laboratorio completo consume unos 572 MB de memoria real. Barato para una laptop de 8 GB que además es mi máquina de diario.

Y de paso se resolvió la duda que dejé abierta en la entrega 2, donde Grafana aparecía al 99.9% de su límite de 512 MB. La respuesta corta: **no era caché fantasma, era memoria de verdad.** La respuesta larga es más útil, y es una distinción que vale para cualquier contenedor:

- `container_memory_usage_bytes` es toda la memoria que el contenedor *toca*, e incluye caché de páginas que el kernel puede soltar solo.
- `container_memory_working_set_bytes` es la que el contenedor *necesita*, la que el kernel mira cuando se queda sin memoria y tiene que decidir a quién quitarle páginas.

Un límite de memoria se juzga contra la segunda. Y con 447 MB de working set contra un techo de 512 MB, Grafana estaba al 87%: no a punto de morir —el kernel todavía tenía caché que reclamar antes de llegar al OOM— pero sin margen. La razón correcta para subirle el límite no fue el pánico: fue que cualquier consulta pesada, dashboard refrescándose o plugin nuevo se comía esos 65 MB que sobraban. Esa es la diferencia entre leer una métrica y entenderla.

## El error que me enseñó gramática de PromQL

La consulta del porcentaje la escribí en dos líneas, cuidando el formato, y me encontré esto:

```
bad_data: invalid parameter "query": 2:1: parse error: unexpected identifier "container_memory_working_set_bytes"
```

PromQL no perdona los saltos de línea en medio de una expresión. El parser cierra la expresión al terminar la línea, así que la primera línea quedó como una consulta completa y la segunda le sobró. La regla que adopté: si parto una consulta, el corte va **después de un operador o después de un paréntesis abierto**, nunca justo antes. Todo en una línea también funciona, y para un par de operadores es lo más honesto.

## Tres maneras de crear el mismo panel

Aquí está el punto que quería entender desde el principio, porque el mismo objeto JSON se puede generar por tres caminos distintos y cada uno deja las cosas en un lugar diferente.

**1. La interfaz.** En Explore armas la consulta, haces clic en *Add to dashboard* y Grafana escribe el JSON por ti. Es la ruta más rápida para aprender, con una trampa: el dashboard vive en la base de datos interna de Grafana, la que está dentro del volumen `grafana_data`. No aparece en git, no se puede revisar en un diff y desaparece si borras el volumen. Es un tablero que existe solo mientras exista la instalación.

**2. El archivo (provisioning).** El panel se escribe en un `.json` dentro de `grafana/provisioning/dashboards/`, junto con el título y el `uid` del dashboard, y se reinicia Grafana. Un archivo de configuración le dice a Grafana que vigile esa carpeta, así que cada archivo que aparece ahí se convierte en un tablero. Es el camino que ya usaba sin saberlo: el "Bastión · básico" llegó así. Ventajas obvias: está en el repo, se versiona, se revisa como cualquier archivo de configuración y sobrevive a la instalación.

**3. La API.** `GET /api/dashboards/uid/<uid>` te devuelve el JSON de un tablero existente y `POST /api/dashboards/db` lo importa. Es la ruta para automatizar: si algún día tengo veinte tableros o quiero generarlos desde un script, esta es la puerta.

Y aquí va la advertencia que me costó un rato entender: cuando el tablero viene de un archivo, Grafana lo marca como provisionado y la interfaz deja de ser la autoridad. Puedo experimentar en la UI, pero lo que me guste tiene que volver al archivo, no al revés. Es la misma lógica de la infraestructura como código aplicada a un tablero: el repositorio manda, la interfaz es un editor cómodo.

## El flujo que voy a usar de aquí en adelante

Después de romperlo un par de veces, me quedé con este orden:

1. Armo la consulta en **Explore**, que es el laboratorio donde nada se guarda y nada importa.
2. Cuando la consulta ya dice lo que quiero, la mando a un **tablero nuevo** con *Add to dashboard*.
3. Ajusto títulos, unidades y leyendas ahí, viendo la gráfica.
4. **Exporto el JSON** del tablero completo y lo dejo como archivo en la carpeta de provisioning.
5. Reinicio Grafana, confirmo que el tablero aparece igual, y **borro el que creé por la interfaz** para no tener dos copias del mismo.

Es más pasos que el clic original, y aun así es más rápido: la parte de pensar la consulta sigue siendo la misma, y lo que agrego es la garantía de que el trabajo no se queda dentro de un volumen de Docker.

## Qué sigue

Con esto ya puedo armar el tablero de contenedores sin copiar comandos: RAM por servicio, porcentaje del límite y CPU, cada uno como un panel con una sola pregunta. Ese es el cierre de la entrega 3, que ya trae a cAdvisor funcionando y con las banderas correctas.

Después vienen las dos promesas que tengo anotadas: las métricas propias con el collector de textfile —para medir cosas que ningún exporter conoce, como la memoria de mis dos instancias del asistente— y Grafana leyendo PostgreSQL directamente, que es otra historia: ahí el panel no habla PromQL, habla SQL.
