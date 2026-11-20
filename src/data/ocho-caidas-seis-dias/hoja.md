# Ocho caídas en seis días

Nota de lectura sobre el "Analyst Angle" de RCR Wireless del 19 de noviembre de 2026, firmado por Vish Nandlall: <https://rcrwireless.com/20261119/analyst-angle/eight-outages-in-six-days-what-is-going-on-analyst-angle>

## 1. La tesis

Entre el 12 y el 17 de noviembre fallaron Microsoft, la FAA, Workday, AWS, JPMorgan Chase, United Airlines, Apple y la NSA. La pieza se pregunta si hay una causa común —ataque coordinado, dependencia compartida, código generado por IA— y termina en otro lugar: lo que comparten los incidentes no es la causa, es la incapacidad de garantizar que un cambio o una acción de recuperación **se quede local**.

La IA puede estar subiendo la frecuencia con la que se crean las condiciones para ese tipo de falla. En estos ocho casos, no hay evidencia de que sea la causa.

## 2. Lo que sí se sostiene

**El control histórico es el mejor movimiento del texto.** El 19 de noviembre de 2009 la red FTI de la FAA ya había fallado con el mismo patrón: un contratista reemplazó un router durante una transición a fibra, el equipo nuevo heredó un error de ruteo introducido el mes anterior y una sentencia de configuración faltante anuló la separación entre redes. El tráfico se fue por un enlace Los Ángeles–Salt Lake City sin capacidad suficiente. El Inspector General del Departamento de Transporte documentó 129 instalaciones afectadas cuando se esperaban 21 y alrededor del 75% de las rutas bloqueadas durante cinco horas. Y un detalle que importa más que el router: un error en el filtrado de alarmas suprimió los avisos de utilización de CPU **en toda la red**, y el contratista investigó primero los cambios recientes equivocados. Ese apagón ocurrió siete años antes de que existieran herramientas de código con IA. El modo de falla es viejo; lo que puede ser nuevo es su ritmo.

**La aritmética de capacidad de Microsoft es correcta y replicable.** Un defecto de contención de locks entró en julio en los gateways de red de Microsoft 365 y vivió más de tres meses sin síntoma. Unas quince horas antes del apagón, el tráfico de Teams migró al gateway primario que también atiende Exchange Online, y cerca del 14% de esa flota ya estaba fuera de servicio por otra razón. Con demanda constante y reparto parejo, perder 14% de capacidad sube la carga promedio por servidor sobreviviente en 1/0.86 = 16.3%. Teams agregó demanda encima. Ahí despertó el defecto, el trabajo migró a los pares, los pares ya iban cargados, más de 80% de los servidores dejó de responder en menos de dos horas y el mecanismo de aislamiento entre particiones no contuvo la cascada. Las peticiones se acumularon mientras los servidores estaban caídos, lo que complicó la recuperación.

**La clase de falla tiene nombre.** Fallas metaestables: un sistema vulnerable pero funcional recibe un disparador y cae en un estado de sobrecarga que se sostiene por su propio comportamiento, así que quitar el disparador original ya no lo cura. El estudio de referencia (Huang et al., USENIX OSDI 2022) revisó 22 casos en 11 organizaciones. El autor advierte, con honestidad, que el reporte preliminar de Microsoft no establece del todo si el servicio siguió caído después de retirar la carga que inició todo, así que la clasificación exacta queda pendiente.

La lección operativa: la respuesta automática a la falla fue el arma. El failover es un amplificador de riesgo cuando la capacidad de reserva ya venía mermada.

## 3. Donde la pieza se resbala

**El dato más importante se despacha demasiado rápido.** Cisco ThousandEyes registró 419 eventos globales de red en la semana del 9 al 15 de noviembre, contra 128 en la misma semana de 2025. Un salto de 3.3x no se puede archivar con "no pude establecer si la cobertura de monitoreo es comparable": si la cobertura sí lo es, ese número por sí solo describe un cambio de confiabilidad. El dato semanal —234 a 282 eventos en EE.UU., +20%— es más creíble como señal y queda enterrado. La serie de Downdetector (~6 millones de reportes en una semana, casi 3.9 millones atribuidos a la caída de Microsoft en 60 horas) mide percepción de usuarios, no número de fallas: sirve para explicar por qué el cluster se sintió enorme, no para demostrar que lo fue.

**Selección después de la falla.** El texto lo admite en el primer apartado —elegir a los protagonistas cuando ya fallaron hace que una semana ordinaria parezca extraordinaria— y luego razona sobre los ocho elegidos de todos modos. Falta denominador: sobre cuántos sistemas, con qué definición de incidente.

