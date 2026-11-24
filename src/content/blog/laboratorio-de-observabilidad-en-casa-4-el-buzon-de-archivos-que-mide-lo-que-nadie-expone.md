---
title: "Laboratorio de observabilidad en casa (4): el buzón de archivos que mide lo que nadie expone"
pubDate: "2026-11-24"
description: "Dos servicios corriendo 24/7 en mi laptop que no son contenedores: cAdvisor no los ve y node-exporter solo los cuenta como RAM del host. Los mido con el recolector más viejo de la pila, un buzón de archivos de texto, y aprendo que en Prometheus la procedencia no es quien produce el dato sino quien lo raspa."
categories: [technical]
---

En la entrega anterior cerramos el hueco de los contenedores: con cAdvisor ya sé cuánta memoria y cuánto CPU consume cada pieza del laboratorio, y tengo un tablero que lo cuenta con historia en vez de una captura de `docker stats`.

Pero en esta laptop hay dos cosas que se quedaron fuera de todo. Dos procesos que corren las veinticuatro horas, siete días a la semana, y que no aparecen en ninguna de mis dos fuentes. Son las dos instancias del bot que atiende este proyecto: una para mí, otra para mi esposa. No son contenedores —son servicios de `systemd`— y ahí se acaba el alcance de lo que tenía montado.

`cAdvisor` no las ve porque su unidad de trabajo es el contenedor de Docker. `node-exporter` las ve, pero como parte del montón: son RAM ocupada del host, indistinguible del navegador o del gestor de archivos. Si mañana una de las dos se dispara a tres gigabytes, mi tablero no me va a decir cuál fue. Me va a decir que el bastión está usando más memoria, y voy a pasar la tarde buscando.

Esa es la entrega 4: dejar de mirar la computadora y empezar a mirar mis propios sistemas.

## La tentación equivocada

El primer impulso fue instalar algo. Un exporter propio en Python, un agente que lea el estado de los servicios y publique `/metrics` en un puerto, algo con nombre y banderas.

Y me detuve por una razón de principio, no de pereza: ya tengo un exporter corriendo. `node-exporter` está en la pila desde la primera entrega, ya está siendo raspado cada quince segundos, ya tiene su `mem_limit` y su healthcheck. Levantar un segundo agente para publicar once números significa un proceso más que cuidar, un puerto más que vigilar, un punto más donde se puede caer algo en silencio.

Volví a leer la documentación de `node-exporter` buscando si había una forma de meterle datos propios. La hay, y es más vieja que todo lo demás de la pila: el **collector textfile**.

## El recolector más viejo de la pila

Funciona así de simple: `node-exporter` recibe una bandera con la ruta de una carpeta. Cada vez que alguien lo raspa, antes de responder, abre esa carpeta, lee todos los archivos que terminen en `.prom` y pega su contenido a la respuesta.

Eso es todo. No hay daemon, no hay socket, no hay protocolo. El exporter no sabe qué significan esos números ni se preocupa: son líneas de texto con el mismo formato que él mismo produce, y las sirve junto con las suyas.

```yaml
node-exporter:
  image: prom/node-exporter:v1.12.1
  volumes:
    - /:/host:ro,rslave
    - ./textfile:/var/lib/node_exporter/textfile:ro
  command:
    - --path.rootfs=/host
    - --collector.textfile.directory=/var/lib/node_exporter/textfile
```

La carpeta se monta en solo lectura y como volumen de bind, o sea, un directorio de mi laptop que aparece dentro del contenedor. Quien escribe los archivos es un script que corre fuera de Docker, como mi usuario, sin privilegios.

Me gusta la analogía del buzón: el exporter pasa cada quince segundos, mira si hay cartas y se las lleva. Si el cartero deja de pasar, nadie se enterá hasta que alguien abre el buzón y lo encuentra vacío. Ese detalle, que parece un comentario al pasar, va a ser el problema más serio de toda la entrega.

## El contrato de formato

Antes de escribir el script tuve que entender el formato, porque aquí no hay librería que me salve: el archivo que escriba tiene que ser Prometheus válido o no existe.

