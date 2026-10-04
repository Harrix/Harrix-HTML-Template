/**
 * Ant Design–style color picker (trigger + sat/val panel, hue, alpha, HEX).
 * Progressive enhancement for `[data-h-color-picker]`.
 */

/**
 * @typedef {{ h: number, s: number, v: number, a: number }} Hsva
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
  const hexInput = root.querySelector("[data-h-color-hex]");
  const alphaInput = root.querySelector("[data-h-color-alpha-input]");

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
    !(hexInput instanceof HTMLInputElement) ||
    !(alphaInput instanceof HTMLInputElement)
  ) {
    return;
  }

  const initial = parseHex(root.dataset.color || "#2e86b7") || { r: 46, g: 134, b: 183 };
  const hsv = rgbToHsv(initial.r, initial.g, initial.b);
  /** @type {Hsva} */
  const state = { h: hsv.h, s: hsv.s, v: hsv.v, a: 1 };

  const close = () => {
    dropdown.hidden = true;
    root.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    dropdown.hidden = false;
    root.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  };

  const render = () => {
    const { r, g, b } = hsvToRgb(state.h, state.s, state.v);
    const hex = rgbToHex(r, g, b);
    const solid = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    const withAlpha = hsvaToCss(state);
    const hueColor = (() => {
      const hueRgb = hsvToRgb(state.h, 1, 1);
      return `rgb(${Math.round(hueRgb.r)}, ${Math.round(hueRgb.g)}, ${Math.round(hueRgb.b)})`;
    })();

    swatchColor.style.background = withAlpha;
    valueEl.textContent = hex;
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
    if (document.activeElement !== alphaInput) alphaInput.value = `${Math.round(state.a * 100)}%`;

    root.dataset.color = hex;
    root.dispatchEvent(
      new CustomEvent("h-color-change", {
        bubbles: true,
        detail: { hex, alpha: state.a, css: withAlpha },
      }),
    );
  };

  /**
   * @param {HTMLElement} el
   * @param {(ratioX: number, ratioY: number) => void} onMove
   * @param {{ vertical?: boolean }} [options]
   */
  const bindDrag = (el, onMove, { vertical = false } = {}) => {
    /** @param {PointerEvent} event */
    const update = (event) => {
      const rect = el.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
      onMove(x, vertical ? y : x);
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

  alphaInput.addEventListener("change", () => {
    const n = Number.parseFloat(alphaInput.value.replace("%", ""));
    if (Number.isFinite(n)) state.a = Math.min(100, Math.max(0, n)) / 100;
    render();
  });

  document.addEventListener("pointerdown", (event) => {
    if (dropdown.hidden) return;
    if (event.target instanceof Node && root.contains(event.target)) return;
    close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dropdown.hidden) close();
  });

  render();
}

export function initColorPickers() {
  document.querySelectorAll("[data-h-color-picker]").forEach((root) => {
    if (root instanceof HTMLElement) bindColorPicker(root);
  });
}
