---
title: "Laboratorio de observabilidad en casa (3): cAdvisor y lo que pasa dentro de los contenedores"
pubDate: "2026-10-20"
description: "cAdvisor estaba en mi compose desde la primera entrega, copiado de los tutoriales sin entenderlo. En esta entrega lo desarmo: por qué cambió de registro, qué desbloquea el modo privilegiado, cómo evitar que las etiquetas de Docker revienten la cardinalidad y por qué se agrupa por servicio y no por nombre."
categories: [technical]
---

Dejo la confesión completa: `cAdvisor` estaba en mi `compose.yaml` desde la primera entrega, y lo puse porque todos los ejemplos que encontré lo traen. Lo levanté, respondió, apareció en la lista de objetivos de Prometheus y ahí lo dejé, entendiendo poco más que "sirve para ver contenedores".

Esta entrega es mi manera de pagar esa deuda. Desarmo el servicio pieza por pieza, explico qué decisión hay detrás de cada bandera y monto el tablero de contenedores que debí haber hecho desde el primer día. También es la entrega donde el laboratorio empieza a pagarse solo: en la anterior ese dato de Grafana clavado en 511 MB lo vi con `docker stats`, no en el tablero. Esa vergüenza chica se acabó aquí.

## El hueco que deja `node-exporter`

`node-exporter` ve la máquina como una máquina: cuánta RAM hay ocupada, cuánto CPU se consume, cuánto disco queda libre. Y eso es exactamente lo que no alcanza cuando el problema está dentro.

Si mi disco está al 42 % y mi RAM al 15 %, no sé quién se está comiendo qué. Puedo saber que el host tiene 572 MB en uso por mis cuatro contenedores, pero no cuál de los cuatro es el responsable, ni a qué hora creció, ni si creció de golpe o de a poco. `node-exporter` mide el edificio; yo necesito el plano de los departamentos.

Ese es el trabajo de cAdvisor. Su nombre completo es Container Advisor y es un proyecto de Google que nació justo para esto: leer los cgroups del kernel, asociarlos a cada contenedor y publicarlos como métricas. Es, literalmente, la misma pieza que Kubernetes consulta cuando el kubelet expone `/metrics/cadvisor`: cuando veo un tablero de clúster con el consumo por pod, del otro lado está este señor.

## Primera trampa: el registro cambió de casa

Aquí me habría quedado dos horas si no fuera por la documentación. Cualquier tutorial de 2022, y la mayoría de los de 2024, te manda a:

```
image: gcr.io/cadvisor/cadvisor
```

Eso ya no sirve para versiones recientes. **Desde la v0.53.0 la imagen se publica en `ghcr.io/google/cadvisor`**, y el registro viejo de Google Container Registry se quedó con las versiones anteriores y sin actualizaciones. El resultado es confuso: `docker pull` no te dice "esta imagen ya no se mantiene", te dice que la etiqueta no existe, y uno interpreta que escribió mal el número de versión.

En mi `compose.yaml` quedó así:

```yaml
cadvisor:
  image: ghcr.io/google/cadvisor:v0.60.6
  container_name: obs-cadvisor
  restart: unless-stopped
  privileged: true
  devices:
    - /dev/kmsg
  mem_limit: 256m
  volumes:
    - /:/rootfs:ro
    - /var/run:/var/run:ro
    - /sys:/sys:ro
    - /var/lib/docker/:/var/lib/docker:ro
    - /dev/disk/:/dev/disk:ro
  command:
    - --docker_only=true
    - --housekeeping_interval=15s
    - --allow_dynamic_housekeeping=false
    - --store_container_labels=false
    - --whitelisted_container_labels=com.docker.compose.service
    - --port=8080
  ports:
    - "127.0.0.1:8080:8080"
```

La etiqueta fija en `v0.60.6` es la misma regla que apliqué a toda la pila: nunca `latest`. Cuando quiera actualizar, cambio el tag y corro `docker compose pull && docker compose up -d`. Así el día que algo se rompa sé exactamente qué cambió, porque fui yo quien lo cambió.

## Segunda trampa: el precio de mirar para adentro

`privileged: true` es la línea que hace que mucha gente cierre el tutorial y se vaya a otra cosa, y con razón: un contenedor privilegiado tiene acceso casi total al host. En un servidor con datos de terceros eso sería una conversación muy distinta.

En mi caso el cálculo es explícito y lo dejo escrito: esta máquina es mi laptop personal, el contenedor corre en mi red local, no hay nada que ofrecer a internet y el puerto está atado a loopback. Aun así, el privilegio está acotado por los montajes: todo lo que cAdvisor necesita leer entra como `:ro`. Puede ver el sistema de archivos, el runtime de Docker y el estado del disco, pero no puede escribir en ninguno.

