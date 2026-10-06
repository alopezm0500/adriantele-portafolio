---
title: "Laboratorio de observabilidad en casa (2): el arranque, los tres tropiezos y el primer tablero"
pubDate: "2026-10-06"
description: "La pila quedó encendida el mismo día. Lo difícil no fue Prometheus ni Grafana: fue el plugin de compose que no estaba, el grupo de Docker que nunca me agregaron y un archivo .env que faltaba. Aquí está el arranque completo, con las salidas reales y la lectura del primer tablero."
categories: [technical]
---

Pensé que esto iba a ser mucho más complicado. La parte de Prometheus y Grafana fue casi anticlimática: los archivos estaban escritos, las imágenes bajaron, el servicio levantó. Lo que me costó veinte minutos no fue la observabilidad, fue **la plomería**.

Me parece importante escribirlo así, porque el tropiezo es lo único que no aparece en los manuales: los manuales te enseñan el `docker compose up -d` que funciona, no el que te escupe `unknown shorthand flag: 'd' in -d` y te deja pensando que escribiste mal el comando.

Esta entrega es el arranque real, con sus tres piedras y con las salidas del laboratorio en marcha.

## Tropiezo 1: el comando que no existe

```
$ docker compose up -d
unknown shorthand flag: 'd' in -d

Usage:  docker [OPTIONS] COMMAND [ARG...]
Run 'docker --help' for more information
```

El mensaje apunta al lugar equivocado. Uno lee "shorthand flag 'd'" y revisa su propia línea: ¿será un guion de más, será el espacio, será que `-d` ya no se usa? Nada de eso. Lo que pasa es que **el plugin `docker compose` (v2) no estaba instalado**, el CLI no reconoció `compose` como comando, y terminó intentando interpretar `-d` como una bandera suya. Reproducido en el bastión, la versión honesta del error es:

```
docker: unknown command: docker compose
```

Al diagnóstico llegué por partes, y en este orden:

- `docker --version` → Docker 29.1.3, del paquete `docker.io` de Ubuntu 24.04. La versión está bien.
- `docker compose version` → no existe el comando. Aquí se acaba la duda.
- `ls /usr/libexec/docker/cli-plugins` → había un solo plugin, `docker-trust`. Nada de compose.

Y la trampa estaba a un renglón de ahí: `docker-compose --version` sí respondía, con **1.29.2**. Es el compose antiguo, el escrito en Python, que Ubuntu todavía empaqueta como dependencia de otras cosas. Ver un `docker-compose` funcionando hace pensar que "ya está instalado" y que el problema es otra cosa. No: el legacy y el plugin v2 son dos binarios distintos, y el CLI moderno no los confunde.

## Tropiezo 2: el grupo que nunca me agregaron

El arranque habría fallado igual, un paso después, con un `permission denied` sobre `/var/run/docker.sock`. El demonio está corriendo y el grupo `docker` existe, pero estaba **vacío**: mi usuario nunca fue agregado. Es la configuración por defecto, y es la razón por la que en el bastión cualquier comando de Docker pedía `sudo`.

Aquí conviene decir en voz alta lo que ese grupo significa, porque es la lámina que nunca viene en el tutorial: pertenecer a `docker` equivale a tener root. Quien pueda hablarle al socket puede montar el sistema de archivos del host dentro de un contenedor y escribir donde quiera. No es un detalle de comodidad —"así no escribo sudo"— es una decisión de seguridad, y por eso la tomé a conciencia y no de reflejo.

## Tropiezo 3: el `.env` que faltaba

Este lo tenía previsto y por eso no dolió: en la carpeta estaba `.env.example`, no `.env`. El `compose.yaml` está escrito para detenerse ahí:

```yaml
GF_SECURITY_ADMIN_PASSWORD: ${GF_ADMIN_PASSWORD:?define GF_ADMIN_PASSWORD en el archivo .env}
```

