import dotenv from "dotenv";

dotenv.config();

export const CONFIG = {
    PRIVATE_KEY: process.env.PRIVATE_KEY || "",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
};