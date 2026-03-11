/** PurgeCSS config. Font Awesome classes (e.g. svg-inline--fa, fa-spin) are added at runtime by JS, so they must be safelisted. */
module.exports = {
  content: ["dist/**/*.html", "dist/js/app.js"],
  css: ["dist/css/app.css"],
  output: "dist/css/",
  safelist: {
    greedy: [/^fa-/, /^svg-inline--fa/],
  },
};
