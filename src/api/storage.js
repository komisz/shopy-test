function addItemToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getItemFromLocalStorage(key) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

function removeItemFromLocalStorage(key) {
  localStorage.removeItem(key);
}

export { addItemToLocalStorage, getItemFromLocalStorage };
