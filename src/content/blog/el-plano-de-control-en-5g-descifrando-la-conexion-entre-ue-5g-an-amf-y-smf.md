---
title: "El Plano de Control en 5G: Descifrando la Conexión entre UE, 5G-AN, AMF y SMF"
pubDate: "2026-06-09"
description: "Como el titulo lo indica, hablemos a fondo de la interfaz entre AMF y SMF (elementos de los que ya he hablado). ¿Qué es el Plano de Control en 5G? Imaginen el plano de control como el “cerebro” de la "
categories: [technical]
heroImage: "../../assets/blog/el-plano-de-control-en-5g-descifrando-la-conexion-entre-ue-5g-an-amf-y-smf.png"
---

Como el titulo lo indica, hablemos a fondo de la interfaz entre [AMF](https://adriantele.com/amf/) y [SMF](https://adriantele.com/smf/) (elementos de los que ya he hablado).
**¿Qué es el Plano de Control en 5G?**
Imaginen el plano de control como el “cerebro” de la red 5G. Mientras que el plano de usuario (U-plane) se encarga de transportar nuestros datos (videos, llamadas, mensajes), el plano de control (C-plane) es el que orquesta toda la magia detrás de escena.
Este plano se encarga de:
  * Registro y autenticación de usuarios
  * Gestión de sesiones (creación, modificación y terminación)
  * Movilidad (cuando nos movemos entre celdas)
  * Aplicación de políticas de calidad de servicio
  * Liberación de conexiones

Vamos a conocer a los actores principales en este fascinante proceso:
  1. UE (User Equipment) – Nuestro Dispositivo  
Nuestro smartphone, tablet o cualquier dispositivo 5G que inicia la comunicación.
  2. 5G-AN (5G Access Network) – La Puerta de Entrada  
Generalmente el gNB (Next-Generation NodeB), que es nuestra estación base 5G.
  3. AMF (Access and Mobility Management Function) – El Coordinador  
Se encarga del registro, autenticación y gestión de movilidad.
  4. SMF (Session Management Function) – El Gestor de Sesiones  
Administra las sesiones PDU, asigna direcciones IP y coordina con el plano de usuario.

**El Viaje de una Señal: Paso a Paso**
Fase 1: Entre el UE y el 5G-AN  
Nuestro dispositivo envía mensajes NAS (Non-Access Stratum) para establecer la conexión. Aquí tenemos dos tipos importantes:
  * NAS-MM: Para gestión de movilidad (registro, autenticación)
  * NAS-SM: Para gestión de sesiones (creación de sesiones PDU)

Fase 2: Entre el 5G-AN y el AMF (Interfaz N2)  
El gNB reenvía los mensajes NAS al AMF usando:
  * NG-AP: Protocolo de aplicación para señalización
  * SCTP: Para transporte confiable de mensajes

Fase 3: Entre el AMF y el SMF (Interfaz N11)  
El AMF actúa como relé, enviando los mensajes NAS-SM al SMF para que gestione la sesión.
**¿Por Qué Esta Arquitectura es Tan Especial?**
La arquitectura del plano de control en 5G trae ventajas significativas:
  1. Arquitectura Basada en Servicios (SBA)  
Cada función es modular y se comunica mediante APIs, lo que permite mayor flexibilidad.
  2. Escalabilidad Independiente  
Podemos escalar AMF, SMF y UPF por separado según las necesidades.
  3. Nube Nativa  
Soporta virtualización de funciones de red (NFV) y contenedores.
  4. Separación Clara de Responsabilidades  
Movilidad y gestión de sesiones están claramente diferenciadas.
  5. Seguridad Mejorada  
Cifrado NAS de extremo a extremo con protección de integridad.
  6. Soporte para Network Slicing  
¡Esto es lo más emocionante! Podemos crear “rebanadas” de red virtuales con diferentes características para diferentes servicios.

Esta arquitectura robusta permite:
  * Realidad Aumentada/Virtual: Ajuste dinámico de QoS para experiencias inmersivas
  * Vehículos Autónomos: Gestión de movilidad en tiempo real
  * Transiciones Suaves: Entre macroceldas, pequeñas celdas y Wi-Fi
  * IoT Masivo: Conexión eficiente de miles de dispositivos

—–
El plano de control en 5G no es solo una evolución técnica; es una revolución en cómo concebimos y operamos las redes móviles. Desde nuestro dispositivo hasta el núcleo de la red, cada componente trabaja en armonía para ofrecernos experiencias de conectividad más rápidas, seguras y personalizadas.
Para mis colegas en telecomunicaciones, entender esta arquitectura es clave para desbloquear todo el potencial de 5G. Para los usuarios curiosos, espero que esta explicación les haya dado una idea de la complejidad y belleza detrás de cada conexión que hacemos.