```
# HELP nanobot_up 1 si el servicio systemd está activo.
# TYPE nanobot_up gauge
nanobot_up{instance="leia",service="nanobot-leia"} 1
```

Tres piezas. `HELP` es la descripción que aparece cuando haces *hover* en Grafana; no es decorativo, es la documentación que tu yo de dentro de seis meses va a necesitar. `TYPE` le dice a Prometheus cómo interpretar la serie — `gauge` para un valor que sube y baja, `counter` para un acumulado que solo crece. Y la línea de valor es el nombre de la métrica, las etiquetas entre llaves y el número.

Los nombres siguen una convención que vale la pena respetar: los acumulados terminan en `_total` y los bytes llevan `_bytes`. No es capricho, es lo que permite que `rate()` haga lo suyo sin equivocarse.

Y las etiquetas son la decisión de diseño importante. Puse dos: `instance` (`leia`, `vetia`) y `service` (el nombre real de la unidad en `systemd`). La primera es la que uso para graficar y para agrupar; la segunda es la que necesito cuando quiero ir a la máquina a hacer algo. Una es para el tablero, la otra para la terminal, y no conviene confundirlas.

## Qué lee el script, y por qué

El script no consulta una API ni habla con el bot. Lee lo mismo que el kernel le cuenta a Docker, solo que por el otro caminito:

```bash
/sys/fs/cgroup/system.slice/nanobot-leia.service/memory.current
/sys/fs/cgroup/system.slice/nanobot-leia.service/memory.peak
/sys/fs/cgroup/system.slice/nanobot-leia.service/memory.stat
/sys/fs/cgroup/system.slice/nanobot-leia.service/pids.current
/sys/fs/cgroup/system.slice/nanobot-leia.service/cpu.stat
```

Todo eso es **cgroup v2**, y esa es la lección técnica de la entrega: el contenedor y el servicio de `systemd` no son dos mundos. Son hermanos en el mismo árbol. Un contenedor de Docker vive en un cgroup que administra Docker; un servicio de `systemd` vive en un cgroup que administra `systemd`. El kernel no hace distinción: los dos tienen contadores de memoria, de procesos y de CPU, en los mismos archivos, con los mismos nombres.

Lo que cambia no es el dato, es **quién lo traduce y cómo lo descubre**. cAdvisor pregunta a la API de Docker qué contenedores existen y va a leer sus cgroups. Para mis dos servicios ese camino no existe: no hay contenedor que preguntar. Lo que sí hay es un nombre de unidad predecible, y con eso basta para llegar al archivo.

Del `memory.stat` saco dos números que en la entrega 3 me costaron una confusión:

```
memory.current  → lo que el cgroup tiene contabilizado (incluye caché de archivos)
anon            → heap y pilas: lo que el proceso realmente no puede soltar
file            → caché de páginas, que el kernel puede reclamar si hace falta
peak            → el máximo histórico desde que arrancó el cgroup
```

Es la misma distinción que `usage` contra `working_set` en cAdvisor, y la razón por la que el panel tiene dos gráficas de memoria y no una. Si solo miro `current`, un proceso que leyó archivos grandes parece gordo cuando en realidad está usando caché que el sistema puede tirar sin consecuencias.

El resto sale de `systemctl show`, que es de solo lectura y no pide permisos: `NRestarts` para los reinicios, `ActiveEnterTimestamp` para calcular el uptime.

Y una decisión que parece menor: **si el servicio no existe, el script emite `0`, no un hueco.**

```bash
mem_current=$(cat "$d/memory.current" 2>/dev/null || echo 0)
```

Podría abortar y no escribir nada, y sería más "correcto". Pero entonces una instancia caída desaparecería del tablero, y una gráfica que se corta no dice "se cayó", dice "aquí no hay datos", que es exactamente lo que dice cuando Prometheus está apagado. Prefiero el cero explícito y una métrica aparte, `nanobot_up`, que confirme si está viva.

## El detalle que casi nadie escribe: la escritura atómica

`node-exporter` abre los archivos de la carpeta en cada scrape. Si mi script está escribiendo justo en ese instante, el exporter puede leer medio archivo. Y aquí está lo que no es obvio: no descarta la línea a medias, descarta **el archivo completo** y reporta un error de parseo.

