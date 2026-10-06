---
title: "Quién cuenta las llamadas: los contadores de un IMS sobre Kubernetes no los genera el clúster"
pubDate: "2026-10-06"
description: "El pod está arriba, pero eso no dice cuántas llamadas entraron. Tres generadores distintos, tres dueños distintos: kubelet, kube-state-metrics y la aplicación. Dónde se configura cada uno y qué adaptador se usa en cada caso."
categories: [technical]
---

Hay una pregunta que suena a trivia y define si un tablero sirve o solo se ve bonito: **¿quién genera el contador?**

En la entrega anterior de esta serie dejé una conclusión a medias: cAdvisor mide el contenedor como caja negra. Ahora toca el otro lado, el que de verdad mueve el negocio. Porque en un IMS sobre Kubernetes —ese donde viven los módulos que registran usuarios y enrutan llamadas— el pod puede estar arriba, con su CPU y su memoria impecables en el tablero, y aun así no haber procesado un solo registro. Y ningún exporter de infraestructura te va a decir eso.

## Tres generadores, tres dueños

Lo primero es separar lo que en el día a día se ve como una sola cosa. En un despliegue de Kubernetes hay tres fuentes de métricas que no tienen nada que ver entre sí:

```
   ┌───────────────────────────────────────────────────────────┐
   │ 1. LA INFRAESTRUCTURA        ¿cuánta RAM gasta el pod?     │
   │    kubelet (cAdvisor)     →  container_*                   │
   ├───────────────────────────────────────────────────────────┤
   │ 2. EL OBJETO DE K8S          ¿está listo?, ¿cuántas        │
   │    kube-state-metrics     →  réplicas?, ¿reinició?         │
   ├───────────────────────────────────────────────────────────┤
   │ 3. EL NEGOCIO                ¿cuántos registros exitosos?, │
   │    la aplicación          →  ¿cuántos diálogos activos?    │
   └───────────────────────────────────────────────────────────┘
                     │                        │
                     └──── Prometheus ────────┘
                              │
                           Grafana
```

**El kubelet y cAdvisor** producen las series `container_*`. Nadie las configura: existen por el solo hecho de que el pod exista. Es la capa más barata y la más universal.

**kube-state-metrics** lee la API de Kubernetes y traduce el estado de los objetos: reinicios, réplicas listas, fase del pod, límites. Tampoco lo configura la aplicación.

**La aplicación** produce lo único que a nadie más le consta. Y esa es la frase que quiero dejar clara antes de seguir: el kernel no sabe que hubo un registro; sabe que un socket recibió bytes. Si un registro de usuario salió bien, eso lo sabe el proceso que atendió el mensaje, porque fue él quien incrementó el número.

## Los contadores nacen en el código, no en el manifiesto

Un contador de negocio es, literalmente, un entero en la memoria del proceso que el código incrementa cuando pasa algo. Por eso no aparece en el `Deployment`, ni en el `Service`, ni en ninguna anotación de Kubernetes: no hay forma de declararlo desde afuera.

Lo que sí se configura —y aquí está la confusión típica— es su **exportación**. El contador ya existe; lo que hay que decidir es cómo sale de la memoria del proceso y llega a Prometheus. Y esa configuración vive en el archivo de configuración de la aplicación, que en Kubernetes suele ser un `ConfigMap`.

La consecuencia práctica es incómoda y conviene decirla de frente: **si la aplicación no expone sus contadores, no existe forma de inventarlos desde la infraestructura.** Se puede medir que el pod usa 12% de CPU; no se puede deducir de ahí cuántas llamadas cursó. Cualquier tablero que pretenda lo contrario está adivinando.

## El caso concreto: un servidor SIP que ya sabía contar

El ejemplo que me tocó ver es un servidor SIP de código abierto sobre Kubernetes. Y tiene una ventaja: **el framework de estadísticas internas ya existía** mucho antes de que existiera Prometheus. Se consulta con `kamctl stats` o por RPC, y viene agrupado por módulo —`core`, `sl`, `tm`, `dialog`, `registrar`, `usrloc`— porque cada módulo cuenta lo suyo: transacciones activas, diálogos abiertos, registros aceptados, códigos de respuesta.

Lo que se agregó después fue el módulo que las exporta. La configuración es de cuatro líneas:

