function loadChunk(importPromise, label) {
  void importPromise.catch((err) => {
    console.error(`Failed to load ${label} chunk:`, err);
  });
}

export function bootLazyHeavyLibs() {
  if (document.querySelector(".mermaid")) {
    loadChunk(
      import(/* webpackChunkName: "mermaid/mermaid" */ "./mermaid.js").then((m) => m.startMermaid()),
      "mermaid",
    );
  }
  if (document.querySelector("pre.chart, code.language-chart")) {
    loadChunk(
      import(/* webpackChunkName: "charts/charts" */ "./charts.js").then((m) => m.startCharts()),
      "charts",
    );
  }
}
