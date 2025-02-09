const realGasPrices = [{ timestamp: new Date().toISOString(), price: 0 }];
const predictedGasPrices = [{ timestamp: new Date().toISOString(), price: 0 }];

export function addRealGasPrice(price) {
    const timestamp = new Date().toISOString();
    realGasPrices.push({ timestamp, price });

    if (realGasPrices.length > 50) {
        realGasPrices.shift();
    }
}

export function addPredictedGasPrice(price) {
    const timestamp = new Date().toISOString();
    predictedGasPrices.push({ timestamp, price });

    if (predictedGasPrices.length > 50) {
        predictedGasPrices.shift();
    }
}

export function getRealGasPriceHistory() {
    return realGasPrices;
}

export function getPredictedGasPriceHistory() {
    return predictedGasPrices;
}
