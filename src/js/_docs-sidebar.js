import { IDS } from "./_constants.js";
import { translate } from "./_locale.js";

export function initDocsSidebar() {
  const sidebar = document.getElementById(IDS.docsSidebar);
  if (!sidebar) return;

  const sidebarHeaderLabel = document.getElementById(IDS.docsSidebarHeaderLabel);
  if (sidebarHeaderLabel) sidebarHeaderLabel.textContent = translate("Documentation");
}
