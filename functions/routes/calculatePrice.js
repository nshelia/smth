const fetch = require('node-fetch');

async function calculatePrice(req, res) {
  //   const { make, model, year, mileage } = req.body;
  //   const myAutoProducts = await getMyAutoProducts(make, model, year, mileage);
  //   const prices = myAutoProducts
  //     .map((product) => product.price)
  //     .filter((price) => price != 0);
  //   const mean =
  //     prices.reduce((productA, productB) => +productA + productB, 0) /
  //     prices.length;
  //   const std = getStandardDeviation(prices);

  res.json({
    from: 1000,
    to: 2000,
  });
}

function getStandardDeviation(array) {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n,
  );
}

async function getMyAutoProducts(make, model, year, kilometers) {
  const kilometersFrom = kilometers - 30000;
  const kilometersTo = kilometers + 30000;

  const response = await fetch(
    `https://api2.myauto.ge/ka/products?TypeID=0&ForRent=0&Mans=${make}.${model}&Cats=1&CurrencyID=1&MileageType=1&SortOrder=1&Page=1&MileageFrom=${kilometersFrom}&MileageTo=${kilometersTo}&ProdYearFrom=${year}&ProdYearTo=${year}`,
  ).then((response) => response.json());

  let products = [...response.data.items];

  if (response.data.meta.last_page > 1) {
    for (let page = 2; page <= response.data.meta.last_page; page++) {
      await fetch(
        `https://api2.myauto.ge/ka/products?TypeID=0&ForRent=0&Mans=${make}.${model}&Cats=1&CurrencyID=1&MileageType=1&SortOrder=1&Page=1&MileageFrom=${kilometersFrom}&MileageTo=${kilometersTo}&ProdYearFrom=${year}&ProdYearTo=${year}&Page=${page}`,
      )
        .then((response) => response.json())
        .then((json) => (products = [...products, ...json.data.items]));
    }
  }

  return products;
}

module.exports = calculatePrice;
