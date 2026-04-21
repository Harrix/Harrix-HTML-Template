import { IDS, YEAR_RANGE_START_YEAR } from "./_constants.js";

export function initYearRange(startYear = YEAR_RANGE_START_YEAR) {
  const el = document.getElementById(IDS.yearRange);
  if (!el) return;
  const y = new Date().getFullYear();
  if (y > startYear) el.textContent = `-${y}`;
}
