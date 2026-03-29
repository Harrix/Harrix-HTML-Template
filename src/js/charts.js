import Plotly from "plotly.js-dist-min";
import { THEME_STORAGE_KEY } from "./_constants.js";
import { safeStorageGetItem } from "./_storage.js";
import { onThemeToggle } from "./_theme-utils.js";

function getChartTheme() {
  const stored = safeStorageGetItem(THEME_STORAGE_KEY);
  const fromDom = document.documentElement.getAttribute("data-theme");
  const isDark =
    fromDom === "dark" ||
    stored === "dark" ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches && fromDom !== "light" && stored !== "light");
  return isDark ? "dark" : "light";
}

function getLayoutOverrides(theme) {
  if (theme !== "dark") return {};
  return {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: { color: "#e0e0e0" },
    xaxis: { gridcolor: "rgba(255,255,255,0.1)", zerolinecolor: "rgba(255,255,255,0.2)" },
    yaxis: { gridcolor: "rgba(255,255,255,0.1)", zerolinecolor: "rgba(255,255,255,0.2)" },
    colorway: ["#636efa", "#ef553b", "#00cc96", "#ab63fa", "#ffa15a", "#19d3f3", "#ff6692", "#b6e880", "#ff97ff", "#fecb52"],
  };
}

function getChartBlocks() {
  const byClass = document.querySelectorAll("pre.chart, pre > code.language-chart");
  const blocks = [];
  byClass.forEach((el) => {
    const pre = el.tagName === "PRE" ? el : el.closest("pre");
    if (pre && !pre.dataset.hChartProcessed) blocks.push(pre);
  });
  return blocks;
}

function getSpecFromBlock(pre) {
  const code = pre.querySelector("code.language-chart");
  const text = (code || pre).textContent?.trim() || "";
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function renderCharts() {
  const theme = getChartTheme();
  const layoutOverrides = getLayoutOverrides(theme);
  const blocks = getChartBlocks();
  if (blocks.length === 0) return;

  blocks.forEach((pre) => {
    const spec = getSpecFromBlock(pre);
    if (!spec || !spec.data) return;

    pre.dataset.hChartProcessed = "true";
    const container = document.createElement("div");
    container.className = "h-chart-container";
    pre.parentNode.insertBefore(container, pre);
    pre.remove();

    const data = Array.isArray(spec.data) ? spec.data : [spec.data];
    const layout = { autosize: true, ...spec.layout, ...layoutOverrides };
    const config = spec.config || { responsive: true };

    container._spec = { data: spec.data, layout: spec.layout, config: spec.config };
    Plotly.newPlot(container, data, layout, config);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCharts();

  onThemeToggle(() => {
    const containers = document.querySelectorAll(".h-chart-container");
    containers.forEach((el) => {
      const spec = el._spec;
      if (!spec) return;
      Plotly.purge(el);
      const wrapper = document.createElement("pre");
      wrapper.className = "chart";
      const code = document.createElement("code");
      code.className = "language-chart";
      code.textContent = JSON.stringify(spec, null, 2);
      wrapper.appendChild(code);
      el.parentNode.insertBefore(wrapper, el);
      el.remove();
    });
    setTimeout(renderCharts, 50);
  });
});
