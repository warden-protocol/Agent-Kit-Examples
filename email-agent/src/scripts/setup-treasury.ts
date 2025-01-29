// src/scripts/setup-treasury.ts
import { getSpaceKeys } from '../services/warden/setup';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    if (!process.env.PRIVATE_KEY) {
        throw new Error('PRIVATE_KEY not found in environment variables');
    }

    const SPACE_ID = 22;

    console.log('Getting space keys...');
    const result = await getSpaceKeys(process.env.PRIVATE_KEY, SPACE_ID);
    console.log('Result:', result);
}

main().catch(console.error);