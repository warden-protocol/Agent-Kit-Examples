// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// // Add these endpoints to your existing Node.js code
// app.post('/encrypt', async (req, res) => {
//     try {
//         // Your existing encryption logic here
//         // Use req.body to get the user input
//         res.json({ success: true, data: encryptedData });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.get('/decrypt', async (req, res) => {
//     try {
//         // Your existing decryption logic here
//         res.json(decryptedData);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

import express from 'express';
import cors from 'cors';
import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import { v4 as uuidv4 } from 'uuid';
import { orgConfig } from './nillionOrgConfig.js';

const app = express();
const SCHEMA_ID = 'fb6563ba-c904-4479-923b-52a01450fb45';

// Middleware
app.use(cors());
app.use(express.json());

let collection;

// Initialize SecretVaultWrapper once
(async () => {
    try {
        collection = new SecretVaultWrapper(
            orgConfig.nodes,
            orgConfig.orgCredentials,
            SCHEMA_ID
        );
        await collection.init();
        console.log('SecretVault initialized');
    } catch (error) {
        console.error('Initialization error:', error);
    }
})();

app.post('/encrypt', async (req, res) => {
    try {
        const userData = {
            _id: uuidv4(),
            user_info: { $allot: req.body.user_info },
            openai_api_key: { $allot: req.body.openai_api_key },
            wallet_private_key: { $allot: req.body.wallet_private_key },
            created_at: new Date().toISOString(),
            last_updated: new Date().toISOString()
        };

        const dataWritten = await collection.writeToNodes([userData]);

        res.json({
            success: true,
            record_id: dataWritten[0].result.data.created[0],

        });
        console.log('Data written:', dataWritten[0].result.data.created[0]);
    } catch (error) {
        console.error('Encryption error:', error);
        res.status(500).json({
            error: error.message,
            details: 'Failed to encrypt and store data'
        });
    }
});

app.get('/decrypt', async (req, res) => {
    try {
        const decryptedData = await collection.readFromNodes({});
        res.json({
            success: true,
            count: decryptedData.length,
            data: decryptedData
        });
    } catch (error) {
        console.error('Decryption error:', error);
        res.status(500).json({
            error: error.message,
            details: 'Failed to retrieve decrypted data'
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