El resultado sería un hueco de quince segundos exactamente donde estaba pasando algo interesante. La solución es de una línea y la aprendí de la documentación:

```bash
} > "$tmp"
mv -f "$tmp" "$OUT/nanobot_${inst}.prom"
```

Escribo a un temporal y lo muevo encima. En el mismo sistema de archivos, `mv` es atómico: quien lea ve el archivo viejo o el nuevo, nunca la mezcla. Es el mismo truco que usan los editores de texto serios y los archivos de configuración de medio Linux.

## Un timer, no un cron

Los archivos tienen que refrescarse al mismo ritmo al que se raspan, o sea cada quince segundos. `cron` no llega ahí: su unidad mínima es el minuto. Así que la pieza que dispara el script es un timer de usuario de `systemd`:

```ini
[Timer]
OnBootSec=30s
OnUnitActiveSec=15s
AccuracySec=1s
Unit=nanobot-metrics.service
```

`OnUnitActiveSec=15s` cuenta desde la última ejecución, así que el ritmo no se acumula ni se desfasa como pasaría con un cron de cada minuto. `AccuracySec=1s` le quita a `systemd` su libertad de agrupar timers parecidos para ahorrar energía; en una laptop eso es sensato, en un laboratorio de métricas es ruido.

El servicio es `Type=oneshot`: corre, escribe, termina. No queda nada en memoria entre ejecuciones, que es justo lo que quiero de una pieza que solo existe para traducir.

Y una trampa de operación para quien lo haga en su máquina: `systemctl --user` desde una sesión no interactiva —una tarea programada, un agente, un script de despliegue— falla con un `Failed to connect to bus` que no tiene nada que ver con permisos. Falta exportar la variable que le dice dónde está el bus del usuario:

```bash
export XDG_RUNTIME_DIR=/run/user/$(id -u)
```

Perdí un rato con eso pensando que era un problema de privilegios. Era una variable de entorno.

## La etiqueta que miente

Aquí va la que me parece la mejor lección de toda la serie.

Mis métricas se llaman `nanobot_memory_current_bytes` y hablan de un servicio. Pero en Prometheus llegan con `job="node"`, porque quien las sirve es `node-exporter`, y el `job` lo pone Prometheus según el objetivo que raspó. No según quién produjo el número.

Al principio me pareció un defecto. Después entendí que es el modelo correcto: **en Prometheus la procedencia es quién raspa, no quién calcula.** El exporter es el punto de recolección; el script es un detalle de implementación que Prometheus no conoce ni necesita conocer.

Es una distinción que transfiero directo al trabajo. Cuando en un clúster un tablero no muestra lo que esperaba, lo primero que reviso es el `job`, no la consulta: si el `ServiceMonitor` está apuntando al puerto equivocado, la serie va a llegar con la etiqueta del recolector correcto y el contenido de otro lado. La consulta nunca fue el problema.

## El tablero

Con los datos llegando, el tablero `nanobot · instancias` quedó en cuatro gráficas de tiempo y cuatro indicadores.

Las expresiones que valen la pena:

```promql
# CPU como porcentaje de un núcleo
rate(nanobot_cpu_seconds_total[5m]) * 100

# cuota del bastión que se llevan las dos instancias
100 * sum(nanobot_memory_current_bytes) / node_memory_MemTotal_bytes
```

La primera es el ejemplo perfecto de por qué el tipo importa: `nanobot_cpu_seconds_total` es un contador que solo crece, y graficarlo directo da una diagonal sin sentido. `rate()` sobre cinco minutos lo convierte en lo que uno quiere ver. La segunda mezcla mis métricas con las de `node-exporter` en la misma consulta, y ahí está el chiste de tener todo en el mismo Prometheus: el denominador ya estaba ahí.

## Los números de hoy

Esto es lo que el laboratorio dice hoy, con las dos instancias corriendo desde el mismo arranque de la laptop:

```
LeIA    RAM 335 MB   anónima 266 MB   pico 2,911 MB   tareas  5   reinicios 0   uptime 4.6 d
VetIA   RAM 136 MB   anónima 123 MB   pico   275 MB   tareas 15   reinicios 0   uptime 4.6 d
```

