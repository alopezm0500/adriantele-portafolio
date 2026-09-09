---
title: "Operaciones de Core en la encrucijada: cómo preparar a tu equipo para lo que viene"
pubDate: "2026-06-09"
description: "Llevo poco coordinando operaciones de IMS y CS Core para el manejo de voz celular. Y recientemente algo ha cambiado.No es que antes fuera fácil —opera"
categories: [techco-e-ia]
heroImage: "../../assets/blog/operaciones-de-core-en-la-encrucijada-como-preparar-a-tu-equipo-para-lo-que-viene.png"
---

Llevo poco coordinando operaciones de IMS y CS Core para el manejo de voz celular. Y recientemente algo ha cambiado.No es que antes fuera fácil —operar una red de voz nunca lo ha sido— pero el ritmo al que están llegando nuevas tecnologías, nuevas arquitecturas y nuevas expectativas está poniendo presión sobre los equipos de operaciones de una forma que no había visto antes.

Este artículo va dirigido a mis colegas de operaciones. A los que están en la trinchera, coordinando equipos, apagando incendios y tratando de mantener la red funcionando mientras el mundo avanza. Porque si no nos adaptamos, nos van a pasar por encima.

**El problema de fondo…**Históricamente, los equipos de operaciones de core hemos sido reactivos. Algo falla, llega la alarma, revisamos logs, escalamos, resolvemos. Es un ciclo que funciona bien cuando el entorno es estable y los cambios son graduales.Pero el entorno ya no es estable.

**Hoy tenemos:**Virtualización y cloudificación del core (NFV, cloud-native 5GC)Separación de planos (control y usuario) que cambia la forma de diagnosticarRedes híbridas donde conviven TDM, SIP, VoLTE, VoNR y cada vez más servicios over-the-topAutomatización que promete reemplazar tareas repetitivas pero exige nuevas habilidadesIA aplicada a operaciones que está llegando más rápido de lo que muchos equipos pueden absorber

Y en medio de todo eso, el equipo de operaciones sigue siendo el responsable de que el servicio funcione. Las 24/7. Sin excusas.

**¿Cómo debería adaptarse el equipo de operaciones?**La primera respuesta es incómoda: dejar de ser reactivos y volverse proactivos. Pero decirlo es fácil. Lo difícil es cómo.En mi experiencia, hay tres ejes de transformación:

1. De operadores de red a gestores de plataformaAntes, el conocimiento profundo de una plataforma específica (un MSC, un MGW, un S-CSCF) era el activo más valioso de un ingeniero. Hoy, ese conocimiento sigue siendo importante, pero insuficiente. El ingeniero de operaciones del 2026 necesita entender:Arquitectura cloud-native: cómo funcionan los contenedores, cómo se orquestan, cómo se debuggean cuando algo falla en un entorno Kubernetes en lugar de en una caja física.Redes basadas en intención: donde las políticas se definen de forma declarativa y la red se autoconfigura.Telemetría y observabilidad: no solo monitorear, sino entender el comportamiento del sistema a través de métricas, trazas y logs correlacionados.El operador de red se convierte en un gestor de plataforma. Ya no aprieta tuercas, entiende sistemas.
1. Automatización como habilitador, no como amenazaHay resistencia natural a la automatización en equipos de operaciones. Se ve como algo que va a reemplazar puestos. Y sí, va a reemplazar tareas. Pero no ingenieros.El equipo que automatiza sus procesos de diagnóstico, sus respuestas a incidentes comunes y sus tareas de mantenimiento rutinario libera tiempo para lo que realmente importa: resolver problemas complejos, optimizar la red y prepararse para lo que viene.Como líder, mi trabajo es facilitar esa transición. No imponer herramientas, sino mostrar cómo la automatización hace que el trabajo sea más interesante, no más precario.
1. Cultura de documentación y conocimiento compartidoEste es el más difícil y el más importante. En operaciones de core, el conocimiento suele estar en la cabeza de las personas. Cuando alguien se va, se lleva años de experiencia que no están escritos en ningún lado.

La documentación no es un deliverable administrativo. Es un activo operativo. Y el líder tiene que predicar con el ejemplo: documentar, revisar, actualizar. Hacer que sea parte del flujo de trabajo, no una tarea adicional que nadie hace.

**¿Cómo deberían prepararse los ingenieros?**Si eres ingeniero de operaciones de core y estás leyendo esto, aquí van algunas sugerencias prácticas:Aprende Linux a nivel avanzado. No solo comandos básicos. Procesos, systemd, networking, namespaces, cgroups. Es la base de todo lo que viene.Familiarízate con Kubernetes. No necesitas ser administrador de clusters, pero entender cómo funciona, cómo se despliega una aplicación, cómo se debuggea un pod en CrashLoopBackOff. Eso hoy es tan básico como saber leer un log del MSC.Inviértete en automatización. Python, Ansible, algo de scripting. No necesitas ser desarrollador, pero sí necesitas poder escribir un script que te ahorre una hora de trabajo repetitivo.Entiende de redes IP en profundidad. El core de voz ya no es solo SS7 y SIGTRAN. Es SIP, HTTP/2, QUIC, SCTP, y cada vez más encapsulación sobre IP. Si no entiendes bien IP, vas a batallar.

Cultiva la curiosidad técnica. El que se queda solo con lo que ya sabe se vuelve obsoleto en 3 años. Y en este ritmo, quizá en 2.

**El lugar del líder de equipo**Y aquí llego al punto que más me interesa: ¿cuál es mi papel como coordinador en todo esto?No es ser el que más sabe de tecnología. Eso ya no funciona. El líder que quiere saber más que todos termina siendo un cuello de botella.

Mi papel, como lo veo, es:Crear las condiciones para que el equipo aprenda. Conseguir tiempo, recursos, acceso a entrenamientos. Proteger al equipo del ruido. La organización siempre va a pedir más, más rápido. Mi trabajo es traducir esas expectativas en planes realistas y proteger a mi gente del burnout.Facilitar la transición, no forzarla. El cambio asusta. Algunos ingenieros con 20 años de experiencia van a resistirse a aprender Kubernetes. Mi trabajo es mostrarles por qué vale la pena, no obligarlos.Predicar con el ejemplo. Si yo no estoy aprendiendo cosas nuevas, no puedo pedirle al equipo que lo haga. Si yo no documento, no puedo exigir documentación. Si yo no automatizo, no puedo vender automatización.

Mantener la visión del negocio. El equipo de operaciones no existe para operar la red. Existe para que los usuarios tengan servicio de voz. Cada decisión técnica tiene que responder a esa pregunta: ¿esto mejora el servicio?

---

Vivimos un momento interesante para los que operamos redes de core. La tecnología está cambiando más rápido que nunca, y la presión no va a disminuir.Pero también es una oportunidad. Los equipos que se adapten, que aprendan, que automaticen y que documenten van a ser los que lideren la próxima década. Los que se queden haciendo lo mismo de siempre van a ser reemplazados —no por IA, sino por equipos que sí supieron adaptarse.Como líder, mi responsabilidad es asegurarme de que mi equipo esté en el primer grupo.
