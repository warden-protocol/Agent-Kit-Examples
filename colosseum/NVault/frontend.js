// Import required modules and configurations
import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import { v4 as uuidv4 } from 'uuid';
import { orgConfig } from './nillionOrgConfig.js';

const SCHEMA_ID = 'fb6563ba-c904-4479-923b-52a01450fb45';

// Initialize the SecretVaultWrapper with custom headers
let collection;
async function initializeCollection() {
    try {
        const customConfig = {
            ...orgConfig,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        };

        collection = new SecretVaultWrapper(
            customConfig.nodes,
            customConfig.orgCredentials,
            SCHEMA_ID,
            customConfig.headers
        );

        await collection.init();
        console.log('SecretVaultWrapper initialized successfully');
    } catch (error) {
        console.error('Failed to initialize SecretVaultWrapper:', error);
        throw error;
    }
}

// Initialize on page load and handle errors
initializeCollection().catch(error => {
    console.error('Initialization error:', error);
    document.getElementById('responseContent').textContent = 
        `Initialization Error: ${error.message}`;
});

async function submitData() {
    try {
        if (!collection) {
            throw new Error('Collection not initialized. Please wait and try again.');
        }

        // Get values from form
        const userName = document.getElementById('userName').value;
        const openaiKey = document.getElementById('openaiKey').value;
        const walletKey = document.getElementById('walletKey').value;

        // Validate inputs
        if (!userName || !openaiKey || !walletKey) {
            throw new Error('All fields are required');
        }

        // Create data object according to schema
        const data = [{
            _id: uuidv4(),
            user_info: {
                $allot: userName
            },
            openai_api_key: {
                $allot: openaiKey
            },
            wallet_private_key: {
                $allot: walletKey
            },
            created_at: new Date().toISOString(),
            last_updated: new Date().toISOString()
        }];

        // Write to nodes
        const dataWritten = await collection.writeToNodes(data);
        
        // Display response
        document.getElementById('responseContent').textContent = 
            JSON.stringify(dataWritten, null, 2);

        // Clear form
        clearForm();

    } catch (error) {
        document.getElementById('responseContent').textContent = 
            `Error: ${error.message}`;
        console.error('Error:', error);
    }
}

async function fetchData() {
    try {
        // Read from nodes
        const decryptedData = await collection.readFromNodes({});
        
        // Display response
        document.getElementById('responseContent').textContent = 
            JSON.stringify(decryptedData, null, 2);

    } catch (error) {
        document.getElementById('responseContent').textContent = 
            `Error: ${error.message}`;
        console.error('Error:', error);
    }
}

function clearForm() {
    document.getElementById('userName').value = '';
    document.getElementById('openaiKey').value = '';
    document.getElementById('walletKey').value = '';
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submitBtn').addEventListener('click', submitData);
    document.getElementById('fetchBtn').addEventListener('click', fetchData);
}); 