export function createUiHistoryLayer(getIsAnyOpen, closeAll) {
  let pushed = false;

  function ensure() {
    if (pushed) return;
    window.history.pushState({ hUiLayer: true }, "", window.location.href);
    pushed = true;
  }

  function clearIfPresent() {
    if (!pushed) return;
    pushed = false;
    if (window.history.state && window.history.state.hUiLayer) {
      window.history.back();
    }
  }

  window.addEventListener("popstate", () => {
    if (getIsAnyOpen()) {
      closeAll();
    }
    pushed = false;
  });

  return { ensure, clearIfPresent };
}
