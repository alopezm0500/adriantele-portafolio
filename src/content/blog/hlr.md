---
title: "Home Local Register"
pubDate: "2020-08-31"
description: "Los usuarios que son atendidos por un proveedor de telecomunicaciones deben tener algún tipo de registro en alguna base de datos para controlar sus características y los servicios que tienen aprovisio"
categories: [technical]
---

Los usuarios que son atendidos por un proveedor de telecomunicaciones deben tener algún tipo de registro en alguna base de datos para controlar sus características y los servicios que tienen aprovisionados, la base datos que utilizan las redes celulares son llamadas HLR y HSS, según la tecnología utilizada podría ser una u otra aunque en la actualidad los equipos cumplen ambas funciones; en este articulo hablaremos del HLR o Home Location Subscriber que es la base de datos de las redes GSM y 3G, sirve para las dos redes que tenían los proveedores, red de Voz y de Datos.
El HLR dado que tiene los datos de los usuarios se conecta a un gran numero de equipos en la red e indirectamente con prácticamente todos los equipos de la red.
Las interfaces que conectan con el HLR lo hacen a través de protocolo MAP (Mobile Application Part) que trabaja sobre protocolos TCAP, SCCP y SIGTRAN o MTP.
![](https://adrian-lopez.com.mx/wp-content/uploads/2020/08/ScanPro-2020-08-26-19.21.40-1024x706.jpg)
Para las redes 2G y 3G dado que había redes separadas para manejar la voz (CS) y los datos (PS). El HLR requiere interfaces con equipos de ambas redes:
Interfaz| Equipo remoto| Funcion del Remoto  
---|---|---  
C, D| MSC| Procesamiento de llamadas  
Gc| GGSN| Proveer salidas a PDN (Datos moviles)  
Gr| SGSN| Movilidad de celulares (Datos moviles)  
J| SCP| Funciones de prepago para celulares  
Lh| GMLC| Localizacion  
Interfaces con HLR
Ahora hablemos un poco de la mensajería ya que al final ese es el objetivo de que existan las interfaces: intercambiar mensajes entre los elementos, transacciones.
Para ejemplificar, me referiré al caso del Attach, del que [ya he hablado en otra publicación](https://adrian-lopez.com.mx/attach-register/)
Veamos el flujo de transacciones mostrado debajo (que puedes ver completamente y se encuentra en <http://openss7.org/map_design.html>)
![Transaction Flow — Attach](https://i0.wp.com/openss7.org/projects/xflow1.png)
Lado derecho elementos de PS (Datos), lado izquierdo elementos de CS (Voz):
  1. Update Location/Cancel Location – El SGSN requiere saber la localización de la terminal para proporcionarle servicio, en este caso conforme el celular se mueve de lugar, se dispara el proceso de Update Location en el nuevo SGSN y Cancelar la Localización en el SGSN anterior.
  2. Cancel Location Ack/Insert Subscriber Data – Cuando se tiene confirmación de Cancel Location se realiza la inserción de datos del subscriptor en el nuevo SGSN.
  3. Insert Subscriber Data Ack/Update Location Ack – Con la confirmación de Inserción de Datos se procede a confirmar de igual forma el Update Location en el nuevo SGSN.
  4. Update Location/Cancel Location 
  5. Cancel Location Ack/Insert Subscriber Data 
  6. Insert Subscriber Data Ack/Update Location Ack 

Como se aprecia, el HLR es un elemento básico desde el simple Attach, ya no se diga el proporcionar un servicio al celular. Si gustas podemos revisar la mensajería a detalle, pero para no exagerar, terminaremos aquí; comenta si te gustaría aundar mas.
En los próximos artículos veremos también la función de HSS, que es la siguiente generación de esta funcionalidad. Nos saludamos en la próxima, gracias por tus comentarios.
