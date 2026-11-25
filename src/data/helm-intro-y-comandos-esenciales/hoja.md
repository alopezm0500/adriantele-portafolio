# Helm — intro y comandos esenciales

> Apunte rápido para cuando aparezcan comandos de Helm en el trabajo (IMS sobre OpenShift) o en el lab.
> Helm (con minúscula) viene de *helmsman*, timonel — no es acrónimo.

## La idea en una frase

Kubernetes te hace aplicar YAML uno por uno; Helm empaqueta un montón de YAML parametrizado en un **chart** y le da **memoria de lo que desplegó**.

## Conceptos mínimos

- **Chart** — carpeta con `Chart.yaml` (metadatos), `templates/` (YAML con huecos `{{ .Values.algo }}`) y `values.yaml` (defaults). Es el "paquete".
- **Values** — los parámetros con los que se renderiza el chart. Pueden venir de `values.yaml`, de `-f archivo.yaml` o de `--set clave=valor`.
- **Release** — el resultado de instalar un chart con un nombre, dentro de un namespace. Helm guarda un registro de cada release (por defecto como Secret en el cluster).
- **Revisión** — cada `upgrade` crea una revisión nueva del release. Eso es lo que hace posible el `rollback`.
- **Repositorio** — de dónde se descargan charts de terceros (`helm repo add`).

Diferencia clave frente a aplicar YAML a mano: como Helm sabe **qué** creó, puede actualizar, revertir y borrar de forma limpia. Y el mismo chart sirve para dev/pre/prod cambiando solo los values.

Nota de versión: Helm 2 necesitaba Tiller (un pod con permisos en el cluster). Helm 3 ya no — habla directo con el API usando tu kubeconfig. Si ves `helm init` o Tiller en una guía, la guía es vieja.

## Los comandos que estaba viendo

### `helm get values <release>`

Muestra **con qué valores está corriendo un release ya desplegado**.

- Sin flags: solo los *overrides* que se pasaron explícitamente (lo que el operador puso).
- Con `-a` / `--all`: el set completo ya computado (defaults del chart + overrides).

Es el comando de diagnóstico número uno cuando la pregunta es *"¿por qué este release salió así y no como dice el values.yaml del repo?"*.

### `helm upgrade <release> <chart> -f valores.yaml`

Aplica una configuración nueva sobre un release **existente**, sin borrarlo ni recrearlo. Cada ejecución crea una revisión nueva, así que siempre hay a dónde regresar.

Flags que valen oro:

- `-i` / `--install` — instala si no existe (idempotente, ideal para pipelines)
- `--dry-run` — renderiza y valida sin tocar el cluster (`--dry-run=server` valida además contra el API)
- `--atomic` — si el upgrade falla, revierte solo (implica `--wait`)
- `--wait` + `--timeout 10m` — no cantar victoria hasta que los pods estén listos
- `-n <namespace>`, `--create-namespace`
- `--version <versión del chart>` — ojo: es la versión del *chart*, no la de la app
- `--reuse-values` / `--reset-values` — con cuidado, ver gotchas
- `--set clave=valor` — cómodo para pruebas rápidas; en producción mejor `-f`
- `--force` — recrea recursos en vez de actualizarlos (ventana de indisponibilidad)
- `--cleanup-on-fail` — borra lo nuevo si el upgrade falla

## Receta de diagnóstico ("¿por qué se ve así?")

```bash
helm list -A                          # qué releases existen y en qué namespace
helm status <release> -n <ns>         # estado actual
helm get values <release> -a          # lo que quedó aplicado (defaults + overrides)
helm get manifest <release>           # el YAML final ya renderizado
helm show values <chart>              # lo que el chart trae por defecto
helm history <release>                # qué revisión cambió qué, y por qué
```

Con esos cinco se resuelve la gran mayoría de los "no entiendo por qué este deployment tiene esa imagen / esos recursos / ese replicas".

## Esenciales por orden de uso

**Descubrimiento**
- `helm repo add <nombre> <url>`, `helm repo update`
- `helm search repo <término>`
- `helm show chart|values|readme <chart>`

**Ciclo de vida**
- `helm install <release> <chart> -n <ns> -f valores.yaml`
- `helm list -A`
- `helm status <release>`
- `helm history <release>`
- `helm rollback <release> <revisión>`
- `helm uninstall <release> -n <ns>`

**Autoría y CI (sin cluster)**
- `helm create <nombre>` — esqueleto de chart
- `helm template <chart> -f valores.yaml` — renderiza local, ideal para revisar en un pipeline
- `helm lint <chart>`
- `helm dependency update` / `build`
- `helm package <chart>` — empaqueta el `.tgz` para publicarlo

**Plugin que casi debería ser estándar**
- **helm-diff** → `helm diff upgrade` muestra el diff real antes de aplicar. Es el seguro contra sorpresas.

## Gotchas que suelen morder

- **Precedencia de values**: gana el último que aparece en la línea de comandos; los `--set` van al final y pisan a los `-f`. Con varios `-f`, el último archivo gana en las claves repetidas.
- **`--reuse-values`** arrastra los values del release anterior y puede producir *drift* silencioso: el repo dice una cosa y el cluster otra. Es preferible declarar siempre los values completos con `-f`.
- **Campos inmutables de K8s**: `selector` de un Deployment, ciertos campos de un Service, etc. no los puede cambiar un upgrade — Helm falla y toca borrar/recrear o parchear aparte.
- **Secretos en values**: los values quedan guardados en el historial del release y en el `values.yaml`. Las contraseñas van por `--set` desde variable de entorno, por un Secret externo o con cifrado (SOPS / sealed-secrets), nunca en texto plano en el repo.
- **`--set` con listas y strings raros** rompe fácil la sintaxis; para eso, mejor un archivo de values.
- **Rollback no revierte datos**: si la revisión anterior cambió un esquema o migró algo, volver atrás deja la app apuntando a un estado inconsistente.

## Contexto propio

- Kubernetes sigue en el **anillo 4 del radar tecnológico** (ignorar hasta que un cliente o el empleo lo pida); en el anillo 2 solo conceptual. Este apunte entra como material de consulta, no como cambio de rumbo.
- Punto de conexión real: las aplicaciones IMS del trabajo corren sobre OpenShift, donde conviven Helm, `oc` (CLI de OpenShift) y Operator Lifecycle Manager (OLM). Si el equipo usa ambas cosas, vale saber que un Operator empaqueta y opera, un chart solo despliega.

## Pendiente

- [ ] Ver el chart o el `values.yaml` concreto que está usando el equipo y explicarlo línea por línea (anonimizado si viene del trabajo).
- [ ] Probar `helm template` contra un chart de ejemplo en el lab para ver el renderizado lado a lado con el `helm get manifest`.
