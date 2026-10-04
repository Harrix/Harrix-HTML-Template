/**
 * Ant Design–style color picker (palette, hue/alpha, HEX / HSB / RGB formats).
 * Progressive enhancement for `[data-h-color-picker]`.
 */

/**
 * @typedef {{ h: number, s: number, v: number, a: number }} Hsva
 * @typedef {"hex" | "hsb" | "rgb"} ColorFormat
 */

/**
 * @param {string} hex
 * @returns {{ r: number, g: number, b: number } | null}
 */
function parseHex(hex) {
  const raw = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(raw)) return null;
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
  };
}

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 */
function rgbToHex(r, g, b) {
  const to = (n) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {{ h: number, s: number, v: number }}
 */
function rgbToHsv(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max };
}

/**
 * @param {number} h
 * @param {number} s
 * @param {number} v
 */
function hsvToRgb(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (h < 60) {
    rp = c;
    gp = x;
  } else if (h < 120) {
    rp = x;
    gp = c;
  } else if (h < 180) {
    gp = c;
    bp = x;
  } else if (h < 240) {
    gp = x;
    bp = c;
  } else if (h < 300) {
    rp = x;
    bp = c;
  } else {
    rp = c;
    bp = x;
  }
  return {
    r: (rp + m) * 255,
    g: (gp + m) * 255,
    b: (bp + m) * 255,
  };
}

/**
 * @param {Hsva} hsva
 */
