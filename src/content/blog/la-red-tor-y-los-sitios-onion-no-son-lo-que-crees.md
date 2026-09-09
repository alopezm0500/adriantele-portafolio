---
title: "La red Tor y los sitios .onion no son lo que crees"
pubDate: "2026-06-27"
description: "Más allá de la deep web y los mitos, existe una de las herramientas más poderosas para la libertad de expresión en el mundo. Seguro has escuchado hablar de la “deep web”, de los sitios .onion, de que "
categories: [por-si-no-sabias]
heroImage: "../../assets/blog/la-red-tor-y-los-sitios-onion-no-son-lo-que-crees.png"
---

_Más allá de la deep web y los mitos, existe una de las herramientas más poderosas para la libertad de expresión en el mundo._
* * *
Seguro has escuchado hablar de la “deep web”, de los sitios .onion, de que ahí se esconden cosas turbias. También probablemente has oído que Tor es cosa de hackers y criminales.
La realidad es mucho más interesante — y más importante para tu libertad de lo que imaginas.
* * *
## ¿Qué es Tor?
Tor son las siglas de **The Onion Router** (El Enrutador Cebolla). Es un proyecto sin fines de lucro que nació en los años 90 en el laboratorio de investigación naval de Estados Unidos. La idea era simple pero brillante: **crear una red donde nadie —ni siquiera quienes la operan— pueda saber quién se conecta a qué.**
El nombre “cebolla” no es casual. Así como una cebolla tiene capas, el tráfico en Tor se envuelve en múltiples capas de cifrado. Cada capa se va “pelando” en cada salto de la red, hasta que el mensaje llega a su destino.
Pero vayamos por partes.
* * *
## ¿Cómo funciona?
Imagina que quieres visitar un sitio web sin que nadie sepa que fuiste tú. Normalmente, tu conexión viaja directo de tu casa al servidor del sitio. Tu proveedor de internet (ISP) lo ve, el sitio web ve tu dirección IP, y cualquier gobierno o empresa con acceso a los cables puede verlo también.
Con Tor, tu tráfico no viaja directo. En lugar de eso:
  1. Tu navegador elige **tres nodos (repetidores) al azar** en la red Tor, manejados por voluntarios en distintas partes del mundo.
  2. Tu mensaje se cifra **tres veces** , una para cada nodo.
  3. El primer nodo pela la primera capa y sabe que el mensaje va al segundo nodo, pero no sabe cuál es el destino final.
  4. El segundo pela otra capa y sabe que va al tercero, pero tampoco sabe el destino.
  5. El tercer nodo pela la última capa y envía el mensaje al destino final.

Ningún nodo tiene la imagen completa. Es como si enviaras una carta dentro de otra carta, dentro de otra carta, y cada persona solo puede abrir la suya para saber a quién reenviarla.
* * *
## ¿Y los sitios .onion?
Aquí está lo que pocos saben: **los sitios .onion no son lo mismo que navegar por Tor.**
Cuando usas el Navegador Tor para visitar un sitio normal como google.com, tu tráfico sale de la red Tor hacia el internet abierto. El sitio web sigue viendo una dirección IP (la del último nodo), pero no sabe quién eres.
Un **servicio .onion** es diferente. Es un sitio web que **solo existe dentro de la red Tor**. No tiene una dirección IP pública. Su dirección es una cadena de letras y números que termina en .onion, como esta:
`vww6ybal4bd7szmgncyruucpgfkqahzddi37ktceo3ah7ngmcopnpyyd.onion`
Esa dirección tan críptica no es un nombre de dominio cualquiera. Es en realidad **la clave pública de identidad del servicio**. Cuando te conectas, tu navegador verifica criptográficamente que el contenido que estás viendo solo pudo haber sido generado por ese servicio. No hay suplantación posible.
Y lo más importante: **la conexión nunca sale de la red Tor.** El cliente y el servidor se encuentran dentro de la red, a través de un proceso llamado “rendezvous” (encuentro). Nadie sabe dónde está el servidor físicamente. Nadie sabe quién eres tú.
* * *
## ¿Para qué sirve realmente?
Aquí es donde la cosa se pone seria. Los servicios .onion no son solo para comprar cosas ilegales. Son utilizados por:
**Periodistas y medios de comunicación.** ProPublica, BBC, Deutsche Welle y The New York Times tienen versiones .onion de sus sitios. ¿Por qué? Porque en países como China, Irán o Vietnam, estos medios están bloqueados. Un ciudadano que quiera leer información independiente puede hacerlo a través de Tor sin que su gobierno lo sepa.
**Denunciantes y fuentes anónimas.** SecureDrop es una plataforma que usan los medios para recibir información de forma anónima. Está basada en servicios .onion. Un informante puede enviar documentos sin que nadie —ni siquiera el medio— sepa quién es.
**Activistas en regímenes autoritarios.** Personas que viven bajo gobiernos que persiguen la disidencia pueden comunicarse, organizarse y acceder a información sin ser vigilados.
**Personas comunes que valoran su privacidad.** Cada vez que visitas un sitio web, dejas un rastro: tu IP, tu ubicación aproximada, tu navegador, tu sistema operativo. Con Tor y los servicios .onion, ese rastro simplemente no existe.
* * *
## ¿Es ilegal usar Tor?
No. Usar Tor es legal en la gran mayoría de los países del mundo. De hecho, gobiernos, fuerzas armadas, periodistas y organizaciones de derechos humanos lo usan.
Lo que sí es ilegal son las actividades que algunas personas hacen dentro de la red, igual que es ilegal cometer un delito en la calle. La herramienta no es el crimen.
* * *
## ¿Cómo probarlo?
Si te da curiosidad, solo descarga el **Navegador Tor** desde torproject.org. Es una versión modificada de Firefox que ya viene configurada para conectarse a la red. No necesitas instalar nada más.
Y si quieres visitar un sitio .onion de un medio de comunicación legítimo, aquí tienes uno real:
  * **ProPublica:** `p53lf57qovyuvwsc6xnrppyply3vtqm7l6pcobkmyqsiofyeznfu5uqd.onion`
  * **BBC News:** `bbcnewsd73hkzno2ini43t4gblxvycyac5aw4gnv7t2rccijh7745uqd.onion`

Pégalas en el Navegador Tor y verás que funcionan.
* * *
## La próxima vez que escuches “deep web”
Recuerda que la red Tor y los servicios .onion fueron creados para proteger la libertad de expresión, no para esconder crímenes. Son una herramienta que permite que un periodista en un país sin libertad de prensa pueda hacer su trabajo, que un activista pueda organizarse sin miedo, y que cualquier persona pueda navegar sin ser vigilada.
La tecnología no es buena ni mala. Es lo que hacemos con ella.
* * *
_Esto es “Por si no sabías”, una sección donde explico cómo funciona la tecnología que nos rodea, desde la mirada de un ingeniero, pero en palabras que todos entendemos._
