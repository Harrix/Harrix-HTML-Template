export function initYearRange(startYear = 2022) {
  const el = document.getElementById("h-year-range");
  if (!el) return;
  const y = new Date().getFullYear();
  if (y > startYear) el.textContent = `-${y}`;
}