```
loadmodule "xhttp_prom.so"

# Sin esta línea NO se expone ninguna estadística interna:
# el valor por defecto es "" (nada)
modparam("xhttp_prom", "xhttp_prom_stats", "all")

event_route[xhttp:request] {
    if (prom_check_uri())
        prom_dispatch();
}
```

Con eso, el mismo proceso que atiende llamadas empieza a responder `GET /metrics` en texto plano. La documentación del módulo es explícita: genera métricas adecuadas para una plataforma de monitoreo Prometheus y atiende las peticiones *pull* a la URL `/metrics`.

Cuatro detalles que conviene saber antes de tocar esto en producción:

- **El valor por defecto es vacío.** `xhttp_prom_stats` arranca en `""`, es decir sin exponer nada. Puedes pedir `all`, un grupo completo (`"sl:"`) o una sola estadística por su nombre, que el módulo encuentra el grupo solo.
- **Los nombres se limpian.** Las estadísticas internas se parsean para convertir guiones en guiones bajos y así cumplir las reglas de nombres de Prometheus; el prefijo de todas las métricas es configurable y por defecto es `kamailio_`.
- **Las estadísticas internas salen sin tipo.** El módulo no les agrega la línea `# TYPE`, a diferencia de las métricas que defines tú. Sirve para leerlas, pero hay que recordar que son contadores.
- **Las métricas propias sí llevan etiquetas.** Además de las internas, puedes declarar contadores, gauges e histogramas propios (`prom_counter`, `prom_gauge`, `prom_histogram`) y darles etiquetas; esas métricas se borran si nadie las consulta en un tiempo configurable, que por defecto es de 60 minutos.

Existe también el camino inverso: el proceso empuja sus números por UDP a un colector compatible con statsd. Es la misma información tomando otro camino, y en un rato vuelvo a él, porque define un tipo distinto de adaptador.

## El adaptador en Kubernetes no es un agente: es un CRD

Aquí está la parte que más sorprende a quien viene de la monitorización tradicional. En Kubernetes **no se instala un agente por pod** ni se mete un sidecar que recoja los números. Lo que se declara es cómo encontrarlos: un objeto `ServiceMonitor` (o `PodMonitor`) del Prometheus Operator que dice "este servicio, en este puerto con nombre, sirve `/metrics`".

Los requisitos son tres: un puerto con nombre en el `Service`, el CRD apuntando a ese puerto con su ruta, y —en OpenShift— el monitoreo de proyectos de usuario habilitado, porque el Prometheus que raspa las aplicaciones no es el de la plataforma. Sin eso, el `ServiceMonitor` se crea y no pasa nada: no hay error, simplemente no hay series. Es un fallo silencioso clásico.

Y hay un detalle que decide si tus tableros sirven para algo: **el rol del pod no viene del contador, viene de las etiquetas que Prometheus le pone al target**. Cuando Prometheus descubre un pod, le agrega `pod`, `namespace`, `service` y compañía. Así que "llamadas por función de red" es una decisión de configuración —etiquetas y agrupación del lado de Prometheus—, no algo que la aplicación tenga que reportar.

## Qué adaptador se usa, según el caso

No hay uno solo, y la elección la dicta una pregunta simple: **¿el proceso puede exponer sus propios números?**

- **Puede, y es una aplicación moderna: exporter nativo más `ServiceMonitor`.** Es el camino dominante en Kubernetes y cada vez el único que se acepta. Sin piezas extra.
- **No puede, pero habla SNMP: `snmp_exporter` con sus MIBs.** Es el más usado en telecomunicaciones, y no por elegancia sino por realidad: buena parte de la red solo expone SNMP, y ahí vive el contador de la interfaz que nunca va a tener un `/metrics`.
- **No puede, pero tiene CLI o RPC: un exporter puente hecho a medida.** Un proceso pequeño que consulta y republica en formato Prometheus. Es la ruta que la gente descubre después de dar vueltas buscando uno que ya exista.
- **Empuja en vez de exponerse: `statsd_exporter`.** La aplicación manda datagramas a un colector y el puente los convierte en series. El patrón *push*, útil cuando no quieres abrir un puerto HTTP en un proceso de señalización.
- **Para disponibilidad: `blackbox_exporter`.** Sondea desde afuera y responde "¿este vecino contesta?". No cuenta llamadas.
- **Para el objeto de Kubernetes: `kube-state-metrics`.** Ya lo presenté arriba; no es de la aplicación.
- **Cuando hay demasiadas fuentes: `OpenTelemetry Collector`** como concentrador y punto único de salida.
- **Para la llamada misma, captura y no contadores.** Un sistema de captura de señalización por HEP sigue siendo el estándar para diagnóstico extremo a extremo: no te dice cuántas llamadas hubo, te dice qué pasó en una.

