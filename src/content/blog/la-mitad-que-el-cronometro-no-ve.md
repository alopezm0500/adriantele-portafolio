---
title: "La mitad que el cronómetro no ve: cómo se atribuye la causa de una llamada que tarda"
pubDate: "2026-10-12T09:00:00"
description: "Ookla mide cuánto tarda una llamada; lo que no puede medir es por qué tarda. La distancia entre la mediana y la cola de un operador se explica en el core: paging, señalización, portadores y temporizadores de retransmisión."
categories: [technical]
---

En la [primera parte de esta serie](/blog/tu-llamada-no-entra-mas-rapido-en-5g/) quedó el dato incómodo: en pruebas controladas sobre ocho mercados, la voz sobre 5G conecta en 1.96 segundos de mediana y la voz sobre 4G en 1.87. Y quedó una pregunta abierta que ningún cronómetro externo puede responder: cómo un operador puede tener 1.82 segundos de mediana y 6.33 segundos en su percentil 95, como Starhub en Singapur.

Esa pregunta no se contesta midiendo más. Se contesta mirando la llamada por dentro.

## Qué mide exactamente un cronómetro de voz

De presionar “llamar” a escuchar el tono de retorno. Nada más, y nada menos. Ese intervalo contiene cosas que el usuario nunca ve y que ocurren, literalmente, en dos redes distintas: la de quien llama y la de quien recibe.

Ahí está el primer malentendido comercial del tema: cuando un cliente dice “mi operador tarda en marcar”, muchas veces está pagando el tiempo de alguien más. Si la persona que recibe está con el teléfono en modo reposo, con mala cobertura o con el IMS en un estado incómodo, el retardo suma al tuyo. Un tiempo de establecimiento medido de extremo a extremo siempre es, en el mejor de los casos, **el peor de los dos tramos**.

## Cuatro relojes dentro de una sola llamada

Vale la pena desarmar el intervalo. En una llamada de voz sobre IP hay al menos cuatro relojes sumándose en serie.

### 1. El reloj de la radio

Si el teléfono está en reposo, antes de cualquier cosa hay que despertarlo. La red no sabe dónde está el equipo dentro de la celda: sabe en qué grupo de recursos buscar. El terminal escucha el canal de paginación en instantes concretos, definidos por el ciclo de recepción discontinua que la red configuró. Eso significa que hay un retardo inevitable —de fracción de segundo, y de hasta un ciclo completo si la paginación se repite— antes de que el equipo siquiera se entere de que alguien lo está llamando.

Después viene el establecimiento de la conexión de radio: el equipo pide acceso por el canal de acceso aleatorio, resuelve la contención si dos equipos intentaron al mismo tiempo, negocia seguridad y configura portadores. Y solo entonces puede mandar el mensaje de solicitud de servicio hacia el core.

### 2. El reloj del IMS

Aquí vive la parte que decide la mayor parte de las llamadas lentas, y la que menos se discute en las presentaciones.

El equipo tiene que estar registrado en el subsistema multimedia: si su registro está caído, vencido o en proceso de renovación, la llamada puede arrastrar primero un ciclo de registro. Una vez dentro, la petición de llamada recorre el proxy de entrada, el servidor de control de sesión y el servidor de aplicación que aplica los servicios de voz, y de ahí cruza —si se trata de otra red— por los nodos de interconexión con traducción de medios incluida, para llegar a la red que va a hacer sonar el teléfono destino. Todo eso ocurre antes de que se escuche un solo timbre.

La señalización viaja, en la mayoría de los despliegues reales, sobre datagramas sin conexión. Y ese detalle, que parece menor, es el que fabrica las colas.

### 3. El reloj del portador dedicado

La voz no viaja por el mismo camino que los datos. Necesita un portador dedicado, con una clase de servicio específica (la clase conversacional, con su equivalente en 5G), que la red debe reservar y autorizar, normalmente en coordinación con el nodo que aplica las políticas y con el nodo de la función de plano de usuario que marca el tráfico.

En los despliegues que usan precondiciones —el mecanismo estándar que impide que se empiece a tocar la campana antes de que la red confirme que puede sostener la voz—, el tono de retorno espera a que ese portador esté establecido. Es un intercambio de minutos escrito en milisegundos: la red confirma recurso, el equipo confirma, y solo entonces suena.

### 4. El reloj del cambio de red

Y está el reloj que más caro sale, porque no depende de la señalización sino de dónde está parado el equipo. Si el teléfono está acampado en la capa de 5G y la voz no es nativa ahí, antes de completar la llamada hay que bajarlo a 4G. Ese es el fallback que en Manila le cuesta a DITO una mediana de 4.59 segundos con 89% de sus llamadas de voz pasando por ese mecanismo, como vimos en la primera parte.

Cuando la caída es a 2G o 3G —CSFB—, el teléfono tiene que sintonizar otras frecuencias, registrarse en el core de circuitos, establecer el portador de voz y entonces sí señalizar. Cada paso es un peaje. De ahí la mediana de 4.48 segundos y el 5.5% de llamadas arriba de los 10 segundos que reporta el estudio.

