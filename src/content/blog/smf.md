---
title: "SMF"
pubDate: "2026-06-09"
description: "una red 5G, que tu móvil pueda abrir una videollamada, ver streaming o conectarse a una app IoT no es magia: es el resultado de varios elementos del Core 5G trabajando coordinados. Uno de los más im"
categories: [sin-categoria]
heroImage: "../../assets/blog/smf.png"
---

una red 5G, que tu móvil pueda abrir una videollamada, ver streaming o conectarse a una app IoT no es magia: es el resultado de varios elementos del Core 5G trabajando coordinados. Uno de los más importantes para que los datos fluyan correctamente es el SMF (Session Management Function).
El SMF (Session Management Function) es una función de red del Core 5G (5GC) encargada principalmente de la gestión de sesiones de datos del usuario, llamadas PDU Sessions.
Dicho simple: cuando tu equipo (UE) quiere salir a Internet o conectarse a una red de datos (Data Network), el SMF es quien crea, modifica y termina esa sesión, y además controla cómo se arma el camino de datos a través del plano de usuario.
  
**Las responsabilidades clave del SMF incluyen:**
1) Gestión del ciclo de vida de la sesión (PDU Session)
  * Establecer la sesión (alta)
  * Modificar la sesión (cambios de QoS, rutas, políticas, etc.)
  * Liberar/terminar la sesión (baja)

  
2) Selección del UPF (User Plane Function)  
El SMF decide qué UPF va a transportar el tráfico del usuario, según criterios como:
  * ubicación del UE
  * tipo de servicio
  * slice de red
  * políticas del operador

  
3) Asignación de IP al UE  
Durante el alta de sesión, el SMF gestiona la asignación de dirección IP (IPv4, IPv6 o dual-stack) para que el UE sea identificable en la red de datos.
4) Gestión de QoS y aplicación de políticas  
El SMF aplica reglas de QoS (latencia, ancho de banda, prioridad) y políticas de tráfico/cobro, coordinándose con el PCF.
5) Control del plano de usuario (túneles y recursos)  
El SMF coordina parámetros necesarios para el transporte de datos, como identificadores de túnel (por ejemplo, TEID en GTP-U) y configura al UPF mediante señalización de control.
6) Soporte a movilidad con continuidad de sesión  
En eventos de movilidad (handover), el SMF ayuda a mantener la continuidad de la sesión, gestionando el anclaje del plano de usuario cuando corresponde.
**¿En qué flujos o procesos participa?**  
Sin entrar en toda la señalización 3GPP, el SMF aparece de forma muy clara en el flujo de establecimiento y actualización de una PDU Session:
  * Limpieza/liberación de contexto previo (si aplica): El SMF puede coordinar con el AMF para evitar contextos viejos o duplicados antes de un nuevo setup.
  * Asignación de IP al UE: El SMF gestiona que el usuario reciba una IP adecuada según su suscripción y slice.
  * Selección del UPF: Decide el UPF óptimo para ese usuario/servicio.
  * Creación/actualización del contexto de sesión: Se prepara el contexto de la sesión con parámetros de QoS y reglas.
  * Configuración del UPF por la interfaz N4 (PFCP): El SMF envía mensajes de control para que el UPF quede listo para encaminar el tráfico.
  * Confirmación al AMF de que el plano de usuario está listo: Con esto, el AMF puede informar al UE que la sesión ya está activa y puede empezar a enviar/recibir datos.

**¿Con qué elementos se interconecta?**  
El SMF no trabaja solo. Sus interacciones más relevantes son:
  * AMF (Access and Mobility Management Function): coordinación para procedimientos de sesión y contexto asociado al usuario (interfaz N11).
  * UPF (User Plane Function): control del plano de usuario; el SMF ordena cómo debe encaminarse el tráfico (interfaz N4, usando PFCP).
  * PCF (Policy Control Function): obtención y aplicación de políticas de QoS, charging y reglas de tráfico.
  * UDM (Unified Data Management): acceso a datos de suscripción del usuario (por ejemplo, para decisiones de sesión y direccionamiento).

  
**el SMF como el jefe de logística de un aeropuerto**  
Imagina que tu UE es un pasajero que quiere viajar (usar datos). El UPF son los aviones y rutas reales por donde se transporta el equipaje (los paquetes). El SMF sería el jefe de logística del aeropuerto:
Cuando llegas al mostrador y dices quiero volar ? el SMF crea tu sesión.  
Te asigna un ticket y asiento ? el SMF te asigna IP y define parámetros de servicio.  
Decide qué avión y qué ruta te conviene ? el SMF selecciona el UPF adecuado.  
Coordina con el equipo de pista para que el avión esté listo ? el SMF configura el UPF (por N4/PFCP).  
Si hay un cambio (más equipaje, prioridad, cambio de puerta) ? el SMF modifica la sesión (QoS/políticas).  
Cuando termina el viaje ? el SMF libera la sesión y recursos.  
El pasajero solo ve que viajó. Pero detrás, el jefe de logística hizo que todo encaje.
—————  
El SMF es una pieza central del Core 5G porque convierte una intención simple (quiero datos) en una realidad técnica: sesión activa, IP asignada, UPF seleccionado, QoS aplicado y plano de usuario configurado. Es, literalmente, el cerebro de control de las sesiones de datos.
