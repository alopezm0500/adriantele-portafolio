---
title: "Registro en IMS Core"
pubDate: "2020-09-03"
description: "Hablemos del proceso de registro en IMS core, comencemos por lo básico, ¿Por que es necesario realizar un registro en la red? Si no lo sabes, te recomiendo este articulo. Para explicar el proceso de R"
categories: [technical]
---

Hablemos del proceso de registro en IMS core, comencemos por lo básico, ¿Por que es necesario realizar un registro en la red? Si no lo sabes, te recomiendo este [articulo](https://adrianlopez.tech.blog/2020/08/26/attach-register/). Para explicar el proceso de Registro en IMS Core me gusta separarlo en dos diferentes etapas; la etapa de Autorización de Usuario y le etapa de Autorización Multimedia.
La imagen a continuación nos ayudara con el entendimiento:
![](https://adrianlopeztech.wordpress.com/wp-content/uploads/2021/08/scanpro-2020-09-03-14.28.38-scaled-1.jpg?w=1024)Proceso de registro en IMS
#### Autorización de Usuario
Del numero 1 al 7 son la etapa de Autorización de Usuario, comienza con una solicitud de Registro desde el usuario a través de protocolo SIP (cabe señalar que el usuario considerando que hablamos de IMS, puede ser un celular o un teléfono fijo IP); la solicitud de Registro pasa por el Proxy CSCF y de ahí a Interrogating CSCF.
Una vez la señalización ha llegado a Interrogating, este solicita Autenticación al HSS con un mensaje UAR (User Authentication Request) pero dado que este mensaje no contiene la cadena de caracteres correctos para registrarse (WWW-Authenticate header) en la red el HSS responde (mensaje UAA) con respuesta Unauthorized, lo que da como resultado el mensaje SIP 401 (Unauthorized) que se replica hasta llegar nuevamente al Usuario notificándole que no contiene la cadena de Autenticación necesaria y enviándole un Vector de desafío para que el Usuario lo resuelva y reintentar.
A grandes rasgos, el usuario solicita registrarse a la red y le red le dice que no puede por que no tiene la llave adecuada, pero le envía de regreso una imagen con el modelo de la cerradura y contraseña para que el usuario cree su llave y volver a intentarlo.
#### Autorización Multimedia
La segunda parte del proceso corresponde a los números desde 8 al 14, en esta etapa el usuario será registrado en la red y se le informara al Usuario las capacidades de la red puede utilizar a través de consultas de Autorización Multimedia hacia el HSS desde el Serving CSCF.
Así que ahora pensemos en el proceso completo, en la etapa anterior el usuario recibió una negativa, ahora con la información enviada por la red realiza un calculo y reintenta el registro pero ahora con la llave necesaria para acceder a la red, ahora la respuesta del paso 4 (UAA) contiene una aprobación de registro con lo que Interrogating envía registro a Serving, Serving solicita autenticación Multimedia y esta es positiva, ahora Serving CSCF responde con un OK a Proxy y este a su vez le comunica al usuario que el registro a sido exitoso.
Y así, OK, el registro a finalizado exitosamente y el usuario esta listo para utilizar los servicios de la red.
Tienes alguna duda, recomendación, comentala, me encantara leerte; nos saludamos en la próxima.
