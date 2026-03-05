/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.html", "./src/**/*.js"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    screens: {
      tablet: "769px",
      desktop: "1024px",
      widescreen: "1216px",
    },
    extend: {
      colors: {
        primary: "#2e86b7",
        "primary-hover": "#2570a0",
        github: "#24292e",
        "link-hover": "#358cbc",
      },
      maxWidth: {
        container: "1179px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Fira Sans"',
          '"Open Sans"',
          '"Helvetica Neue"',
          "sans-serif",
        ],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
