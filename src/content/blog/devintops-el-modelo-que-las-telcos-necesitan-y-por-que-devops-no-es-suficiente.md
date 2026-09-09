---
title: "DevIntOps: El Modelo que las Telcos Necesitan (y por qué DevOps no es suficiente)"
pubDate: "2026-06-15"
description: "En el artículo anterior hablé de cómo DevOps está transformando la industria telco, pero dejé un tema pendiente que merece su propio espacio: DevIntOps. No es un término bonito más. Es, probablemente,"
categories: [techco-e-ia]
heroImage: "../../assets/blog/devintops-el-modelo-que-las-telcos-necesitan-y-por-que-devops-no-es-suficiente.png"
---

En el artículo anterior hablé de cómo DevOps está transformando la industria telco, pero dejé un tema pendiente que merece su propio espacio: **DevIntOps**. No es un término bonito más. Es, probablemente, el modelo de colaboración más realista que he visto para operadores que trabajan con múltiples vendors en entornos NFV.
Y lo digo con conocimiento de causa: llevo años en operaciones IMS y CS Core, viendo cómo los proyectos de virtualización se atoran una y otra vez en el mismo punto: la integración.
## El problema de fondo
Cuando un operador telco decide virtualizar su red, el camino típico es:
  1. Compra software a Vendor A (digamos, para la capa de NFVI)
  2. Compra software a Vendor B (para el VNF de IMS)
  3. Compra software a Vendor C (para el MANO/orquestador)
  4. Contrata a un integrador
  5. Pasan 6-12 meses intentando que todo funcione junto
  6. Descubren problemas de interoperabilidad que nadie había previsto
  7. Se culpan entre vendors
  8. El operador paga los platos rotos

China Mobile documentó algo que cualquier operador reconoce al instante: **más del 60% de los problemas en despliegues NFV están relacionados con integración e interoperabilidad entre múltiples vendors**. No es que el software de cada vendor sea malo. Es que nadie lo probó funcionando con los demás antes de llegar a producción.
Y aquí es donde DevOps tradicional se queda corto.
## Por qué DevOps no funciona igual en telco
DevOps nació en empresas de software que **controlan su propio código**. Google, Netflix, Spotify — ellos desarrollan, ellos operan. El ciclo es natural: código → build → test → deploy → monitor → feedback → código.
En telco es diferente:
Aspecto| DevOps (IT)| Telco  
---|---|---  
**Código**|  Lo escribes tú| Lo compras a vendors  
**Ciclo**|  Días u horas| Semanas o meses  
**Control**|  Total sobre el pipeline| Dependiente de vendors  
**Falla**|  Rollback inmediato| Impacto en millones de usuarios  
**Integración**|  Un equipo, un stack| Múltiples vendors, múltiples stacks  
No podemos hacer DevOps como lo hace Spotify porque **no tenemos el código fuente** de nuestras VNFs. No podemos hacer un hotfix a las 3 AM porque el bug está en el software de Ericsson o Nokia, no en el nuestro.
Pero eso no significa que debamos rendirnos. Significa que necesitamos un modelo adaptado.
## DevIntOps: Development + Integration + Operations
El concepto fue presentado por China Mobile en 2022, y desde entonces he visto que cada vez más operadores lo están adoptando, aunque no siempre lo llamen así.
DevIntOps propone tres círculos de colaboración:
    
    
    ┌─────────────────────────────────────────────────┐
    │                 DevIntOps                        │
    │                                                   │
    │   ┌──────────┐    ┌──────────┐    ┌──────────┐   │
    │   │   Dev    │───►│   Int    │───►│   Ops    │   │
    │   │ (Vendor) │    │(Operador)│    │(Prod)    │   │
    │   └──────────┘    └──────────┘    └──────────┘   │
    │        ▲               │               │         │
    │        └───────────────┴───────────────┘         │
    │                    Feedback                      │
    └─────────────────────────────────────────────────┘
### Círculo Dev: El vendor desarrolla
El vendor hace lo que siempre ha hecho: recibe requerimientos, desarrolla software, genera builds. Nada nuevo aquí.
### Círculo Int: La clave del modelo
Aquí está la innovación. El operador establece un **laboratorio de integración propio**. Cuando el vendor tiene una build estable, en lugar de enviarla directamente a producción, la envía a este laboratorio. Automáticamente:
  1. Se despliega en el entorno de integración
  2. Se integra con los componentes de otros vendors
  3. Se ejecutan pruebas automatizadas (funcionales, de interoperabilidad, de rendimiento)
  4. Se genera retroalimentación al vendor

