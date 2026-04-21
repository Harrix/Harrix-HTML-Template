import {
  CODE_BLOCK_BOTTOM_THRESHOLD,
  CODE_COPY_DONE_ICON_HTML,
  CODE_COPY_FEEDBACK_MS,
  CODE_COPY_ICON_HTML,
} from "./_constants.js";
import { HLJS_LANGUAGE_LOADERS, normalizeHljsLanguageId } from "./_hljs-languages.js";
import { translate } from "./_locale.js";

export function getCodeLanguage(codeEl) {
  if (!codeEl || !codeEl.classList) return null;
  for (const c of codeEl.classList) {
    if (c.startsWith("language-")) return c.slice(9);
    if (c !== "hljs") return c;
  }
  return null;
}

const CODE_LANGUAGE_NAMES = {
  cpp: "C++",
  c: "C",
  java: "Java",
  javascript: "JavaScript",
  js: "JavaScript",
  typescript: "TypeScript",
  ts: "TypeScript",
  python: "Python",
  py: "Python",
  css: "CSS",
  html: "HTML",
  xml: "XML",
  json: "JSON",
  bash: "Bash",
  shell: "Shell",
  sql: "SQL",
  plaintext: "Plain text",
};

function getLanguageDisplayName(alias) {
  const lower = (alias || "").toLowerCase();
  return CODE_LANGUAGE_NAMES[lower] || (alias ? alias.charAt(0).toUpperCase() + alias.slice(1) : "");
}

export async function initSyntaxHighlighting() {
  const codeBlocks = document.querySelectorAll("pre > code");
  if (codeBlocks.length === 0) return;

  const toHighlight = [...codeBlocks].filter(
    (el) => !el.classList.contains("language-chart") && !el.closest("pre.chart"),
  );
  if (toHighlight.length === 0) return;

  const hljsModule = await import("highlight.js/lib/core");
  const hljs = hljsModule.default;

  /** @type {Set<string>} */
  const languageIds = new Set();
  for (const el of toHighlight) {
    const raw = getCodeLanguage(el);
    languageIds.add(normalizeHljsLanguageId(raw));
  }

  let plaintextGrammar = null;
  async function getPlaintextGrammar() {
    if (!plaintextGrammar) {
      const mod = await HLJS_LANGUAGE_LOADERS.plaintext();
      plaintextGrammar = mod.default;
    }
    return plaintextGrammar;
  }

  await Promise.all(
    [...languageIds].map(async (id) => {
      if (hljs.getLanguage(id)) return;
      const loader = HLJS_LANGUAGE_LOADERS[id];
      if (loader) {
        const mod = await loader();
        hljs.registerLanguage(id, mod.default);
        return;
      }
      hljs.registerLanguage(id, await getPlaintextGrammar());
    }),
  );

  for (const block of toHighlight) {
    hljs.highlightElement(block);
  }
}

export function initCodeCopyButtons() {
  const codeBlocks = document.querySelectorAll("pre > code");
  codeBlocks.forEach((codeEl) => {
    const pre = codeEl.parentElement;
    if (!pre || pre.classList.contains("h-code-block-inner")) return;
    if (codeEl.classList.contains("language-chart")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "h-code-block";

    const language = getCodeLanguage(codeEl);
    const lineCount = (codeEl.textContent || "").trim().split("\n").length;
    const showLanguageLabel = language && lineCount > 2;
    const isSingleLine = lineCount <= 1;
    if (isSingleLine) wrapper.classList.add("h-code-block--single-line");

    const labelCopy = translate("Copy");
    const labelCopied = translate("Copied!");

    function doCopy(btn) {
      const text = codeEl.textContent || "";
      navigator.clipboard.writeText(text).then(() => {
        btn.innerHTML = CODE_COPY_DONE_ICON_HTML;
        btn.setAttribute("aria-label", labelCopied);
        btn.classList.add("h-code-copy--done");
        setTimeout(() => {
          btn.innerHTML = CODE_COPY_ICON_HTML;
          btn.setAttribute("aria-label", labelCopy);
          btn.classList.remove("h-code-copy--done");
        }, CODE_COPY_FEEDBACK_MS);
      });
    }

    function createButton(position) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "h-code-copy h-code-copy--" + position;
      btn.setAttribute("aria-label", labelCopy);
      btn.innerHTML = CODE_COPY_ICON_HTML;
      btn.addEventListener("click", () => doCopy(btn));
      return btn;
    }

    if (showLanguageLabel) {
      const langSpan = document.createElement("span");
      langSpan.className = "h-code-lang";
      langSpan.textContent = getLanguageDisplayName(language);
      wrapper.appendChild(langSpan);
    }

    wrapper.appendChild(createButton("top"));
    const preClone = pre.cloneNode(true);
    preClone.classList.add("h-code-block-inner");
    wrapper.appendChild(preClone);
    if (!isSingleLine) wrapper.appendChild(createButton("bottom"));

    if (!isSingleLine) {
      wrapper.addEventListener("mousemove", (e) => {
        const rect = wrapper.getBoundingClientRect();
        const fromBottom = rect.bottom - e.clientY;
        if (fromBottom <= CODE_BLOCK_BOTTOM_THRESHOLD) {
          wrapper.classList.add("h-code-block--show-copy");
        } else {
          wrapper.classList.remove("h-code-block--show-copy");
        }
      });
      wrapper.addEventListener("mouseleave", () => {
        wrapper.classList.remove("h-code-block--show-copy");
      });
    }

    pre.parentNode.insertBefore(wrapper, pre);
    pre.remove();
  });
}