## La cola no es cobertura

Aquí está el malentendido que más veces he escuchado: atribuir las llamadas lentas a “problemas de cobertura”. La cobertura puede ser la causa en el borde de celda, y sin duda explica una parte. Pero la mayor parte de la cola —esa que hace que el p95 sea de 6.33 segundos mientras la mediana es de 1.82— no viene del radio. Viene de la señalización aplicada con el temporizador equivocado.

Cualquiera que haya mirado una captura de llamadas lo sabe: cuando un mensaje se pierde, el protocolo no lo adivina, lo reintenta. La pila de señalización del IMS usa la retransmisión con temporizador definida por el estándar clásico de SIP: un primer reintento a los 500 milisegundos, después uno al segundo, otro a los dos segundos, otro a los cuatro, y de ahí en adelante al mismo ritmo hasta un límite superior. Una sola pérdida en el momento correcto —una petición que sale, una confirmación que no llega, un mensaje que se queda atrás— se convierte en 500 milisegundos agregados. Dos pérdidas: 1.5 segundos. Tres: 3.5 segundos.

Ahí está la explicación de por qué la mediana puede ser buena y la cola espantosa: **la mediana describe la mayoría de las llamadas, que no pierde nada, y la cola describe las que tuvieron una pérdida en el peor lugar de la secuencia**. Un diseño con intermedios de enrutamiento, con nodos que reinician la numeración de secuencia, con reglas de política que no coinciden entre sí, tiene más lugares donde perder ese mensaje.

Eso no se arregla con más espectro, ni con más cobertura, ni con una generación nueva de radio. Se arregla tocando la señalización, y para tocarla primero hay que poder medirla con la pregunta correcta.

## Mediana, percentil y tasa: los tres números

De todo lo anterior se desprende una forma de leer el desempeño que no coincide con la que se usa en las presentaciones:

- **La mediana** dice cómo va el usuario típico.
- **El percentil 95** dice cómo va el usuario que va a llamar a la operadora.
- **La tasa de cumplimiento** —el porcentaje de llamadas dentro del umbral percibido como instantáneo— es el único número que se parece a la experiencia. Y aquí hay un ejemplo incómodo en los datos: un operador con 1.82 segundos de mediana y 57% de cumplimiento ofrece peor experiencia repetida que otro con una mediana apenas peor y 95% de cumplimiento. El usuario no promedia: recuerda el día en que tardó seis segundos.

Por eso los promedios de voz engañan en las dos direcciones: hacen ver bien a las redes con colas largas y ocultan a las que ganan por consistencia.

## Síntoma contra causa: la parte que se aprende desde dentro

Un cronómetro externo entrega lo que podría llamarse el síntoma: cuánto tardó. La atribución —quién lo provocó— es otro oficio, y requiere instrumentos que solo están del lado del operador: capturas de señalización en los nodos, registros de llamada, contadores por interfaz.

La regla práctica es incómoda al principio y liberadora después: **el error visible casi nunca está en donde ocurrió el problema**.

- Un **408** (petición agotada) no significa que el otro extremo esté mal: significa que alguien se cansó de esperar. El nodo que lo emite es el que tenía el temporizador, no necesariamente el culpable.
- Un **487** (petición terminada) normalmente es consecuencia: alguien canceló porque ya se había dado por vencido antes.
- Y una llamada que “nunca se estableció” puede haber muerto en el segundo salto de una cadena de cuatro, con el registro limpio en el primero.

La consecuencia metodológica es que no se puede contar mensajes. Hay que reconstruir cada llamada por su identificador de diálogo, deduplicar las retransmisiones —el mismo mensaje repetido no es un problema nuevo, es el mismo problema insistiendo— y atribuir la falla al nodo donde se originó la causa, no al que la reportó. Ese ejercicio, hecho con disciplina sobre capturas cortas, cambia por completo el mapa: deja de haber un operador lento y empieza a haber tres nodos responsables de la mayoría de los casos, con su tasa de falla por función y por hora.

Ese es el trabajo que en general nadie quiere hacer. Medir medianas es fácil y se ve bien en un tablero. Atribuir causas obliga a leer mensajes uno por uno.

## Por qué la generación nueva no arregla la disciplina

Vuelvo al dato central de la primera parte porque aquí se entiende mejor.

El caso de M1 en Singapur es el ejemplo perfecto de lo que **no** hay que hacer: aparecer con 3.62 segundos de mediana en VoNR y presentarlo como una mejora de 43.5%, cuando la línea base de VoLTE medía 6.41 segundos. La tecnología nueva no curó nada: movió el problema de capa. Y las colas extremas de ese mismo despliegue —reglas de política incompletas, cobertura insuficiente, cuellos de botella de señalización— siguen ahí, visibles para quien mide percentiles y no promedios.