**El "18 a 24 meses" es intuición con formato de pronóstico.** El resto del texto se cuida de no afirmar lo que no puede sostener; esa frase no tiene mecanismo ni medición detrás, y es la más débil de la pieza. Lo rescatable es que deja escrito cómo se falsificaría: si los reportes finales siguen mostrando un cambio rutinario detrás de cada caída, gana la explicación de inestabilidad; si aparece una sin cambio alguno detrás, el escenario de ataque merece otra mirada.

**Faros es correlacional y viene de un proveedor del ramo.** Los números del estudio 2026 (22,000 desarrolladores, 4,000 equipos): incidentes mensuales +125.4%, incidentes por pull request +14.5%, tiempo en QA +300.6%, PRs fusionados sin revisión +76.3%. Aun aceptándolos, las empresas con mayor adopción de IA son también las más grandes y las que más despliegan, así que parte del efecto está confundido. El propio cálculo del autor —2.254 / 1.145 = 1.97, es decir, cerca de 97% más volumen de pull requests— lo marca como inferencia, y hace bien.

**El estudio de cobertura de tests no tiene línea base humana.** 4,882 pull requests generados por agentes, 49.6% de los que tocan código ejecutable también modifican tests, y el manejo de errores entre los elementos menos cubiertos (hasta 86% en Java y 81% en Python en las mediciones reportadas). Señala una brecha real justo en las rutas que importan durante una falla parcial, pero sin comparación contra humanos no prueba que los agentes sean peores. El autor lo dice; conviene no citarlo sin esa frase.

## 4. Las hipótesis que le faltaron

Probo cinco y descartó con evidencia. Faltaron dos que en telecom son las primeras sospechosas:

**Recorte de personal y mantenimiento diferido.** La FTI no falla por un router: falla por una red envejecida operada por contrato, con cambios locales mal contenidos y diagnóstico lento. Es el mismo patrón que aparece cuando una operadora recorta opex, externaliza la operación del core y se queda con menos gente que entienda la topología real.

**Deuda de observabilidad.** La lección de 2009 no es del router, es de las alarmas: algo que debía suprimirse en un equipo quedó suprimido en todos. Monitoreo y redundancia pueden existir en el diagrama y fallar exactamente en las condiciones para las que se diseñaron. Eso no es un problema de IA; es de verificación del propio sistema de vigilancia.

Y una que es específica del dominio y el texto no menciona aunque el título lo promete: en una red de voz el amplificador suele ser el estado pegajoso —registro IMS, HSS, sesiones, contextos—. Ahí el "failover" no es mover tráfico: es una tormenta de re-registro contra un elemento que ya viene degradado. Su apartado "What I would change in a telecom network" se queda en consejo genérico de SRE: inventario de runtimes escondidos en appliances y contenedores, mapa de dependencias, pruebas con tráfico representativo y capacidad degradada, despliegue por dominio de falla, ruta de aislamiento probada, arnés de inyección de fallas. Correcto, pero aplicable a cualquier empresa; no aterriza en la red.

## 5. Cuatro preguntas para llevarse al trabajo

1. ¿Qué cambios de nuestro core pueden cruzar límites que se supone los contienen? Nombrar tres.
2. El filtrado de alarmas: ¿está verificado que es local o podría estar silenciando algo en toda la red?
3. ¿Los controles de sobrecarga aguantan un 503 con Retry-After, o el fallback convierte una falla parcial en tormenta de reintentos?
4. ¿El último cambio planeado se probó con 14% menos capacidad? Casi nadie prueba N-1-1.

## 6. Ficha para contenido

Ángulo posible y con tinte social, no de catálogo: **el failover que empeora el fallo**. Cómo una red sana se tumba sola con su propio mecanismo de respaldo, explicado con estándares públicos (RFC 3261, RFC 3312, GSMA IR.92, specs 3GPP) y sin un solo dato de la operación. Engancha con lo que pasó en noviembre sin tener que citar a Microsoft.

Datos de costo de indisponibilidad: si se usan cifras de Uptime Institute o ITIC, van atribuidas a la fuente y con fecha, y cualquier número que no se haya leído en el documento original se marca (verificar).

## Nota metodológica

Las cifras de esta nota provienen del artículo y de las fuentes que él cita; no se verificaron una por una contra los documentos originales. Los documentos que conviene leer completos antes de citarlos en público: el reporte preliminar de Microsoft (EX1550543/MO1550821), el informe del Inspector General del DOT sobre la FTI (2010) y el estudio de fallas metaestables de OSDI 2022. El reporte final de Microsoft estaba anunciado para el 20 de noviembre de 2026 y puede mover las conclusiones técnicas.
