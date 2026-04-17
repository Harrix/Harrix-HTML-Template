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

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | One-off development build            |
| `npm run watch` | Development build with file watching |
| `npm run build` | Production build + HTML formatting   |

## Project structure

```text
src/
├── fonts/          Fira Sans & JetBrains Mono (.woff2)
├── html/
│   ├── includes/   Header and footer partials (Eta); see `includes/i18n/html-strings.json`
│   └── views/      Page templates (index, article, with-sidebar)
├── js/             JavaScript entry points and modules
├── scss/           SCSS styles (Bulma overrides, dark theme, highlight, etc.)
├── favicon/        Favicon assets
├── img/            Static images
└── uploads/        Demo content (images, STL files)
```

## Frontend notes

### HTML includes templating

Partials in `src/html/includes/` are rendered by the `include(...)` helper in `webpack.config.js`, which uses [Eta](https://www.npmjs.com/package/eta) with **`useWith: true`** and **`autoEscape: true`** (same as in that file). With auto-escaping enabled, `<%=` outputs HTML-escaped text; use **`<%~ … %>`** for trusted raw markup (for example nested `include(...)` results that must stay HTML, as in `header.html`).

Page templates in `src/html/views/` are compiled by HtmlWebpackPlugin’s built-in **lodash** `_.template` loader, not Eta: there **`<%= … %>`** interpolates without HTML escaping and **`<%- … %>`** uses lodash’s escaped interpolation. Only the includes pipeline uses the Eta instance above.

### Internationalization (UI strings)

#### Runtime (JavaScript)

In-app labels (search placeholder, theme toggle, TOC, code copy, and similar) are translated when `<html lang>` starts with `ru` (see [`src/js/_locale.js`](src/js/_locale.js) and [`src/js/_locale-ru.js`](src/js/_locale-ru.js)). For English or other languages, keys are shown as written in the source. Add another map and extend `_locale.js` if you need more locales.

#### Static HTML partials (build time)

Shell strings in [`src/html/includes/`](src/html/includes/) (navbar chrome, `aria-label`, placeholders, `lang` on `<html>`) are **not** switched by changing `lang` in the browser. They come from the Eta `include(...)` pipeline in [`webpack.config.js`](webpack.config.js).

**Default:** Russian (`ru`) for both the document language and the string map. This matches the historical demo content in [`src/html/views/`](src/html/views/).

**Ways to ship another language:**

1. **Whole-site locale (recommended for one language per build)** — set `HTML_I18N_LOCALE` to a value that starts with `en` for English, or omit it / use anything else for Russian. Examples: `HTML_I18N_LOCALE=en npm run build` (Unix shell), or PowerShell: `$env:HTML_I18N_LOCALE = "en"; npm run build`. Strings live in [`src/html/includes/i18n/html-strings.json`](src/html/includes/i18n/html-strings.json); add keys there and use `<%= i18n.yourKey %>` in partials.

2. **Per-page override** — pass `htmlLang: "en"` (or `"ru"`) in the object passed from a view template into `include("header.html", data)`. Nested partials inherit the same locale even when called as `include("mobile-top-nav.html", {})` because the bundler keeps a short include stack.

3. **Separate markup per locale** — duplicate or branch view/partial files (for example different `header` files or site variants) if you need large content differences beyond the shared dictionary.

Keep **`<html lang>`** aligned with [`_locale.js`](src/js/_locale.js): use `ru` when you rely on Russian JS strings, and `en` (or a non-`ru` prefix) when you want English runtime labels.

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

## 📄 License

This project is licensed under the [MIT License](https://github.com/Harrix/Harrix-HTML-Template/blob/main/LICENSE.md).

## 👤 Author

Author: [Anton Sergienko](https://github.com/Harrix).
