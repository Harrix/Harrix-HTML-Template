import localeRu from "./_locale-ru.js";

const CACHE = { lang: null, map: null };

function resolveMap() {
  const raw = (document.documentElement.getAttribute("lang") || "en").toLowerCase();
  if (CACHE.lang === raw && CACHE.map) return CACHE.map;
  CACHE.lang = raw;
  CACHE.map = raw.startsWith("ru") ? localeRu : {};
  return CACHE.map;
}

/**
 * UI strings: Russian when `<html lang>` starts with `ru`, otherwise English (source keys).
 */
export function translate(string) {
  const map = resolveMap();
  return map[string] ?? string;
}