Lo mismo, en menor escala, con Starhub (32% más lento en VoNR que en su propio VoLTE) y KT (13% más lento). Los tres casos comparten un patrón: se cambió la tecnología de acceso sin haber terminado de resolver el paging, la política y la cobertura donde la llamada en realidad se decide.

Lo que VoNR sí aporta es real y está documentado: mejor calidad de audio con códecs de banda extendida, control de calidad de servicio más fino, y voz priorizada de forma nativa dentro del marco 5G. Pero nada de eso toca los temporizadores de retransmisión, ni el ciclo de paginación, ni la coherencia de las reglas de política entre nodos. La generación cambia el camino; la disciplina cambia el tiempo.

## Qué se optimiza de verdad

Sin entrar en configuraciones —eso depende de cada red— la lista de lo que mueve la aguja en el establecimiento de llamada es corta y poco glamorosa:

- **Paginación y ciclo de reposo.** Cuánto tarda la red en encontrar al equipo dormido es el primer componente del tiempo, y es ajustable.
- **Estado de registro en el IMS.** Un registro robusto y renovado a tiempo evita el peor escenario: que la llamada arrastre un registro completo antes de empezar.
- **Establecimiento del portador dedicado.** Cada intercambio entre el control de políticas y las funciones de usuario que se puede eliminar de la ruta crítica son décimas que se ganan en todas las llamadas.
- **Umbrales de cambio de red.** Un fallback que se dispara antes de tiempo cuesta segundos; uno que se dispara tarde cuesta llamadas caídas. Ese equilibrio es decisión de operación, no de tecnología.
- **Dimensionamiento del plano de señalización.** Los cuellos de botella de señalización no aparecen en la hora tranquila: aparecen en la hora del partido, que es exactamente cuando la cola se engorda.
- **Y medir con la pregunta correcta:** tasa de cumplimiento y percentiles por nodo de origen, no promedio de la red.

Nada de eso se compra. Todo eso se opera.

## Cierre

En el fondo, la voz es el servicio más viejo del negocio y el que menos tolerancia tiene: nadie negocia con un tono de retorno que no llega. Pero su desempeño se sigue discutiendo con el instrumento más pobre posible, que es un cronómetro sin acceso al interior.

La conclusión que me deja el estudio de Ookla no es que VoNR sea malo. Es que la medición externa hace visible un problema que la medición interna puede explicar, y que la distancia entre las dos es el espacio donde vive la calidad percibida. El mejor dato de todo el estudio —una red 4G en Seúl conectando en 0.73 segundos— no es la prueba de que una tecnología vieja sea mejor. Es la prueba de lo que vale una década de mirar mensajes uno por uno.

## Fuentes

- Ookla, 6 de octubre de 2026: [The 5G Voice Paradox: Why VoNR Isn't Always Better (Yet)](https://www.ookla.com/articles/5g-voice-call-setup-times). Casos de Starhub, KT, M1, Singtel, Boost Mobile y DITO; tiempos de CSFB y de fallback.
- RFC 3261, [SIP: Session Initiation Protocol](https://www.rfc-editor.org/rfc/rfc3261): retransmisión sobre transporte no confiable y temporizadores (T1 de 500 milisegundos por defecto, con duplicación sucesiva, y el límite superior de 4 segundos).
- RFC 3312, [Integration of Resource Management and Session Initiation Protocol](https://www.rfc-editor.org/rfc/rfc3312): precondiciones y el mecanismo que impide alertar al usuario antes de que el recurso esté reservado.
- GSM Association, [IR.92: IMS Profile for Voice and SMS](https://www.gsma.com/newsroom/all-documents/ir-92-ims-profile-for-voice-and-sms-v-13-0/): perfil de referencia para la voz sobre IMS en dispositivos.
- Especificaciones 3GPP aplicables, disponibles en su catálogo público: TS 23.228 (IMS, etapa 2), TS 24.229 (protocolo de control de llamada basado en SIP), TS 36.304 (procedimientos del equipo en modo reposo, paginación), TS 23.501 (arquitectura del sistema 5G y clases de calidad de servicio) y TS 23.216 (continuidad de voz de radio única).

**Nota metodológica.** Los tiempos de establecimiento, percentiles y tasas de cumplimiento provienen del estudio de Ookla citado y son datos de un tercero, replicados con atribución; no son mediciones propias ni provienen de ninguna red de la que tenga información interna. La descripción de los mecanismos —paginación, establecimiento de conexión de radio, registro en el IMS, cadena de señalización, portador dedicado con precondiciones, fallback entre generaciones y temporizadores de retransmisión— se apoya en los estándares públicos listados arriba y en práctica general de operación, y se mantiene deliberadamente genérica: no incluye configuraciones, topologías, identificadores de nodo ni cifras de ninguna red real. El cálculo de pérdidas acumuladas por retransmisión (500 ms, 1.5 s, 3.5 s) es una ilustración del comportamiento del temporizador definido en RFC 3261 y no un dato medido en los despliegues del estudio.
