import { addItemToLocalStorage, getItemFromLocalStorage } from './storage.js';

async function fetchJson(filepath = './src/api/productsSample.json') {
  try {
    const response = await fetch(filepath);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

function lowercaseKeys(obj) {
  return Object.keys(obj).reduce((accumulator, key) => {
    accumulator[key.toLowerCase()] = obj[key];
    return accumulator;
  }, {});
}

function parse(data) {
  return data.map(lowercaseKeys);
}

async function _prepareData() {
  try {
    const data = await fetchJson();

    const products = parse(data);
    const categories = [...new Set(products.map((p) => p.category))];
    const vendors = [...new Set(products.map((p) => p.vendor))];

    addItemToLocalStorage('products', products);
    addItemToLocalStorage('categories', categories);
    addItemToLocalStorage('vendors', vendors);
  } catch (error) {
    console.error('Error:', error);
  }
}

function getProducts() {
  return getItemFromLocalStorage('products');
}
function getCategories() {
  return getItemFromLocalStorage('categories');
}
function getVendors() {
  return getItemFromLocalStorage('vendors');
}
function getProductsByCategory(filterCategories) {
  const products = getProducts();
  const categories = getCategories();

  if (!filterCategories.length) {
    return filterNFromArrBy(products, categories);
  }

  return filterNFromArrBy(products, filterCategories, 5);
}

function filterNFromArrBy(arr = [], filters = [], n = 2) {
  return filters.reduce((acc, filter) => {
    const itemsInCategory = arr
      .filter((item) => item.category === filter)
      .slice(0, n);

    acc.push(...itemsInCategory);

    return acc;
  }, []);
}

export {
  _prepareData,
  getProducts,
  getProductsByCategory,
  getCategories,
  getVendors,
};