Y queda una fuente que no es bonita pero que en un operador real pesa más que todas las anteriores: **el EMS del fabricante**. Lo que no se puede instrumentar sigue reportándose ahí, y eso deja a cualquier operador viviendo en dos mundos —Prometheus para lo cloud-native, el EMS para el legado— con el trabajo de armonización que ya conocemos.

## Tres trampas que muerden exactamente en este escenario

**Los contadores son por pod.** Si el mismo módulo corre en cinco réplicas, hay cinco contadores, y cada uno cuenta su parte. La cifra que te interesa no es la de un pod: es la suma.

```promql
sum by (service) (
  rate(kamailio_<grupo>_<estadistica>[5m])
)
```

**Los contadores se reinician.** Cada reinicio del pod —y en Kubernetes los pods se reinician por razones que no tienen que ver con la aplicación— devuelve el contador a cero. Sumar el valor crudo de un contador miente después del primer reinicio; por eso se usan `rate()` e `increase()`, que saben reconocer el salto y no lo confunden con tráfico negativo.

**El KPI no es un contador.** La tasa de llamadas completadas, la de registros exitosos o las llamadas por segundo no existen en ningún exporter: se derivan cruzando contadores en PromQL. Confundir "contador exportado" con "indicador de negocio" es lo que produce tableros que parecen correctos y no lo están.

## La regla, ahora completa

La infraestructura la mide el kubelet, el objeto lo mide kube-state-metrics y el negocio lo mide la aplicación. Cada quien mide lo suyo, y ninguno puede medir lo del otro.

Esa es la razón de fondo por la que un despliegue de Kubernetes bien monitoreado termina con dos Prometheus, tres familias de series y una aplicación configurada aparte. No es desorden ni exceso de ingeniería: es que son problemas distintos, con dueños distintos y con archivos de configuración distintos.

La próxima vez que un tablero no muestre lo que esperabas, la primera pregunta no es "¿qué consulta está mal?". Es "¿quién iba a generar ese número, y alguien le dijo cómo publicarlo?".

## Nota metodológica

Todo lo específico del servidor SIP proviene de la documentación pública del proyecto, no de ninguna red real: el módulo de exportación, el valor por defecto `""` del parámetro de estadísticas, la limpieza de guiones en los nombres, la ausencia de metadata de tipo en las estadísticas internas y el borrado de métricas propias tras el tiempo de espera configurable están documentados por los propios autores del módulo. Nada aquí describe una topología, una configuración ni una cifra de ningún operador.

- Módulo de exportación a Prometheus del servidor SIP — <https://www.kamailio.org/docs/modules/stable/modules/xhttp_prom.html>
- Módulo de salida hacia un colector compatible con statsd — <https://www.kamailio.org/docs/modules/stable/modules/statsd.html>
- Monitoreo de proyectos definidos por el usuario en OpenShift — <https://docs.openshift.com/container-platform/4.17/monitoring/enabling-monitoring-for-user-defined-projects.html>
- `snmp_exporter` — <https://github.com/prometheus/snmp_exporter>
- `statsd_exporter` — <https://github.com/prometheus/statsd_exporter>
- `blackbox_exporter` — <https://github.com/prometheus/blackbox_exporter>
- `kube-state-metrics` — <https://github.com/kubernetes/kube-state-metrics>
- Captura de señalización SIP (Homer/HEP) — <https://github.com/sipcapture/homer>

Esta pieza continúa la idea que dejé en [cAdvisor no es la única ruta](/blog/cadvisor-no-es-la-unica-ruta-metricas-de-contenedores-hacia-prometheus/): si el contenedor se mide con el kubelet, las llamadas se miden —y se configuran— en otro lado.