Sumadas son 471 MB de los 8 GB del bastión, alrededor del 6 %. El laboratorio de observabilidad, para comparar, pesa unos 386 MB: mis dos bots juntos pesan más o menos lo mismo que la herramienta que los vigila. Eso no me molesta —la herramienta mide a los dos y a todo lo demás— pero es un dato que conviene tener.

Hay dos cosas que me interesan más que el total.

La primera es el **pico**: 2.9 GB en LeIA contra 335 MB ahora. Ese pico no es una fuga, es una sesión larga que llegó al techo de contexto y obligó a compactar el historial. Sin `memory.peak` no lo habría visto nunca, porque ocurrió hace días y ya se había ido. Es el tipo de dato que solo existe si guardas historia.

La segunda es el contraste con la medición del 20 de octubre: ese día LeIA marcaba 273 MB y VetIA 36 MB. La diferencia no es que hayan engordado a lo tonto: VetIA pasó de 36 a 136 MB porque tiene sesiones activas que antes no tenía. Y esto es lo que un tablero hace y una captura no — me deja ver que el crecimiento coincide con uso, no con el paso del tiempo.

## La trampa que me falta cerrar

Ahora la parte honesta, porque este es mi laboratorio y no un tutorial de marketing.

El patrón textfile tiene un modo de falla feo: **si el script deja de correr, los archivos se quedan con el último valor y Grafana dibuja una línea plana.** No hay error, no hay hueco, no hay nada rojo. Hay una recta perfecta que parece decir "todo estable" cuando en realidad dice "nadie está midiendo desde el martes".

Es exactamente el mismo problema que resuelven los *dead man's switch* en los sistemas serios: se vigila la ausencia del dato, no el dato. La solución es una métrica de latido que se escriba en la misma corrida:

```
nanobot_metrics_last_run_timestamp_seconds{instance="leia"} 1795142000
```

y una alerta que dispare cuando `time() - nanobot_metrics_last_run_timestamp_seconds > 60`. No la tengo implementada todavía. La dejé anotada como la primera mejora pendiente, porque sin ella todo lo demás de esta entrega está a la intemperie y yo no lo sabría.

## Lo que se transfiere

Del trabajo a casa y de casa al trabajo hay un puente en esta entrega, y es el contrato de exposición.

En un clúster de OpenShift, las métricas de una aplicación no se sacan instalando un agente. Se declara un `ServiceMonitor` o un `PodMonitor`, y para eso el servicio tiene que exponer un puerto con nombre y la aplicación tiene que publicar sus números en un formato que alguien pueda leer. Si la aplicación no expone nada, ningún recolector lo inventa.

El textfile collector es la versión pobre de ese mismo contrato: en vez de un endpoint HTTP, un archivo con formato. Pero el principio es idéntico — **hay que declarar lo que se mide**. Los contadores de negocio de un Kamailio no salen de un agente que mira el sistema operativo; salen de sus módulos, porque alguien los escribió para que salieran.

Y eso responde la pregunta que me traje de esta entrega: cuando un tablero no muestra algo, casi nunca falta una herramienta. Falta una declaración.

## Qué sigue

Con las métricas de infraestructura, las de contenedores y las mías, la pila ya cuenta lo que pasa *dentro* de la máquina. Lo que no puede contar es lo que pasa *en la aplicación*: cuántos usuarios nuevos entraron, cuántas tarjetas se vendieron, cuántas llamadas se completaron.

Para eso Prometheus es la herramienta equivocada, y no por limitación técnica sino por diseño: está hecho para series temporales de alta frecuencia, no para preguntarle a una tabla de pedidos cuánto facturamos por semana.

La entrega 5 es el otro datasource de Grafana: leer PostgreSQL directo y poner un tablero de negocio al lado de los de infraestructura, en la misma pantalla. Ahí el laboratorio deja de ser un ejercicio de operación y se vuelve lo que de verdad es en las empresas: una sola puerta de entrada para las dos preguntas distintas, la de "¿está sano?" y la de "¿está funcionando?".