Lo que necesita no es capricho. Para leer los cgroups reales de cada contenedor —y no solo lo que Docker dice que hay— tiene que entrar a `/sys/fs/cgroup`, y para saber qué contenedor corresponde a cada grupo consulta el socket de Docker en `/var/run`. `/dev/kmsg` es el menos obvio: ahí están los eventos del kernel, incluidos los OOM. Si algún día un contenedor muere por falta de memoria, la explicación está en ese buffer, no en el log de la aplicación.

Le puse `mem_limit: 256m` como al resto, y en la práctica no llega ni a la quinta parte: el día del montaje marcaba **41 MB** y hoy, con la pila en reposo, se queda en **33.65 MiB**, osea el 13 % de su límite. Es la pieza más barata de toda la pila y la que más me dice.

## Tercera trampa: la que no aparece en ningún tutorial

Esta es mía, y me parece la más instructiva. Si levantas cAdvisor con su configuración por defecto y lo dejas sin pensar, lo que pasa no es que falle: lo que pasa es que Prometheus se llena de basura silenciosamente. Se llama **explosión de cardinalidad** y es el error clásico de quien empieza en este mundo.

El motivo es cómo funciona Prometheus: cada serie es una combinación única de nombre de métrica más sus etiquetas. Si una métrica de memoria trae diez etiquetas, cada valor distinto en esas diez etiquetas genera una serie nueva. Docker le pone a cada contenedor un montón de etiquetas: identificador, nombre, versión de imagen, etiquetas de la imagen, etiquetas del compose. Multiplícalo por el número de contenedores y por cada métrica, y en un fin de semana el disco te está pegando el aviso.

Todo esto se resuelve con tres banderas:

```yaml
- --store_container_labels=false
- --whitelisted_container_labels=com.docker.compose.service
```

La primera apaga el volcado completo de etiquetas y la segunda deja pasar exactamente una: el nombre del servicio en el compose. Es un trueque deliberado: pierdo el detalle de la imagen y del identificador de cada contenedor, y gano un conjunto de series que cabe en un disco de casa y que se puede leer de un vistazo.

Y la tercera bandera del bloque:

```yaml
- --allow_dynamic_housekeeping=false
```

cAdvisor recolecta cada cierto tiempo y por defecto ajusta ese intervalo solo, según la carga. Suena amable, pero para un laboratorio es veneno: las series cambian de comportamiento sin que yo cambie nada, y cuando dentro de un mes compare dos gráficas no voy a saber si la diferencia es del sistema o del recolector. Prefiero lo predecible.

## Alinear los relojes

El detalle que separa una configuración que funciona de una que se ve bien:

```yaml
- --housekeeping_interval=15s
```

y en `prometheus.yml`:

```yaml
scrape_interval: 15s
```

Las dos piezas tienen que respirar al mismo ritmo. Si cAdvisor recalcula cada 15 segundos y Prometheus pregunta cada 10, una de cada tres consultas recibe el mismo dato repetido —y en Prometheus un mismo valor repetido no es un error, es una serie plana, que es peor porque se ve normal. Si es al revés, Prometheus se pierde muestras y los picos se aplanan justo donde importan.

Se puede sobrevivir con ritmos desalineados, pero no hay razón para hacerlo, y cuando alguien te pregunta por qué las gráficas "se ven raras" a veces, esta es la primera cosa que hay que revisar.

## El panel: agrupar por servicio, no por nombre

Al armar el panel de contenedores estaba la instrucción obvia de Grafana: agrupar por `name`. Funciona, y es la trampa. La etiqueta `name` llega desde Docker con el nombre del contenedor tal cual, y para mis contenedores eso es `obs-grafana`, `obs-cadvisor`. En cambio el servicio del compose es `grafana`, `cadvisor`, y si algún día cambio el nombre de una instancia —o levanto dos con nombres distintos— el servicio sigue siendo el mismo.

Lo que uso entonces:

```promql
sum by (container_label_com_docker_compose_service) (container_memory_working_set_bytes)
```

El nombre de la etiqueta es horrible, y no hay manera de evitarlo: `container_label_` es el prefijo fijo y lo que sigue es la etiqueta original con los puntos y guiones convertidos en guiones bajos. Se vuelve a `com_docker_compose_service`. Es feo y es estable.

Y la métrica también es una decisión. Existen `container_memory_usage_bytes` y `container_memory_working_set_bytes`, y la diferencia no es cosmética: la primera incluye la caché de páginas, que el kernel puede reclamar cuando hace falta. La segunda descuenta lo reclamable y se acerca a lo que el contenedor realmente necesita. Si estoy vigilando límites de memoria, quiero el working set; usar la otra me daría un número que se infla solo y me haría subir límites que no hacían falta. Esto, por cierto, explica buena parte de la sorpresa de la entrega anterior con Grafana: la mitad de esos 511 MB era caché de SQLite contándole a su propio cgroup.