Si algo falla, se detecta en el laboratorio, no en producción. El vendor recibe el reporte, corrige, y envía una nueva build. El ciclo se repite hasta que todo pasa.
### Círculo Ops: Solo lo verificado pasa a producción
Una vez que la build ha pasado todas las pruebas en el laboratorio de integración, se despliega a producción. Y si surge un problema en producción, el laboratorio sirve para reproducirlo y verificarlo sin afectar el servicio.
## El laboratorio de integración: el corazón de DevIntOps
Si DevIntOps fuera un auto, el laboratorio de integración sería el motor. No es un laboratorio cualquiera — es un entorno que debe tener:
### 1\. Automatización de despliegue
El laboratorio debe ser capaz de desplegar entornos completos con un solo comando o trigger. China Mobile logró:
  * Despliegue de NFVI en **5 horas** (antes tomaba semanas)
  * Despliegue de almacenamiento distribuido en **30 minutos**
  * **6 productos** de software diferentes disparados desde un mismo pipeline CI/CD

Esto no es magia. Es Infrastructure as Code (IaC) llevado al extremo: describir toda la infraestructura —servidores, redes, almacenamiento, software— en archivos de configuración versionados.
### 2\. Pipeline CI/CD multi-vendor
El pipeline no solo compila código (como en IT). En telco, el pipeline debe:
  * Obtener la build del vendor (desde su repositorio o mediante upload)
  * Desplegarla en el entorno de integración
  * Configurar las interconexiones con otros componentes
  * Ejecutar pruebas de integración
  * Ejecutar pruebas de regresión
  * Generar reportes de interoperabilidad
  * Notificar resultados a todos los vendors involucrados

China Mobile construyó su pipeline con herramientas open source: **Jenkins, Docker, Ansible, pytest, Cucumber**. Nada de software propietario caro.
### 3\. Estandarización de interfaces
El mayor dolor de cabeza en multi-vendor es que cada uno habla su propio dialecto. Para que DevIntOps funcione, el operador debe definir:
  * **Interfaces estandarizadas** entre componentes
  * **Data models unificados** para describir recursos
  * **Formatos de configuración** comunes
  * **APIs** para integración con herramientas del operador

China Mobile creó el **Pod Description File (PDF)** , un archivo de descripción estandarizado que incluye toda la información de hardware y software de un resource pool. Este mismo archivo se usa para despliegue automatizado, pruebas y documentación.
## Las 5 etapas del pipeline de integración
Basado en la experiencia de China Mobile y otros operadores que han adoptado este modelo, el pipeline de integración se compone de 5 etapas:
### 1\. Plan & Design
Se define el diseño del entorno usando IaC. En lugar de documentos Word con diagramas, se usan archivos de configuración que describen:
  * Topología de red
  * Especificaciones de hardware
  * Versiones de software
  * Dependencias entre componentes

Todo se versiona en Git. Cada cambio es revisable, rastreable y reproducible.
### 2\. Hardware Test & Configuration
El pipeline dispara la configuración automatizada del hardware: BIOS, RAID, redes, almacenamiento. Luego ejecuta pruebas de validación para asegurar que el hardware cumple con las especificaciones.
Esto elimina el problema clásico de “el servidor llegó mal configurado y nos dimos cuenta hasta que intentamos desplegar el software”.
### 3\. Software Deployment
Se invocan las herramientas de despliegue de cada vendor mediante APIs estandarizadas. El pipeline orquesta el orden de despliegue respetando las dependencias: primero NFVI, luego VNFs, luego MANO.
### 4\. Integration
Aquí ocurre la magia. El pipeline ejecuta scripts de integración automatizada que:
  * Configuran las interconexiones entre componentes
  * Establecen los parámetros de interoperabilidad
  * Verifican que los componentes se “ven” entre sí
  * Validan que los flujos básicos funcionan

### 5\. Verification
Se ejecutan baterías de pruebas automatizadas:
  * Pruebas funcionales (¿la VNF hace lo que debe?)
  * Pruebas de interoperabilidad (¿los vendors se entienden entre sí?)
  * Pruebas de rendimiento (¿cumple con los KPIs?)
  * Pruebas de regresión (¿la nueva build rompió algo que antes funcionaba?)

