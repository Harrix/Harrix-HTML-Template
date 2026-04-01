# Harrix-HTML-Template

HTML template for Harrix project pages, built with [Bulma](https://bulma.io/), [Webpack](https://webpack.js.org/), and [Node.js](https://nodejs.org/).

Features: light/dark theme, syntax highlighting (highlight.js), KaTeX formulas, lightGallery image viewer, STL 3D model viewer, responsive layout.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+ (22 LTS recommended)
- npm (comes with Node.js)

### Installation

```bash
git clone https://github.com/Harrix/Harrix-HTML-Template.git
cd Harrix-HTML-Template
npm install
```

### Development

Start the dev server with hot reload:

```bash
npm start
```

The site opens at `http://localhost:9000`.

### Build

Create a production build in the `dist/` folder:

```bash
npm run build
```

### Other scripts

| Command | Description |
| --------------- | ------------------------------------------ |
| `npm run dev` | One-off development build |
| `npm run watch` | Development build with file watching |
| `npm run build` | Production build + HTML formatting |

## Project structure

```text
src/
├── fonts/          Fira Sans & JetBrains Mono (.woff2)
├── html/
│   ├── includes/   Header and footer partials
│   └── views/      Page templates (index, article, with-sidebar)
├── js/             JavaScript entry points and modules
├── scss/           SCSS styles (Bulma overrides, dark theme, highlight, etc.)
├── favicon/        Favicon assets
├── img/            Static images
└── uploads/        Demo content (images, STL files)
```

## Frontend notes

### Internationalization (UI strings)

In-app labels (search placeholder, theme toggle, TOC, code copy, and similar) are translated when `<html lang>` starts with `ru` (see [`src/js/_locale.js`](src/js/_locale.js) and [`src/js/_locale-ru.js`](src/js/_locale-ru.js)). For English or other languages, keys are shown as written in the source. Add another map and extend `_locale.js` if you need more locales.

### `url()` in CSS and SCSS

`css-loader` uses `url: true`, so file references inside `url(...)` in project SCSS and in vendor CSS (lightGallery, KaTeX) are resolved by Webpack and emitted according to the asset rules in `webpack.config.js` (fonts, images, and so on). `data:` URLs (for example icons embedded in CSS variables) are left as-is. CopyPlugin still copies `src/fonts`, `src/img`, favicon, uploads, and the explicit `node_modules` font/image paths so anything not referenced through `url()` in the bundle remains available in `dist/`.

### SCSS and `!important`

Some components override Bulma with high-specificity rules; a few SCSS partials use `!important` on purpose (for example expanded mobile menu and split docs layout). Prefer tightening selectors or `@layer` before adding new `!important` declarations.

### Mobile menu and TOC mirroring

The mobile top bar clones the desktop navbar menu and the in-page TOC (`cloneNode`) into panels. If you change IDs or structure in the header or TOC markup, update the cloning logic in [`src/js/_expanded-menu.js`](src/js/_expanded-menu.js) and [`src/js/_mobile-top-nav.js`](src/js/_mobile-top-nav.js) so mirrored DOM and event handlers stay correct.

### Linting

```bash
npm run lint
```

## Choosing a CSS framework

| Name             | Downloads per week | Link                                             |
| ---------------- | ------------------ | ------------------------------------------------ |
| bootstrap        | 5 426 048          | <https://www.npmjs.com/package/bootstrap>        |
| Bulma            | 256 447            | <https://www.npmjs.com/package/bulma>            |
| tailwindcss      | 8 817 268          | <https://www.npmjs.com/package/tailwindcss>      |
| foundation-sites | 103 577            | <https://www.npmjs.com/package/foundation-sites> |

## 📄 License

This project is licensed under the [MIT License](https://github.com/Harrix/Harrix-HTML-Template/blob/main/LICENSE.md).

## 👤 Author

Author: [Anton Sergienko](https://github.com/Harrix).