function hsvaToCss(hsva) {
  const { r, g, b } = hsvToRgb(hsva.h, hsva.s, hsva.v);
  if (hsva.a >= 1) return rgbToHex(r, g, b);
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${roundAlpha(hsva.a)})`;
}

/**
 * @param {number} a
 */
function roundAlpha(a) {
  return Math.round(a * 100) / 100;
}

/**
 * @param {string} value
 * @param {boolean} [percent]
 */
function parseChannel(value, percent = false) {
  const n = Number.parseFloat(String(value).replace("%", "").trim());
  if (!Number.isFinite(n)) return null;
  if (percent) return Math.min(100, Math.max(0, n)) / 100;
  return n;
}

/**
 * @param {HTMLElement} root
 */
function bindColorPicker(root) {
  const trigger = root.querySelector("[data-h-color-trigger]");
  const dropdown = root.querySelector("[data-h-color-dropdown]");
  const swatchColor = root.querySelector("[data-h-color-swatch]");
  const valueEl = root.querySelector("[data-h-color-value]");
  const palette = root.querySelector("[data-h-color-palette]");
  const paletteHandle = root.querySelector("[data-h-color-palette-handle]");
  const hueTrack = root.querySelector("[data-h-color-hue]");
  const hueHandle = root.querySelector("[data-h-color-hue-handle]");
  const alphaTrack = root.querySelector("[data-h-color-alpha]");
  const alphaHandle = root.querySelector("[data-h-color-alpha-handle]");
  const previewColor = root.querySelector("[data-h-color-preview]");
  const formatRoot = root.querySelector("[data-h-color-format]");
  const formatTrigger = root.querySelector("[data-h-color-format-trigger]");
  const formatLabel = root.querySelector("[data-h-color-format-label]");
  const formatMenu = root.querySelector("[data-h-color-format-menu]");
  const formatOptions = root.querySelectorAll("[data-h-color-format-option]");
  const channelsHex = root.querySelector("[data-h-color-channels-hex]");
  const channelsHsb = root.querySelector("[data-h-color-channels-hsb]");
  const channelsRgb = root.querySelector("[data-h-color-channels-rgb]");
  const hexInput = root.querySelector("[data-h-color-hex]");
  const hInput = root.querySelector("[data-h-color-h]");
  const sInput = root.querySelector("[data-h-color-s]");
  const vInput = root.querySelector("[data-h-color-v]");
  const rInput = root.querySelector("[data-h-color-r]");
  const gInput = root.querySelector("[data-h-color-g]");
  const bInput = root.querySelector("[data-h-color-b]");
  const alphaInputs = root.querySelectorAll("[data-h-color-alpha-input]");

  if (
    !(trigger instanceof HTMLButtonElement) ||
    !(dropdown instanceof HTMLElement) ||
    !(swatchColor instanceof HTMLElement) ||
    !(valueEl instanceof HTMLElement) ||
    !(palette instanceof HTMLElement) ||
    !(paletteHandle instanceof HTMLElement) ||
    !(hueTrack instanceof HTMLElement) ||
    !(hueHandle instanceof HTMLElement) ||
    !(alphaTrack instanceof HTMLElement) ||
    !(alphaHandle instanceof HTMLElement) ||
    !(previewColor instanceof HTMLElement) ||
    !(formatRoot instanceof HTMLElement) ||
    !(formatTrigger instanceof HTMLButtonElement) ||
    !(formatLabel instanceof HTMLElement) ||
    !(formatMenu instanceof HTMLElement) ||
    !(channelsHex instanceof HTMLElement) ||
    !(channelsHsb instanceof HTMLElement) ||
    !(channelsRgb instanceof HTMLElement) ||
    !(hexInput instanceof HTMLInputElement) ||
    !(hInput instanceof HTMLInputElement) ||
    !(sInput instanceof HTMLInputElement) ||
    !(vInput instanceof HTMLInputElement) ||
    !(rInput instanceof HTMLInputElement) ||
    !(gInput instanceof HTMLInputElement) ||
    !(bInput instanceof HTMLInputElement)
  ) {
    return;
  }

  const initial = parseHex(root.dataset.color || "#2e86b7") || { r: 46, g: 134, b: 183 };
  const hsv = rgbToHsv(initial.r, initial.g, initial.b);
  /** @type {Hsva} */
  const state = { h: hsv.h, s: hsv.s, v: hsv.v, a: 1 };
  /** @type {ColorFormat} */
  let format = "hex";

  const closeFormatMenu = () => {
    formatMenu.hidden = true;
    formatRoot.classList.remove("is-open");
    formatTrigger.setAttribute("aria-expanded", "false");
  };

  const openFormatMenu = () => {
    formatMenu.hidden = false;
    formatRoot.classList.add("is-open");
    formatTrigger.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    closeFormatMenu();
    dropdown.hidden = true;
    root.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    dropdown.hidden = false;
    root.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  };

  /**
   * @param {ColorFormat} next
   */
  const setFormat = (next) => {
    format = next;
    formatLabel.textContent = next.toUpperCase();
    channelsHex.hidden = next !== "hex";
    channelsHsb.hidden = next !== "hsb";
    channelsRgb.hidden = next !== "rgb";
    formatOptions.forEach((option) => {
      if (!(option instanceof HTMLElement)) return;
      option.classList.toggle("is-active", option.dataset.hColorFormatOption === next);
    });
    closeFormatMenu();
    render();
  };

  /**
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {string} hex
   */
  const formatTriggerValue = (r, g, b, hex) => {
    if (format === "rgb") return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    if (format === "hsb") {
      return `hsb(${Math.round(state.h)}, ${Math.round(state.s * 100)}%, ${Math.round(state.v * 100)}%)`;
    }
    return hex;
  };

  const render = () => {
    const { r, g, b } = hsvToRgb(state.h, state.s, state.v);
    const hex = rgbToHex(r, g, b);
    const solid = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    const withAlpha = hsvaToCss(state);
    const hueRgb = hsvToRgb(state.h, 1, 1);
    const hueColor = `rgb(${Math.round(hueRgb.r)}, ${Math.round(hueRgb.g)}, ${Math.round(hueRgb.b)})`;
    const alphaText = `${Math.round(state.a * 100)}%`;

    swatchColor.style.background = withAlpha;
    valueEl.textContent = formatTriggerValue(r, g, b, hex);
    valueEl.classList.toggle("is-mono-upper", format === "hex");
    previewColor.style.background = withAlpha;
    palette.style.background = `
      linear-gradient(to top, #000, transparent),
      linear-gradient(to right, #fff, ${hueColor})
    `;
    alphaTrack.style.setProperty("--h-color-alpha-end", solid);
    paletteHandle.style.left = `${state.s * 100}%`;
    paletteHandle.style.top = `${(1 - state.v) * 100}%`;
    hueHandle.style.left = `${(state.h / 360) * 100}%`;
    alphaHandle.style.left = `${state.a * 100}%`;

    if (document.activeElement !== hexInput) hexInput.value = hex;
    if (document.activeElement !== hInput) hInput.value = String(Math.round(state.h));
    if (document.activeElement !== sInput) sInput.value = `${Math.round(state.s * 100)}%`;
    if (document.activeElement !== vInput) vInput.value = `${Math.round(state.v * 100)}%`;
    if (document.activeElement !== rInput) rInput.value = String(Math.round(r));
    if (document.activeElement !== gInput) gInput.value = String(Math.round(g));
    if (document.activeElement !== bInput) bInput.value = String(Math.round(b));
    alphaInputs.forEach((input) => {
      if (input instanceof HTMLInputElement && document.activeElement !== input) input.value = alphaText;
    });

    root.dataset.color = hex;
    root.dataset.format = format;
    root.dispatchEvent(
      new CustomEvent("h-color-change", {
        bubbles: true,
        detail: { hex, alpha: state.a, css: withAlpha, format },
      }),
    );
  };

  /**
   * @param {HTMLElement} el
   * @param {(ratioX: number, ratioY: number) => void} onMove
   */
  const bindDrag = (el, onMove) => {
    /** @param {PointerEvent} event */
    const update = (event) => {
      const rect = el.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
      onMove(x, y);
      render();
    };

    el.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      el.setPointerCapture(event.pointerId);
      update(event);
    });
    el.addEventListener("pointermove", (event) => {
      if (!el.hasPointerCapture(event.pointerId)) return;
      update(event);
    });
  };

  bindDrag(palette, (x, y) => {
    state.s = x;
    state.v = 1 - y;
  });
  bindDrag(hueTrack, (x) => {
    state.h = x * 360;
  });
  bindDrag(alphaTrack, (x) => {
    state.a = x;
  });

  trigger.addEventListener("click", () => {
    if (dropdown.hidden) open();
    else close();
  });

  formatTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    if (formatMenu.hidden) openFormatMenu();
    else closeFormatMenu();
  });

  formatOptions.forEach((option) => {
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!(option instanceof HTMLElement)) return;
      const next = option.dataset.hColorFormatOption;
      if (next === "hex" || next === "hsb" || next === "rgb") setFormat(next);
    });
  });

  hexInput.addEventListener("change", () => {
    const rgb = parseHex(hexInput.value);
    if (!rgb) {
      render();
      return;
    }
    const next = rgbToHsv(rgb.r, rgb.g, rgb.b);
    state.h = next.h;
    state.s = next.s;
    state.v = next.v;
    render();
  });

  const applyHsbInputs = () => {
    const h = parseChannel(hInput.value);
    const s = parseChannel(sInput.value, true);
    const v = parseChannel(vInput.value, true);
    if (h !== null) state.h = Math.min(360, Math.max(0, h));
    if (s !== null) state.s = s;
    if (v !== null) state.v = v;
    render();
  };

  const applyRgbInputs = () => {
    const r = parseChannel(rInput.value);
    const g = parseChannel(gInput.value);
    const b = parseChannel(bInput.value);
    if (r === null || g === null || b === null) {
      render();
      return;
    }
    const next = rgbToHsv(Math.min(255, Math.max(0, r)), Math.min(255, Math.max(0, g)), Math.min(255, Math.max(0, b)));
    state.h = next.h;
    state.s = next.s;
    state.v = next.v;
    render();
  };

  [hInput, sInput, vInput].forEach((input) => input.addEventListener("change", applyHsbInputs));
  [rInput, gInput, bInput].forEach((input) => input.addEventListener("change", applyRgbInputs));

  alphaInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!(input instanceof HTMLInputElement)) return;
      const a = parseChannel(input.value, true);
      if (a !== null) state.a = a;
      render();
    });
  });

  document.addEventListener("pointerdown", (event) => {
    if (!(event.target instanceof Node)) return;
    if (!formatMenu.hidden && formatRoot.contains(event.target)) return;
    if (!formatMenu.hidden) closeFormatMenu();
    if (dropdown.hidden) return;
    if (root.contains(event.target)) return;
    close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!formatMenu.hidden) {
      closeFormatMenu();
      return;
    }
    if (!dropdown.hidden) close();
  });

  setFormat("hex");
}

export function initColorPickers() {
  document.querySelectorAll("[data-h-color-picker]").forEach((root) => {
    if (root instanceof HTMLElement) bindColorPicker(root);
  });
}
