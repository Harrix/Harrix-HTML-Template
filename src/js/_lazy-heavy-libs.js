export function bootLazyHeavyLibs() {
  if (document.querySelector(".mermaid")) {
    void import(/* webpackChunkName: "mermaid/mermaid" */ "./mermaid.js").then((m) => m.startMermaid());
  }
  if (document.querySelector("pre.chart, code.language-chart")) {
    void import(/* webpackChunkName: "charts/charts" */ "./charts.js").then((m) => m.startCharts());
  }
}