Ese `:?` es deliberado: si la variable no existe, el arranque **falla** en vez de levantar un Grafana con usuario `admin` y contraseña `admin`. Prefiero un error ruidoso a un panel de control con credenciales que todo el mundo conoce. La contraseña quedó en `.env`, con permisos `600`, fuera de cualquier control de versiones.

## Las tres correcciones

```bash
cd ~/lab-observabilidad
cp .env.example .env && nano .env && chmod 600 .env   # la contraseña de Grafana

sudo apt install -y docker-compose-v2                  # 2.40.3, del repo de Ubuntu
sudo usermod -aG docker watcher

newgrp docker          # o cerrar sesión y volver a entrar
docker compose version
docker compose up -d
```

Dos decisiones detrás de esos comandos. Instalé el plugin **desde el repositorio de Ubuntu** y no bajando el binario de un release de GitHub: es una pieza que va a hablar con el socket del sistema y prefiero que venga firmada y actualizable por el gestor de paquetes.

Y el `newgrp` tiene su propio detalle: los grupos se asignan al **inicio de sesión**. Agregarme al grupo no cambia los procesos que ya estaban corriendo —ni mi terminal, ni los servicios—; el `newgrp docker` solo arregla esa terminal, y para el resto del escritorio hace falta cerrar sesión y volver a entrar. Es la clase de cosa que uno no sabe hasta que la vive: el grupo está bien puesto, `id` lo muestra, y el comando sigue dando `permission denied`.

## Capa por capa hasta el verde

El `verificar.sh` que escribí en la primera entrega dejó de ser teoría y se volvió la herramienta de diagnóstico del arranque. Esta es la salida real, recién encendida la pila:

```
== Capa 0 · Docker accesible ==
  [ OK ] docker responde sin sudo

== Capa 1 · Contenedores arriba ==
  [ OK ] node-exporter corriendo
  [ OK ] prometheus corriendo
  [ OK ] grafana corriendo

== Capa 2 · Endpoints HTTP ==
  [ OK ] Prometheus /-/ready
  [ OK ] Grafana /api/health

== Capa 3 · Targets de Prometheus ==
  [OK  ] job=node health=up
  [OK  ] job=prometheus health=up
  [ OK ] todos los targets en UP

== Capa 4 · Hay datos guardándose ==
  [ OK ] up{job="node"} devuelve valor: hay historia en la TSDB
  [ OK ] consulta de RAM usada devuelve datos

== Capa 5 · Grafana ve el datasource ==
  [ OK ] Grafana vivo

== Recursos usados ==
obs-grafana:        RAM 511.5MiB / 512MiB  · CPU 1.00%
obs-prometheus:     RAM  40.34MiB / 512MiB · CPU 0.76%
obs-node-exporter:  RAM   8.00MiB / 128MiB · CPU 0.00%

Resumen: 10 correctas, 0 fallidas
```

Lo que más me gusta del diseño no es que todo esté en verde: es que el script **se detiene cuando algo se rompe**. Si Docker no responde, no tiene caso preguntar por los targets; si un contenedor está caído, el problema no está en Grafana. Un "no funciona" de veinte minutos se convierte en una falla de una sola capa.

## El primer tablero, y cómo se lee

`127.0.0.1:3000` → Dashboards → Homelab → "Bastión · básico". Cuatro paneles, y estos son los valores de esta máquina en el momento de escribir:

- **RAM usada: 45.7 %**
- **Disco libre en `/`: 42.5 %**
- **Carga del sistema (1 min): 0.5**
- **Uptime: 10.9 días**

Cuatro números que parecen obvios y que no lo son, porque cada uno tiene su letra chica.

