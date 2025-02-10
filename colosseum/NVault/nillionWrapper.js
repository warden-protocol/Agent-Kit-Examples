// nillionWrapper.js
import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import { v4 as uuidv4 } from 'uuid';
import { orgConfig } from './nillionOrgConfig.js';

const SCHEMA_ID = 'fb6563ba-c904-4479-923b-52a01450fb45';

class NillionVaultWrapper {
    constructor() {
        this.collection = null;
    }

    async init() {
        try {
            this.collection = new SecretVaultWrapper(
                orgConfig.nodes,
                orgConfig.orgCredentials,
                SCHEMA_ID
            );
            await this.collection.init();
        } catch (error) {
            console.error('Failed to initialize Nillion Vault:', error);
            throw error;
        }
    }

    async storeData(userId, openaiApiKey, walletPrivateKey) {
        if (!this.collection) {
            throw new Error('Nillion Vault not initialized');
        }

        const data = [{
            _id: uuidv4(),
            user_info: {
                $allot: userId
            },
            openai_api_key: {
                $allot: openaiApiKey
            },
            wallet_private_key: {
                $allot: walletPrivateKey
            },
            created_at: new Date().toISOString(),
            last_updated: new Date().toISOString()
        }];

        try {
            const dataWritten = await this.collection.writeToNodes(data);
            return dataWritten;
        } catch (error) {
            console.error('Failed to write data to Nillion Vault:', error);
            throw error;
        }
    }
}

// Initialize the wrapper
const nillionWrapper = new NillionVaultWrapper();
nillionWrapper.init().catch(console.error);

// Handle form submission
document.getElementById('nillionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').value;
    const openaiApiKey = document.getElementById('openaiApiKey').value;
    const walletPrivateKey = document.getElementById('walletPrivateKey').value;

    try {
        const result = await nillionWrapper.storeData(userId, openaiApiKey, walletPrivateKey);
        document.getElementById('result').textContent = 'Data successfully stored in Nillion Vault!';
        console.log('Data written to nodes:', JSON.stringify(result, null, 2));
    } catch (error) {
        document.getElementById('result').textContent = 'Error: ' + error.message;
    }
});
