/**
 * Ant Design–inspired date picker (soft-blue Harrix chrome).
 * Progressive enhancement for `[data-h-date-picker]`.
 * Matches harrix-swiss-knife SoftCalendarWidget: day / month / year panels + footer presets.
 */

import { translate } from "./_locale.js";
import { renderLucideIcons } from "./_lucide-icons.js";

/** @typedef {"day" | "month_pick" | "year"} PanelMode */

const WEEK_COLUMNS = 7;
const WEEK_ROWS = 6;
const DECADE_LENGTH = 10;
const MONTHS_IN_YEAR = 12;

/**
 * @param {string} value
 * @returns {Date | null}
 */
function parseIsoDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

/**
 * @param {Date} date
 */
function formatIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * @param {Date} date
 * @param {number} days
 */
function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/**
 * @param {Date} date
 * @param {number} months
 */
function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

/**
 * @param {number} year
 */
function decadeStart(year) {
  return year - (year % DECADE_LENGTH);
}

/**
 * @param {number} year
 */
function decadePanelYears(year) {
  const start = decadeStart(year);
  return [start - 1, ...Array.from({ length: DECADE_LENGTH }, (_, index) => start + index), start + DECADE_LENGTH];
}

function localeTag() {
  return (document.documentElement.getAttribute("lang") || "en").toLowerCase();
}

/**
 * @param {number} monthIndex 0–11
 */
function monthShortLabel(monthIndex) {
  return new Intl.DateTimeFormat(localeTag(), { month: "short" }).format(new Date(2000, monthIndex, 1));
}

/**
 * @param {number} weekdayIndex 0 = Sunday
 */
function weekdayShortLabel(weekdayIndex) {
  // 2023-01-01 was a Sunday
  return new Intl.DateTimeFormat(localeTag(), { weekday: "short" }).format(new Date(2023, 0, 1 + weekdayIndex));
}

/**
 * @param {number} year
 * @param {number} monthIndex 0–11
 */
function buildMonthDays(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const start = addDays(first, -first.getDay());
  /** @type {Date[]} */
  const days = [];
  for (let index = 0; index < WEEK_ROWS * WEEK_COLUMNS; index += 1) {
    days.push(addDays(start, index));
  }
  return days;
}

/**
 * @param {string} name
 * @param {string} [className]
 */
function lucideIcon(name, className = "h-date-picker__nav-icon") {
  const icon = document.createElement("i");
  icon.setAttribute("data-lucide", name);
  icon.setAttribute("aria-hidden", "true");
  if (className) icon.className = className;
  return icon;
}

/**
 * @param {HTMLElement} root
 */