**La RAM usada no es la RAM que "sobra".** La consulta es `100 * (1 - MemAvailable / MemTotal)`, y usé `MemAvailable` a propósito: `MemFree` es más fácil de escribir y cuenta también la memoria que el kernel usa como caché de disco. En Linux, la memoria "libre" casi siempre es poca porque el sistema está aprovechando lo que nadie ocupa para acelerar el disco, y esa memoria se libera sola cuando algo la necesita. Con `MemFree` el tablero se vería alarmante y no significaría nada. Es el primer indicador con el que la gente se asusta sin razón.

**La carga no es el uso de CPU.** En una máquina de cuatro hilos como esta, un `load` de 0.5 significa que, en promedio, medio hilo tenía trabajo durante el último minuto: hay margen. Los procesos que esperan al disco también cuentan como carga, así que un `load` alto puede convivir con una CPU casi ociosa. El `load` es un indicador de presión, no de trabajo hecho.

**El uptime contextualiza todo lo demás.** 10.9 días es el alcance real de esta historia. Los contadores que terminan en `_total` —CPU, red, disco— cuentan desde el arranque, y cualquier cálculo acumulado que haga sobre ellos en las próximas entregas será exactamente de esa antigüedad. Y como 15 días es la retención que fijé, el laboratorio todavía tendrá una interrupción visible en la gráfica el día que alcance el primer borde del histórico.

**El disco es el dato con pronóstico.** 42.5 % libre hoy, con retención de 15 días y menos de 700 series guardándose. Ese número es el que voy a vigilar: es el que me va a decir si mi retención es sensata o si en tres meses tengo que bajarla.

## La sorpresa: mi propio límite se quedó corto

En la primera entrega estimé que la pila completa cabría en medio gigabyte. La salida real dice otra cosa:

```
obs-grafana:  RAM 511.5MiB / 512MiB
```

Grafana está **pegado al techo** del límite que yo mismo le puse en el `compose.yaml`. Los otros dos ni se acercan: Prometheus en 40 MB y el exporter en 8 MB. Es decir, la estimación del papel se quedó corta por un factor de tres en la pieza que menos se lo merecía.

Hay dos lecturas, y quiero dejar escritas las dos. La primera es que `docker stats` reporta la memoria del *cgroup*, que incluye la caché de páginas; Grafana escribe en una base SQLite y esa caché se le cuenta a él, así que el consumo "efectivo" puede ser menor al que muestra. La segunda es que el número importa igual, porque un contenedor cuyo consumo está clavado en su propio límite es un contenedor a un pico de distancia de que el kernel le quite páginas o lo reinicie. Un límite de memoria no es un objetivo, es un cinturón: si lo estás rozando todo el tiempo, el cinturón te queda chico.

La corrección es de un renglón en el `compose.yaml` —subir Grafana de `512m` a `768m`—, y es el tipo de ajuste que justifica todo el laboratorio: la decisión estaba escrita, la medición la contradijo, y el cambio se hace en un archivo, no en un clic perdido.

## Un detalle que envejeció por escrito

Dejo también el tropiezo menor de la verificación, porque es una lección de oficio: al pedir el estado de la base de datos a Prometheus, el comando falló con `KeyError: 'numSamples'`. En Prometheus 3.x ese campo ya no existe en la respuesta de `/api/v1/status/tsdb`. Lo que en la 2.x estaba documentado y funcionaba, en la 3.x ya no está. **Un comando que copiaste ayer puede estar muerto hoy**, y eso no es un error de quien escribe el script: es la razón por la que las cosas con versión fija se aprenden leyendo la salida y no memorizando el comando.

## Qué sigue

Ahora que hay una línea base, la entrega 3 va a donde el laboratorio se queda corto: los contenedores. `node-exporter` me da el estado de la máquina, pero no el consumo de cada servicio que corre dentro —de hecho, esos 511 MB de Grafana los vi con `docker stats`, no en el tablero—. Eso se resuelve con `cAdvisor`, y es justo el dato que necesito para vigilar mis propias decisiones de límites.

Toca entonces hacer que el laboratorio se mire a sí mismo, que es donde empieza a parecerse a la operación real.
