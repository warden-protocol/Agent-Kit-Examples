import express from "express";
import cors from "cors";
import { getRealGasPriceHistory, getPredictedGasPriceHistory } from "./utils/dataStore.js";

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:4200"];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.get("/gas-prices", (req, res) => {
    res.json({
        real: getRealGasPriceHistory(),
        predicted: getPredictedGasPriceHistory()
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
