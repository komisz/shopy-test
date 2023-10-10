import { getItemFromLocalStorage } from './storage.js';

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

async function parse(data) {
  return data.map(lowercaseKeys);
}

async function _prepareData() {
  try {
    const data = await fetchJson();
    const products = await parse(data);

    addItemToLocalStorage('products', products);
  } catch (error) {
    console.error('Error:', error);
  }
}

function getProducts() {
  return getItemFromLocalStorage('products');
}

export { _prepareData, getProducts };