function bindDatePicker(root) {
  const input = root.querySelector("[data-h-date-input]");
  const trigger = root.querySelector("[data-h-date-trigger]");
  let dropdown = root.querySelector("[data-h-date-dropdown]");

  if (!(input instanceof HTMLInputElement) || !(trigger instanceof HTMLButtonElement)) {
    return;
  }

  if (!(dropdown instanceof HTMLElement)) {
    dropdown = document.createElement("div");
    dropdown.className = "h-date-picker__dropdown";
    dropdown.setAttribute("data-h-date-dropdown", "");
    dropdown.setAttribute("role", "dialog");
    dropdown.setAttribute("aria-label", translate("Calendar"));
    dropdown.hidden = true;
    root.append(dropdown);
  }

  const initial = parseIsoDate(input.value) || new Date();
  /** @type {Date} */
  let selected = new Date(initial.getFullYear(), initial.getMonth(), initial.getDate());
  /** @type {Date} */
  let view = new Date(selected.getFullYear(), selected.getMonth(), 1);
  /** @type {PanelMode} */
  let panelMode = "day";
  let decadeAnchor = decadeStart(view.getFullYear());
  let monthPickYear = view.getFullYear();

  const header = document.createElement("div");
  header.className = "h-date-picker__header";

  const prevJump = document.createElement("button");
  prevJump.type = "button";
  prevJump.className = "h-date-picker__nav";
  prevJump.append(lucideIcon("chevrons-left"));

  const prevMonth = document.createElement("button");
  prevMonth.type = "button";
  prevMonth.className = "h-date-picker__nav";
  prevMonth.title = translate("Previous month");
  prevMonth.append(lucideIcon("chevron-left"));

  const titleRow = document.createElement("div");
  titleRow.className = "h-date-picker__title";

  const titleMonth = document.createElement("button");
  titleMonth.type = "button";
  titleMonth.className = "h-date-picker__title-chip";
  titleMonth.title = translate("Choose month");

  const titleYear = document.createElement("button");
  titleYear.type = "button";
  titleYear.className = "h-date-picker__title-chip";
  titleYear.title = translate("Choose year");

  titleRow.append(titleMonth, titleYear);

  const nextMonth = document.createElement("button");
  nextMonth.type = "button";
  nextMonth.className = "h-date-picker__nav";
  nextMonth.title = translate("Next month");
  nextMonth.append(lucideIcon("chevron-right"));

  const nextJump = document.createElement("button");
  nextJump.type = "button";
  nextJump.className = "h-date-picker__nav";
  nextJump.append(lucideIcon("chevrons-right"));

  header.append(prevJump, prevMonth, titleRow, nextMonth, nextJump);

  const weekdays = document.createElement("div");
  weekdays.className = "h-date-picker__weekdays";
  for (let weekday = 0; weekday < WEEK_COLUMNS; weekday += 1) {
    const cell = document.createElement("span");
    cell.className = "h-date-picker__weekday";
    cell.textContent = weekdayShortLabel(weekday);
    weekdays.append(cell);
  }

  const dayGrid = document.createElement("div");
  dayGrid.className = "h-date-picker__days";
  dayGrid.setAttribute("role", "grid");

  const monthPanel = document.createElement("div");
  monthPanel.className = "h-date-picker__choice-grid";
  monthPanel.hidden = true;

  const yearPanel = document.createElement("div");
  yearPanel.className = "h-date-picker__choice-grid";
  yearPanel.hidden = true;

  const footer = document.createElement("div");
  footer.className = "h-date-picker__footer";

  /**
   * @param {string} label
   * @param {() => void} onClick
   */
  function presetButton(label, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "h-date-picker__preset";
    button.textContent = label;
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      onClick();
    });
    return button;
  }

  footer.append(
    presetButton(translate("Yesterday"), () => applyPreset(addDays(new Date(), -1))),
    presetButton(translate("Today"), () => applyPreset(new Date())),
    presetButton(translate("+1 day"), () => applyPreset(addDays(selected, 1))),
    presetButton(translate("-1 day"), () => applyPreset(addDays(selected, -1))),
  );

  dropdown.replaceChildren(header, weekdays, dayGrid, monthPanel, yearPanel, footer);
  renderLucideIcons(dropdown);

  trigger.setAttribute("aria-label", translate("Open calendar"));
  if (!trigger.getAttribute("aria-controls") && dropdown.id) {
    trigger.setAttribute("aria-controls", dropdown.id);
  }
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-expanded", "false");

  /**
   * @param {Date} date
   * @param {{ close?: boolean }} [options]
   */
  function commitDate(date, { close = true } = {}) {
    selected = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    view = new Date(selected.getFullYear(), selected.getMonth(), 1);
    input.value = formatIsoDate(selected);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    showDayPanel();
    render();
    if (close) closePopup();
  }

  /**
   * @param {Date} date
   */
  function applyPreset(date) {
    commitDate(date, { close: true });
  }

  function syncFromInput() {
    const parsed = parseIsoDate(input.value);
    if (!parsed) return;
    selected = parsed;
    view = new Date(parsed.getFullYear(), parsed.getMonth(), 1);
    if (!dropdown.hidden) render();
  }

  function closePopup() {
    dropdown.hidden = true;
    root.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    panelMode = "day";
  }

  function openPopup() {
    syncFromInput();
    showDayPanel();
    dropdown.hidden = false;
    root.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    render();
  }

  function showDayPanel() {
    panelMode = "day";
    monthPanel.hidden = true;
    yearPanel.hidden = true;
    weekdays.hidden = false;
    dayGrid.hidden = false;
    prevMonth.hidden = false;
    nextMonth.hidden = false;
    prevJump.title = translate("Previous year");
    nextJump.title = translate("Next year");
  }

  function showMonthPickPanel() {
    panelMode = "month_pick";
    monthPickYear = view.getFullYear();
    yearPanel.hidden = true;
    weekdays.hidden = true;
    dayGrid.hidden = true;
    monthPanel.hidden = false;
    prevMonth.hidden = true;
    nextMonth.hidden = true;
    prevJump.title = translate("Previous year");
    nextJump.title = translate("Next year");
  }

  function showYearPanel() {
    const year = panelMode === "month_pick" ? monthPickYear : view.getFullYear();
    panelMode = "year";
    decadeAnchor = decadeStart(year);
    monthPanel.hidden = true;
    weekdays.hidden = true;
    dayGrid.hidden = true;
    yearPanel.hidden = false;
    prevMonth.hidden = true;
    nextMonth.hidden = true;
    prevJump.title = translate("Previous decade");
    nextJump.title = translate("Next decade");
  }

  function refreshTitle() {
    if (panelMode === "year") {
      const start = decadeStart(decadeAnchor);
      titleMonth.hidden = true;
      titleYear.textContent = `${start}-${start + DECADE_LENGTH - 1}`;
      titleYear.title = "";
      titleYear.classList.add("is-static");
      return;
    }
    if (panelMode === "month_pick") {
      titleMonth.hidden = true;
      titleYear.textContent = String(monthPickYear);
      titleYear.title = translate("Choose year");
      titleYear.classList.remove("is-static");
      return;
    }
    titleMonth.hidden = false;
    titleMonth.textContent = monthShortLabel(view.getMonth());
    titleYear.textContent = String(view.getFullYear());
    titleYear.title = translate("Choose year");
    titleYear.classList.remove("is-static");
  }

  function renderDayGrid() {
    const today = new Date();
    const days = buildMonthDays(view.getFullYear(), view.getMonth());
    dayGrid.replaceChildren();
    days.forEach((date) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "h-date-picker__day";
      button.textContent = String(date.getDate());
      button.setAttribute("role", "gridcell");

      const inMonth = date.getMonth() === view.getMonth() && date.getFullYear() === view.getFullYear();
      const isSelected =
        date.getFullYear() === selected.getFullYear() &&
        date.getMonth() === selected.getMonth() &&
        date.getDate() === selected.getDate();
      const isToday =
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();

      if (!inMonth) button.classList.add("is-outside");
      if (isSelected) button.classList.add("is-selected");
      if (isToday) button.classList.add("is-today");

      button.addEventListener("click", (event) => {
        event.stopPropagation();
        commitDate(date);
      });
      dayGrid.append(button);
    });
  }

  function renderMonthPanel() {
    const today = new Date();
    monthPanel.replaceChildren();
    for (let month = 0; month < MONTHS_IN_YEAR; month += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "h-date-picker__choice";
      button.textContent = monthShortLabel(month);
      const selectedMonth = month === view.getMonth() && monthPickYear === view.getFullYear();
      const currentMonth = month === today.getMonth() && monthPickYear === today.getFullYear();
      if (selectedMonth) button.classList.add("is-selected");
      if (currentMonth) button.classList.add("is-current");
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        view = new Date(monthPickYear, month, 1);
        showDayPanel();
        render();
      });
      monthPanel.append(button);
    }
  }

  function renderYearPanel() {
    const currentYear = new Date().getFullYear();
    const years = decadePanelYears(decadeAnchor);
    const start = decadeStart(decadeAnchor);
    yearPanel.replaceChildren();
    years.forEach((year) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "h-date-picker__choice";
      button.textContent = String(year);
      if (year < start || year >= start + DECADE_LENGTH) button.classList.add("is-muted");
      if (year === view.getFullYear()) button.classList.add("is-selected");
      if (year === currentYear) button.classList.add("is-current");
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        view = new Date(year, view.getMonth(), 1);
        monthPickYear = year;
        showMonthPickPanel();
        render();
      });
      yearPanel.append(button);
    });
  }

  function render() {
    refreshTitle();
    if (panelMode === "day") renderDayGrid();
    else if (panelMode === "month_pick") renderMonthPanel();
    else renderYearPanel();
  }

  titleMonth.addEventListener("click", (event) => {
    event.stopPropagation();
    if (panelMode === "day") {
      showMonthPickPanel();
      render();
    }
  });

  titleYear.addEventListener("click", (event) => {
    event.stopPropagation();
    if (panelMode === "year") {
      showDayPanel();
      render();
      return;
    }
    if (titleYear.classList.contains("is-static")) return;
    showYearPanel();
    render();
  });

  prevMonth.addEventListener("click", (event) => {
    event.stopPropagation();
    view = addMonths(view, -1);
    render();
  });

  nextMonth.addEventListener("click", (event) => {
    event.stopPropagation();
    view = addMonths(view, 1);
    render();
  });

  prevJump.addEventListener("click", (event) => {
    event.stopPropagation();
    if (panelMode === "year") {
      decadeAnchor -= DECADE_LENGTH;
      render();
      return;
    }
    if (panelMode === "month_pick") {
      monthPickYear -= 1;
      render();
      return;
    }
    view = addMonths(view, -12);
    render();
  });

  nextJump.addEventListener("click", (event) => {
    event.stopPropagation();
    if (panelMode === "year") {
      decadeAnchor += DECADE_LENGTH;
      render();
      return;
    }
    if (panelMode === "month_pick") {
      monthPickYear += 1;
      render();
      return;
    }
    view = addMonths(view, 12);
    render();
  });

  const toggle = () => {
    if (dropdown.hidden) openPopup();
    else closePopup();
  };

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    toggle();
  });

  input.addEventListener("dblclick", (event) => {
    event.preventDefault();
    openPopup();
  });

  input.addEventListener("change", syncFromInput);
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" && (event.altKey || event.metaKey)) {
      event.preventDefault();
      openPopup();
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (dropdown.hidden) return;
    if (!(event.target instanceof Node)) return;
    if (root.contains(event.target)) return;
    closePopup();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || dropdown.hidden) return;
    closePopup();
    trigger.focus();
  });

  if (!input.value) {
    input.value = formatIsoDate(selected);
  }
}

export function initDatePickers() {
  document.querySelectorAll("[data-h-date-picker]").forEach((root) => {
    if (root instanceof HTMLElement) bindDatePicker(root);
  });
}
