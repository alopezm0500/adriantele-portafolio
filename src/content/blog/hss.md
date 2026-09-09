---
title: "HSS, la evolución de HLR"
pubDate: "2020-09-07"
description: "Home Local Register (HLR) es el elemento encargado de manejar la base de datos de usuarios que se encuentran en una red 2G o 3G; sin embargo, cuando hablamos de la siguiente generación de telecomunica"
categories: [technical]
heroImage: "../../assets/blog/hss.jpg"
---

[Home Local Register](https://adrian-lopez.com.mx/hlr/) (HLR) es el elemento encargado de manejar la base de datos de usuarios que se encuentran en una red 2G o 3G; sin embargo, cuando hablamos de la siguiente [generación de telecomunicaciones](https://adrian-lopez.com.mx/el-significado-de-las-letras-junto-a-la-recepcion/) celulares nos referimos a un elemento que cumple la misma función pero evolucionado conocido como HSS (Home Subscriber Server).
HSS se vuelve fundamental cuando hablamos de la tecnologia de transmision de datos LTE y en la administracion de llamadas a traves del core de IMS (VoLTE).
El protocolo en el que se comunica el HSS con los elementos de Core dentro de una red es Diameter, que es un protocolo basado en XML, un protocolo que funciona a base de etiquetas y que guarda relacion cercana con HTML, el lenguaje de las paginas web; lo anterior facilita mucho su entendimiento ya que a diferencia de otros lenguajes, no requiere de grandes conversiones de bits para ser entendible por una persona. El HLR utilizaba un protocolo mas enfocado a bits de modificación conocido como MAP (Mobile Application Part).
Charlemos un poco acerca de las interfaces de HSS:
![](https://adrianlopeztech.wordpress.com/wp-content/uploads/2021/08/scanpro-2020-09-01-20.28.35-scaled-1.jpg?w=1024)_Interfaces HSS_
Las interfaces entre los elementos de manejo de datos (SGSN y MME) y los elementos del IMS Core (TAS y CSCF) funcionan de manera bidireccional a través de mensajes cuyo nombre corresponde a la función y que trabajan con el esquema de “Solicitud (Request)” desde el elemento conectado y “Respuesta (Answer)” de parte de HSS:
Mensaje SIP| Nombre y funcion  
---|---  
UAR – UAA| User Authorization Request and Answer  
MAR – MAA| Multimedia Authentication Request and Answer  
SAR – SAA| Server Assignment Request and Answer  
LIR – LIA| Location Info Request and Answer  
ULR – LIA| Update Location Request and Answer  
AIR – AIA| Authentication Information Request and Answer  
CLR -CLA| Cancel Location Request and Answer  
Si deseas ver un ejemplo sobre el procesamiento de mensajes en que se involucra el HSS te recomiendo [El proceso de registro en Core IMS](https://adrian-lopez.com.mx/registro-en-ims/).
Acerca de el equipo que proporciona la función de HSS me parece interesante mencionar que los equipos físicos manejan un esquema de Base de Datos compartida en Back End para que únicamente el Front End sea el que cambie la función y trabaje como un HLR o un HSS, pero ese es tema de otro articulo, para verlo a detalle.
¿Duda? ¿Curiosidad? ¿Deseas que hable de algo en especial? No olvides comentar. Nos saludamos en la próxima.
