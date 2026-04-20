/**
 * Lazy `import()` map for highlight.js grammars (tree-shaken per language).
 * Unknown language ids fall back to the plaintext grammar registered under that id.
 */
export const HLJS_LANGUAGE_LOADERS = {
  plaintext: () => import("highlight.js/lib/languages/plaintext"),
  bash: () => import("highlight.js/lib/languages/bash"),
  c: () => import("highlight.js/lib/languages/c"),
  cpp: () => import("highlight.js/lib/languages/cpp"),
  css: () => import("highlight.js/lib/languages/css"),
  go: () => import("highlight.js/lib/languages/go"),
  java: () => import("highlight.js/lib/languages/java"),
  javascript: () => import("highlight.js/lib/languages/javascript"),
  json: () => import("highlight.js/lib/languages/json"),
  kotlin: () => import("highlight.js/lib/languages/kotlin"),
  markdown: () => import("highlight.js/lib/languages/markdown"),
  python: () => import("highlight.js/lib/languages/python"),
  rust: () => import("highlight.js/lib/languages/rust"),
  scss: () => import("highlight.js/lib/languages/scss"),
  sql: () => import("highlight.js/lib/languages/sql"),
  typescript: () => import("highlight.js/lib/languages/typescript"),
  xml: () => import("highlight.js/lib/languages/xml"),
  yaml: () => import("highlight.js/lib/languages/yaml"),
};

const LANGUAGE_ALIASES = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  sh: "bash",
  shell: "bash",
  yml: "yaml",
  md: "markdown",
  html: "xml",
  svg: "xml",
};

/**
 * @param {string | null | undefined} raw
 * @returns {string}
 */
export function normalizeHljsLanguageId(raw) {
  if (!raw || typeof raw !== "string") return "plaintext";
  const lower = raw.trim().toLowerCase();
  if (lower === "chart") return "plaintext";
  return LANGUAGE_ALIASES[lower] || lower;
}

