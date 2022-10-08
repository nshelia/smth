const fetch = require('node-fetch');

async function calculatePrice(req, res) {
    const { make, model, year, mileage } = req.body;
    const myAutoProducts = await getMyAutoProducts(make, model, year, mileage);
    const prices = myAutoProducts.map(product => product.price).filter(price => price != 0);
    const std = getStandardDeviation(prices);

    const mean = prices.reduce((productA, productB) => +productA + productB, 0) / prices.length; 
    res.json({
        from: mean - std,
        to: mean + std
    });
}

function getStandardDeviation(array) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

function getMyAutoProducts(make, model, year, kilometers) {
    const kilometersFrom = kilometers - 30000;
    const kilometersTo = kilometers + 30000;

    const url = `https://api2.myauto.ge/ka/products?TypeID=0&ForRent=0&Mans=${make}.${model}&Cats=1&CurrencyID=1&MileageType=1&SortOrder=1&Page=1&MileageFrom=${kilometersFrom}&MileageTo=${kilometersTo}&ProdYearFrom=${year}&ProdYearTo=${year}`;
    return fetch(url)
        .then(response => response.json())
        .then(json => json.data.items)
}

module.exports = calculatePrice;
