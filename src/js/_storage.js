/**
 * localStorage access that does not throw in private mode or when storage is disabled.
 */

export function safeStorageGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeStorageSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
