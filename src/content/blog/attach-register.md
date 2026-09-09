---
title: "Attach y Register"
pubDate: "2020-08-26"
description: "Attach y Register son dos conceptos sencillos, sin embargo fundamentales en la lógica para proporcionar servicio a los celulares (terminales) sin importar la tecnología de la que estemos hablando; es "
categories: [por-si-no-sabias, technical]
---

Attach y Register son dos conceptos sencillos, sin embargo fundamentales en la lógica para proporcionar servicio a los celulares (terminales) sin importar la tecnología de la que estemos hablando; es necesario comprenderlos para entender como funcionan los celulares y sus redes.
En la cobertura de una antena que proporciona servicio se encuentran conectados centenas de celulares vía señal inalámbrica. ¿Cómo podría la red de un proveedor saber cuántas y cuáles celulares usan su servicio? Y más aún, ¿Cómo podría saber la red donde se encuentra tu celular en caso de que te busquen? Recuerda que la gracia del celular es que no requiere que te encuentres en una sola localización. ¿Cómo le hace la red?
Comencemos pues con la función de adjuntar un celular a la red (Attach). Pensemos en un esquema en el campo, múltiples antenas emiten señal de un proveedor específico; digamos por sencillez que un celular recibe la señal de tres diferentes antenas. El celular debe realizar internamente una comparación de las señales recibidas de las antenas y elegir la que le proporciona la mejor señal, a no ser que elijas la red manualmente. Unas vez elegida la señal de antena más adecuada, este comienza a realizar peticiones de adjuntarse a la red, para lo cual intercambia con la red códigos de autenticación (que vienen en la SIM). 
![](https://adrian-lopez.com.mx/wp-content/uploads/2020/08/ScanPro-2020-08-25-21.55.12-1024x564.jpg)
Una vez que la etapa de Radio Access Network (acceso) ha aceptado que tú celular está habilitado para interactuar con la red, este te proporciona acceso a la red interna (red de Core).
En esa etapa es en la que te encuentras cuando enciendes tu celular y la barra de señal muestra conexión e inclusive puedes ver un letrero de “Solo Emergencias”. Esto pasa por que la red ya ha identificado tu celular y sabe que tiene derecho de acceder a la red, pero aún no le proporciona servicios, eso pasa en la siguiente etapa.
La siguiente etapa es el Registro a la red (Register), la sección de acceso a la red ya le dio al celular permiso de comunicarse con la red interna (Core), así que ahora la red intercambia mensajes con el celular para autenticar, identificar y avisar que el celular puede utilizar los diferentes servicios de la red dependiendo del tipo de celular.
El Registro es necesario dado que en el proceso la red actualiza la base de datos de usuario y almacena la localización del usuario (en que antena se encuentra recibiendo servicio). De esta forma si alguien te envía un SMS, una llamada o una petición de localización, la red sabrá dónde buscar el celular.
Al finalizar el proceso de Registro normalmente aparece un identificador en el celular que regularmente es el nombre de la compañía que te da servicio. Ahora, puedes utilizar los servicios, aunque claro, dependerá de plan si puedes o no. La red ya hizo su trabajo y preparo tu celular para estar en contacto con la red.
Así que a grandes rasgos, un celular no puede registrarse sin atacharse primero, ni puede recibir servicios si no se ha registrado. Primero el Attach y luego el Register.
Hasta aquí la charla de hoy, luego revisaremos el proceso para el Registro para Voz y Datos. ¿Quieres que hablemos de algo en especial? Comenta. ¡Hasta la próxima!
