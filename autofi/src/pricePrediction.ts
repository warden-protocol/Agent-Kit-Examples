import fs from 'fs';
import path from 'path';

class LinearRegression {
    private xValues: number[];
    private yValues: number[];
    private slope: number = 0;
    private intercept: number = 0;

    constructor(xValues: number[], yValues: number[]) {
        if (xValues.length !== yValues.length) {
            throw new Error('X and Y arrays must have the same length');
        }
        this.xValues = xValues;
        this.yValues = yValues;
    }

    train(): void {
        const n = this.xValues.length;
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumXX = 0;

        for (let i = 0; i < n; i++) {
            sumX += this.xValues[i];
            sumY += this.yValues[i];
            sumXY += this.xValues[i] * this.yValues[i];
            sumXX += this.xValues[i] * this.xValues[i];
        }

        const meanX = sumX / n;
        const meanY = sumY / n;

        this.slope = (sumXY - sumX * meanY) / (sumXX - sumX * meanX);
        this.intercept = meanY - this.slope * meanX;
    }

    predict(x: number): number {
        return this.slope * x + this.intercept;
    }
}

/**
 * Predicts the future price of a token using historical data.
 * @param tokenSymbol - The symbol of the token (e.g., "ETH", "USDT").
 * @returns The predicted future price of the token as a number.
 */
export async function predictFuturePrice(tokenSymbol: string): Promise<number> {
    try {
        console.log('\nPredicting future price...');
        // Read the historical data
        const data = fs.readFileSync(path.join(__dirname, '../data/prices.json'), 'utf-8');
        const pricesData = JSON.parse(data);

        if (!pricesData[tokenSymbol] || pricesData[tokenSymbol].length < 2) {
            throw new Error('Not enough historical data to make a prediction');
        }

        // Prepare data for linear regression
        const historicalPrices = pricesData[tokenSymbol];
        const timestamps = historicalPrices.map((entry: any) => entry.timestamp);
        const prices = historicalPrices.map((entry: any) => entry.price);

        // Normalize timestamps (relative to the first timestamp)
        const minTimestamp = Math.min(...timestamps);
        const normalizedTimestamps = timestamps.map((t: number) => t - minTimestamp);

        // Train the linear regression model
        const model = new LinearRegression(normalizedTimestamps, prices);
        model.train();

        // Predict the price for the next timestamp
        const lastTimestamp = normalizedTimestamps[normalizedTimestamps.length - 1];
        const nextTimestamp = lastTimestamp + 60 * 60 * 1000; // Predict 1 hour ahead
        const predictedPrice = model.predict(nextTimestamp);

        return predictedPrice;

    } catch (error) {
        console.error('\nError predicting future price:');
        if (error instanceof Error) {
            console.error('Error type:', error.name);
            console.error('Error message:', error.message);
            console.error('Stack trace:', error.stack);
        } else {
            console.error('Unknown error:', error);
        }
        throw error; // Re-throw the error instead of exiting
    }
}