import { IDS } from "./_constants.js";
import { translate } from "./_locale.js";

export function initNavbar() {
  const menuPanelLabel = document.getElementById(IDS.navbarMenuPanelLabel);
  if (menuPanelLabel) menuPanelLabel.textContent = translate("Menu");
}
