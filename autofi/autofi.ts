import { getTokenPrice } from './src/getTokenPrice';
import { predictFuturePrice } from './src/pricePrediction';


async function main() {
    const tokenSymbol = 'BTC'; // Replace with the token symbol you want to fetch

    // Fetch the current price
    const currentPrice = await getTokenPrice(tokenSymbol);
    // console.log(`Current price of ${tokenSymbol}: $${currentPrice}`);
    // console.log(`price ${tokenSymbol}: $${currentPrice}`);

    // Predict the future price
    const predictedPrice = await predictFuturePrice(tokenSymbol);
    console.log(`Predicted price of ${tokenSymbol} in 1 hour: $${predictedPrice}`);
}

main();