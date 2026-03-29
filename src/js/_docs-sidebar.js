import { translate } from "./_locale.js";

export function initDocsSidebar() {
  const sidebar = document.getElementById("h-docs-sidebar");
  if (!sidebar) return;

  const sidebarHeaderLabel = document.getElementById("h-docs-sidebar-header-label");
  if (sidebarHeaderLabel) sidebarHeaderLabel.textContent = translate("Documentation");
}
