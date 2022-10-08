const fetch = require('node-fetch');

async function calculatePrice(req, res) {
    const { make, model, year, kilometers } = req.body;

    const myAutoProducts = await getMyAutoProducts(make, model, year, kilometers);
    const prices = myAutoProducts
      .map((product) => product.price)
      .filter((price) => price != 0)
      .sort((a, b) => a - b);
    
    const threshold = Math.round(prices.length / 10) || 1;
    const from = prices[Math.round(prices.length / 2) - threshold]
    const to = prices[Math.round(prices.length / 2) + threshold] || from

    res.json({
      from,
      to
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

  const url = `https://api2.myauto.ge/ka/products?TypeID=0&ForRent=0&Mans=${make}.${model}&CurrencyID=1&MileageType=1&Customs=1&SortOrder=1&MileageFrom=${kilometersFrom}&MileageTo=${kilometersTo}&ProdYearFrom=${year}&ProdYearTo=${year}&MileageType=1`;
  const response = await fetch(url).then((response) => response.json());

  let products = [...response.data.items];

  if (response.data.meta.last_page > 1) {
    for (let page = 2; page <= response.data.meta.last_page; page++) {
      await fetch(
        `${url}&Page=${page}`,
      )
        .then((response) => response.json())
        .then((json) => (products = [...products, ...json.data.items]));
    }
  }

  return products;
}

module.exports = calculatePrice;
