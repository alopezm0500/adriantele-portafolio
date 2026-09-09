---
title: "Arquitectura 4G a 5G"
pubDate: "2021-04-25"
description: "Así como existe un conjunto de elementos de núcleo que manejan el flujo de paquetes sobre una red de cuarta generación se tiene un conjunto de elementos que conforman la arquitectura 5G, esto con la f"
categories: [technical]
heroImage: "../../assets/blog/arquitectura-4g-a-5g.jpg"
---

Así como existe un conjunto de elementos de núcleo que manejan el flujo de paquetes sobre una red de cuarta generación se tiene un conjunto de elementos que conforman la arquitectura 5G, esto con la finalidad de delimitar la funcionalidad de cada elemento a pesar de que en las siguientes generaciones de telecomunicaciones ya funcionen sobre plataformas virtualizadas, talvez, inclusive, en la nube.
La arquitectura 4G permite de forma lógica separar señalización y capacidad de datos del usuario a través de los diferentes elementos; dicha lógica a mostrado su funcionalidad por lo que se hereda para el diseño de las redes 5G.
Intentemos entender los elementos del Core de 5G desde lo mas parecido que es por varios conocidos la arquitectura 4G:
Empecemos por el acceso, para 4G tenemos al**e** volved NodeB y para 5G hablamos del Next **g** eneration NodeB.
El siguiente elemento conectado seria el MME (movilidad) en la arquitectura 4G que para 5G pasa a separar sus funciones en dos elementos; tenemos al AMF (Acceso y Movilidad) y el SMF (Gestión de Sesiones).
![](https://adrianlopeztech.wordpress.com/wp-content/uploads/2021/08/swiftscan-2021-03-25-18.11.09-scaled-1.jpg?w=1024)
En la lógica los siguientes elementos serian los de control de sesiones, para 4G tenemos a MME, SGW y PGW que pasan en su conjunto a heredar funciones a SMF (Gestión de Sesiones) para 5G.
Una cosa es el control de sesiones, pero como tal el servicio, el Plano de usuario es manejado por SGW y PGW en 4G pero en 5G tenemos al UPF (Plano de Usuario).
Y para finalizar la correspondencia hablemos de las bases de datos, los elementos que registran las características de usuarios y los servicios disponibles, en 4G tenemos a los conocidísimos HSS y PCRF (Subscriptores y Políticas) que en la nueva arquitectura 5G tienen las entidades AUSF (Autenticación), UDM (Datos de Usuarios) y PCF (Políticas) que pasa directamente a adquirir las funciones de PCRF.
Hasta acá llegamos el día de hoy, pero si gustas luego charlamos específicamente del Core de 5G y claro de los elementos nuevos en la arquitectura, solo coméntalo. Nos saludamos en la próxima!