Solo si todo pasa, la build se marca como “lista para producción”.
## Resultados concretos
Los números que reportó China Mobile después de implementar DevIntOps son difíciles de ignorar:
Métrica| Antes| Después  
---|---|---  
Tiempo de despliegue NFVI| Semanas| 5 horas  
Tiempo de despliegue storage| Días| 30 minutos  
Ciclos de prueba por versión| 1-2| 4+ por mes  
Pruebas ejecutadas| Manuales, pocas| Miles en 2 meses  
Problemas detectados| En producción| En laboratorio  
Integraciones validadas| 1-2 vendors| 4+ vendors  
Pero más importante: **los problemas se detectan en el laboratorio, no en producción**. Eso solo ya justifica la inversión.
## ¿Cómo empezar a adoptar DevIntOps?
Si trabajas en operaciones de un operador telco y esto te suena a algo que necesitas, aquí hay una hoja de ruta práctica:
### Fase 1: Laboratorio básico (3-6 meses)
  1. Consigue un par de servidores (no necesitas mucho para empezar)
  2. Instala un hipervisor (OpenStack, VMware)
  3. Configura un repositorio Git
  4. Automatiza el despliegue de un componente con Ansible
  5. Crea un pipeline simple con Jenkins

No necesitas empezar con 5 vendors. Empieza con uno. El objetivo es tener un pipeline que despliegue automáticamente y ejecute pruebas.
### Fase 2: Integración multi-vendor (6-12 meses)
  1. Invita a un segundo vendor a tu laboratorio
  2. Define interfaces estandarizadas entre ellos
  3. Automatiza las pruebas de interoperabilidad
  4. Establece el ciclo de feedback con los vendors

Aquí es donde empiezas a ver el verdadero valor. Los vendors se vuelven más receptivos cuando ven que tienes un laboratorio donde validar sus builds.
### Fase 3: Producción (12-18 meses)
  1. Conecta el pipeline del laboratorio con el entorno de producción
  2. Establece gates: solo builds validadas pasan a producción
  3. Implementa monitoreo y feedback de producción hacia el laboratorio
  4. Expande a más vendors y componentes

### Fase 4: Optimización (18+ meses)
  1. Automatiza todo lo que aún sea manual
  2. Implementa pruebas de rendimiento y estrés automatizadas
  3. Expande a edge computing y 5G core
  4. Comparte tu experiencia con la comunidad (como hizo China Mobile)

## Herramientas recomendadas
Basado en lo que han usado China Mobile y otros operadores:
Propósito| Herramientas  
---|---  
CI/CD Pipeline| Jenkins, GitLab CI  
Infraestructura como Código| Ansible, Terraform  
Contenedores| Docker, Kubernetes  
Pruebas| pytest, Cucumber, Robot Framework  
Repositorio| GitLab, Nexus, Artifactory  
Monitoreo| Prometheus, Grafana, Elastic  
NFVI| OpenStack, Kubernetes  
Orquestación NFV| Open Source MANO (OSM), Open Network Automation Platform (ONAP)  
## El rol del operador está cambiando
Y esto es quizá lo más importante. Durante años, los operadores telco fueron **compradores pasivos** de tecnología. Llegaba el vendor, instalaba, configurada, y el operador solo operaba.
DevIntOps exige que el operador se convierta en un **integrador activo**. Ya no basta con tener ingenieros que sepan operar la red. Necesitas ingenieros que sepan:
  * Automatizar despliegues con Ansible y Python
  * Configurar pipelines CI/CD
  * Escribir pruebas automatizadas
  * Diseñar modelos de datos estandarizados
  * Integrar APIs de diferentes vendors

Es un salto enorme, pero también es una oportunidad. Los operadores que desarrollen esta capacidad interna van a depender menos de los vendors y van a tener redes más estables, más rápidas y más baratas de operar.
* * *
DevIntOps no es un concepto académico ni una moda pasajera. Es una respuesta práctica a un problema real: la integración multi-vendor en entornos NFV es el cuello de botella de la transformación digital de las telcos.
China Mobile demostró que funciona. Otros operadores están siguiendo el camino. Las herramientas son open source y accesibles. La pregunta no es si deberías adoptarlo, sino **cuánto tiempo más puedes permitirte no hacerlo**.
Porque mientras tanto, tus competidores ya están automatizando sus laboratorios de integración, acortando sus ciclos de despliegue, y detectando problemas antes de que afecten a sus usuarios.
Y en esta industria, el que llega segundo, llega tarde.
* * *
_Este artículo es una exploración profunda del modelo DevIntOps, basado en la experiencia documentada de China Mobile y otros operadores que están transformando la manera en que se integran y despliegan redes virtualizadas. Si trabajas en operaciones telco y esto te resonó, me encantaría saber tu experiencia._