## Lo que cAdvisor no es

Vale la pena decirlo porque es donde se confunde todo: cAdvisor es infraestructura. Te dice cuánto CPU y cuánta RAM consume cada contenedor, cuántos bytes pasaron por su interfaz de red y cuánto escribió en disco. No te dice cuántas llamadas se completaron, ni cuántos registros SIP fallaron, ni cuántos usuarios nuevos entraron hoy.

Esa otra parte la cuenta la aplicación. Y ahí hay un cruce directo con lo que hago en el trabajo: en los clústeres de OpenShift donde corren nuestras aplicaciones IMS, el consumo de recursos y el estado de los pods vienen de generadores distintos al de las métricas del servicio. Son tres cosas separadas y conviene nombrarlas, porque cada una falla distinto:

El kubelet y cAdvisor cuentan la infraestructura —las series `container_*` de siempre—. `kube-state-metrics` cuenta los objetos de Kubernetes: si el pod está pendiente, si el deployment tiene réplicas disponibles. Y los contadores de negocio los expone la propia aplicación: en un Kamailio, los registros exitosos y las llamadas activas salen de sus módulos, no de un agente externo que mira el sistema operativo.

De ahí sale una lección que me costó entender en el trabajo y que ahora veo clarísima desde casa: en un clúster las métricas de una aplicación no se sacan "instalando un agente". Se declara un `ServiceMonitor` o un `PodMonitor`, que exige habilitar las cargas de trabajo del usuario en la configuración del clúster y un puerto con nombre en el servicio. Si la aplicación no expone nada, ningún recolector lo inventa.

## Lo que cambió al ponerlo a trabajar

Antes de este tablero, mi lectura del laboratorio era una fotografía: `docker stats` en el momento en que se me ocurre mirar. Ahora es una película: sé que Grafana subió de forma escalonada durante la primera tarde mientras construía índices, y sé que mis otros tres contenedores ni se movieron.

La foto de hoy, con la pila ya en reposo después de doce días apagada, dice esto:

```
NAME                CPU %     MEM USAGE / LIMIT     MEM %
obs-grafana         1.09%     285.3MiB / 700MiB     40.76%
obs-cadvisor        0.00%      33.65MiB / 256MiB    13.15%
obs-prometheus      0.47%      57.93MiB / 512MiB    11.31%
obs-node-exporter   1.74%       9.39MiB / 128MiB     7.33%
```

Y aquí hay una corrección que me debo a mí mismo, porque en la entrega anterior escribí que mi límite de Grafana se había quedado corto. **No se había quedado corto: estaba viendo el peor momento.** Aquel 511.5 MB era el arranque en frío, con la base SQLite construyendo índices. En reposo, Grafana vive en 285 MB, osea el 40 % de su límite. La decisión de subirlo de 512 a 700 sigue siendo correcta, pero por otra razón: no porque el servicio lo necesite todo el tiempo, sino porque un pico de arranque con el límite justo lo habría matado en el momento más inoportuno.

El total de los cuatro contenedores hoy es de **386 MiB**, contra los 572 MB que medí el día del montaje. Dos cifras, el mismo sistema, y la diferencia no es una mejora: es que una la tomé con el laboratorio caliente y la otra en reposo. Esto es exactamente lo que un tablero de series temporales resuelve y una captura de `docker stats` no puede resolver, y me parece la mejor justificación de todo este proyecto.

Ese es el verdadero intercambio, y no es que cAdvisor mida mejor que `docker stats` —están leyendo el mismo cgroup— sino que uno guarda y el otro no. `docker stats` te dice "ahorita". cAdvisor más Prometheus te dice "desde cuándo y a qué hora empezó", que es la única pregunta que sirve cuando algo se degrada sin romperse.

## Qué sigue

Con la máquina y los contenedores cubiertos, queda el hueco más interesante: las métricas que nadie expone. Hay cosas que quiero medir y que no están en ningún cgroup ni en ningún sistema operativo: cuánta memoria ocupa cada instancia del bot que corre 24/7 en esta laptop, y si las llamadas SIP de mi sonda de salud se están cayendo más que ayer.

Para eso el camino no es otro agente pesado, es el **textfile collector** de `node-exporter`: el recolector más viejo de la pila, que ya está montado, puede publicar métricas de cualquier script que escriba un archivo con formato Prometheus en la carpeta correcta. Eso es la entrega 4, y es donde este laboratorio deja de mirar la computadora y empieza a mirar mis propios sistemas.
