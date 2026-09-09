# Portafolio / Blog de Adrian (Astro)

## 🎨 Nota de diseño — paleta Gruvbox

El sitio usa la paleta **Gruvbox dark** (morhetz/gruvbox). Aprobada por Adrian el 2026-09-09: **se queda** como tema oficial del sitio. No cambiarla sin avisar.

- Fondo `#282828` · tarjetas `#3c3836` · bordes `#504945` · texto `#ebdbb2` · secundario `#a89984`
- Acento (enlaces / "índigo"): `#83a598` (gruvbox blue)
- Los tokens viven en el bloque `:root` de `src/layouts/Layout.astro` (`--bg`, `--card`, `--text`, `--muted`, `--indigo`)
- Colores por categoría en `CAT_COLORS` (`src/lib/blog.ts`), mapeados a Gruvbox: tech-en-rojo `#fb4934`, tech-humano `#fe8019`, tech-abierto `#b8bb26`, techco-e-ia `#83a598`, portafolio `#d3869b` (mauve)… fallback `#d3869b`

```sh
npm create astro@latest -- --template minimal
```

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put your Astro/React/Vue/Svelte/Preact components.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
