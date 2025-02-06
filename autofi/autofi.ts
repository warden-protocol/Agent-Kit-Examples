import { getTokenPrice } from './src/getTokenPrice';
import { predictFuturePrice } from './src/pricePrediction';
import { calculateAPR } from './src/aprCalculator';


async function main() {
    const tokenSymbol = 'ETH'; // Replace with the token symbol you want to fetch

    // Fetch the current price
    const currentPrice = await getTokenPrice(tokenSymbol);
    // console.log(`Current price of ${tokenSymbol}: $${currentPrice}`);

    // Predict the future price
    const predictedPrice = await predictFuturePrice(tokenSymbol);
    console.log(`Predicted price of ${tokenSymbol} in 1 hour: $${predictedPrice}`);

    // Calculate the APR
    const apr = calculateAPR(tokenSymbol);
    console.log(`APR for ${tokenSymbol}: ${apr.toFixed(2)}%`);
    
}

main();