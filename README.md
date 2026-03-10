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
