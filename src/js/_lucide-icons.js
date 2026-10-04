import {
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  CircleAlert,
  CircleCheck,
  CircleDot,
  CircleX,
  Copy,
  Download,
  EllipsisVertical,
  File,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Globe,
  Info,
  Link,
  List,
  Loader,
  LoaderCircle,
  Menu,
  Moon,
  Presentation,
  RefreshCw,
  Rss,
  Search,
  Settings,
  Shield,
  Square,
  SquareCheck,
  Star,
  Sun,
  TriangleAlert,
  X,
  createElement,
} from "lucide";

/** Filled marks Lucide does not ship. GitHub and Windows paths: Simple Icons (CC0). */
const Harrix = [
  [
    "path",
    {
      d: "M441.3 210.8C460.6 289 428 371.2 361 415.2l-62.2-142.6-59.6 25.9L301 441.1c-78.1 19.3-160.3-13.3-204.4-80.4L36.2 387C101 496.3 238.4 542.6 358 490.8s179.2-184 143.7-305.9l-60.4 25.9zM154 21.2C34.7 73.1-25.2 205.3 10.3 327.1l60.4-26.3C51.8 223 84 140.5 151.4 96.4L213.2 239l59.6-25.9L211 70.5c78.1-19.3 160.3 13.3 204.4 80.4l60.4-26.3C410.9 15.7 273.6-30.6 154 21.2z",
    },
  ],
];

const Github = [
  [
    "path",
    {
      d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
    },
  ],
];

const Windows = [
  [
    "path",
    {
      d: "M0 0h11.377v11.372H0zM12.623 0H24v11.372H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623",
    },
  ],
];

const icons = {
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  CircleAlert,
  CircleCheck,
  CircleDot,
  CircleX,
  Copy,
  Download,
  EllipsisVertical,
  File,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Github,
  Globe,
  Harrix,
  Info,
  Link,
  List,
  Loader,
  LoaderCircle,
  Menu,
  Moon,
  Presentation,
  RefreshCw,
  Rss,
  Search,
  Settings,
  Shield,
  Square,
  SquareCheck,
  Star,
  Sun,
  TriangleAlert,
  Windows,
  X,
};

const FILLED_ICONS = new Set(["github", "harrix", "windows"]);
const FILLED_VIEWBOX = {
  harrix: "0 0 512 512",
};

function toPascalCase(string) {
  let out = "";
  let upperNext = false;
  for (const ch of string) {
    if (ch === "-" || ch === "_" || ch <= " ") {
      upperNext = out.length > 0;
      continue;
    }
    if (out.length === 0) out += ch.toLowerCase();
    else out += upperNext ? ch.toUpperCase() : ch;
    upperNext = false;
  }
  return out.charAt(0).toUpperCase() + out.slice(1);
}

/**
 * Replace `<i data-lucide="name">` under `root` with Lucide SVG icons.
 *
 * @param {ParentNode} [root]
 */
export function renderLucideIcons(root = document) {
  root.querySelectorAll("i[data-lucide]").forEach((element) => {
    const iconName = element.getAttribute("data-lucide");
    if (!iconName) return;
    const iconNode = icons[toPascalCase(iconName)];
    if (!iconNode) return;

    const filled = FILLED_ICONS.has(iconName) || element.hasAttribute("data-lucide-filled");
    const viewBox = element.getAttribute("data-lucide-view-box") || FILLED_VIEWBOX[iconName];
    const svg = createElement(iconNode, {
      ...(filled ? { fill: "currentColor", stroke: "none", ...(viewBox ? { viewBox } : {}) } : {}),
      "data-lucide": iconName,
      class: ["lucide", `lucide-${iconName}`, ...element.classList].filter(Boolean).join(" "),
      "aria-hidden": element.getAttribute("aria-hidden") ?? "true",
    });
    element.replaceWith(svg);
  });
}

export function initLucideIcons() {
  renderLucideIcons();

  const observer = new MutationObserver(() => {
    if (document.querySelector("i[data-lucide]")) renderLucideIcons();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
