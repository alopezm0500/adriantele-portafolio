---
title: "La renuncia de Jacob Coxon: cuando quien construye la IA pide frenarla"
pubDate: "2026-09-14"
description: "Un investigador de Anthropic renunció y dijo en voz alta lo que la industria prefiere susurrar: que el riesgo no es teórico. El problema no es la profecía, es que seguimos actualizando antes de averiguar."
categories: [tech-en-rojo, tech-humano]
---

Hay dos formas de enterarte de que algo va mal. La primera es que te lo diga alguien de fuera, y entonces lo llamas alarmista. La segunda es que te lo diga alguien de dentro, que conoce el código, los modelos y las métricas, y entonces ya no tienes a quién culpar.

Esta semana pasó la segunda. Jacob Coxon, investigador de seguridad de Anthropic —antes en OpenAI— renunció a su puesto y lo explicó públicamente: el riesgo de que la IA termine causando daño catastrófico a la humanidad no es un ejercicio mental para conferencias. Él lo pone con fecha: antes de 2030.

## Lo que pasó, sin adornos

- Coxon renunció el 8 de septiembre de 2026 y lo hizo público.
- Dijo que el escenario de riesgo existencial no es hipotético y lo situó dentro de esta década.
- Según CNBC, le puso más de 10% de probabilidad a un desenlace de extinción.
- Lo cubrieron AP, WSJ, CNBC, CBS, Al Jazeera y Le Monde. No fue un tuit suelto.
- En paralelo, Anthropic divulgó su cuarto incidente de *hacking* con IA. En el mismo mes. En el mismo blog corporativo donde se habla de seguridad.

Pongamos eso junto en una sola frase: el mes en el que una empresa líder en seguridad de IA publica su cuarto incidente de uso malicioso de sus sistemas, uno de sus propios investigadores renuncia diciendo que el riesgo es de esta década.

## Por qué importa que venga de dentro

Cuando el mensaje llega desde afuera —un filósofo, un periodista, un regulatorio— la industria tiene una respuesta lista: "no entiende la tecnología", "está frenando la innovación", "es tecnofobia". Ese argumento se cae cuando quien habla estuvo sentado en la mesa donde se decide el *training run*.

No digo que Coxon tenga razón por el simple hecho de estar dentro. Digo algo más simple: **el desacuerdo ya no es entre expertos y alarmistas. Es entre expertos.** Y esa es la parte que la industria no sabe cómo *storytellizar*, porque no hay villano externo a quién señalar.

## El patrón: primero se actualiza, luego se averigua

Aquí está mi problema real con esta noticia, y no es el 10%.

```
1990s  software:  se prueba antes de publicar
2000s  web:       se publica y se parchea
2020s  móvil:     se publica, se mide, se decide después
2026   IA:        se publica, se mide... si hay tiempo
```

La industria de la IA no está inventando un riesgo nuevo. Está repitiendo un método viejísimo: lanzar primero y averiguar después. Lo que cambia es la escala del "después". En una app de comida ese método cuesta un bug. En un sistema que escribe código, mueve dinero, atiende clientes y ejecuta acciones por su cuenta, el "después" deja de ser un día en la oficina.

Y mientras se define qué hacer, el producto sigue avanzando. Nuevo modelo, más agentes, más permisos, más integraciones, más decisiones delegadas. El principio de precaución se aplica a todo lo demás (medicamentos, aviación, construcción) y justo en la tecnología con mayor superficie de impacto lo tratamos como una opinión.

## El detalle incómodo: el cuarto incidente

Que Anthropic —la empresa que más ha construido su marca sobre "somos los de la seguridad"— admita un cuarto incidente de *hacking* con IA debería ser el titular. Significa que los controles que hoy existen no alcanzan ni para el nivel de capacidad actual, no para el de 2027.

Si los controles llegan tarde para lo que ya está desplegado, ¿qué hace pensar que van a llegar a tiempo para el siguiente salto de capacidad? Esa es la pregunta que Coxon está dejando sobre la mesa y que ninguna hoja de ruta responde con números.

## Profecía versus gobernanza

Hay una trampa en cómo se discute esto. La conversación pública se parte en dos bandos inútiles:

- Los que discuten si la superinteligencia va a llegar y cuándo.
- Los que discuten si la IA no es más que autocompletar gigante.

Ninguno de los dos bandos te ayuda a decidir el martes. Lo que sí sirve está más abajo, en el barro:

- **Trazabilidad**: que cada acción de un sistema con capacidad de actuar quede registrada y sea auditable por alguien de fuera de la empresa.
- **Evaluaciones antes de desplegar, no en el *blog post***: pruebas de seguridad adversariales obligatorias y publicadas, no *frameworks* voluntarios.
- **Responsabilidad legal clara**: si un agente de IA causa daño, ¿quién firma? Hoy la respuesta honesta es "nadie sabe", y eso es exactamente lo que hay que arreglar.
- **Reporte de incidentes con consecuencias**: reportar no debe ser gratis. Si la cuarta vez que admites un incidente no te cuesta nada, el incentivo sigue siendo no mirar.
- **Mínimos operativos para el personal de seguridad**: si en tu empresa los que evalúan el riesgo no pueden frenar un despliegue, tienes un problema de gobierno, no de ética.

De todo eso se habla poco porque no da conferencia magistral. Da trabajo.

## Lo que yo me llevo

No sé si llegarán a 2030 con esa probabilidad encima. Lo que sí sé es lo siguiente: cada vez que alguien de dentro renuncia para avisar, la ventana para "averiguar después" se cierra un poco más. Y el costo de cerrarla no lo pagan los laboratorios ni los inversionistas. Lo pagan los usuarios, los países que adoptan tecnología sin poder auditarla, y los que trabajamos en telecomunicaciones, salud o servicios críticos sobre sistemas que no controlamos.

Mi postura no es tecnofobia ni tecnofilia. Es una pregunta simple, la misma que haría en un comité operativo: si esto falla, ¿quién responde, con qué evidencia y desde cuándo lo sabíamos?

La renuncia de Coxon es, en el fondo, una respuesta incómoda a esa pregunta: muchos aún no podemos responderla.

Estoy aquí para conectar a las personas a través de la tecnología de forma que puedan dejar su huella en la humanidad. Y para eso, la tecnología tiene que estar viva al día siguiente.

Si algo de esto te movió el piso, compártelo. Y si trabajas en IA, seguridad o telecom, me interesa leer cómo lo estás viendo en tu operación: ahí es donde se decide de verdad.
