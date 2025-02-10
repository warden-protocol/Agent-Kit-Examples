// // server.ts
// import express from 'express';
// import bodyParser from 'body-parser';
// import { initializeAgent, runAutonomousMode, runChatMode } from './cli-agent';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));

// app.post('/initialize', async (req, res) => {
//     const { modelName, apiKey } = req.body;

//     try {
//         // Initialize agent with selected model configuration
//         const { agent, config } = await initializeAgent(modelName, apiKey);

//         // Store agent instance in app context
//         app.locals.agent = agent;
//         app.locals.config = config;

//         res.send(`
//       <form action="/choose-mode" method="POST">
//         <button type="submit">Continue to Mode Selection</button>
//       </form>
//     `);
//     } catch (error) {
//         console.error('Initialization error:', error);
//         res.status(500).send('Error initializing agent');
//     }
// });

// app.post('/choose-mode', async (req, res) => {
//     res.send(`
//     <form action="/run-mode" method="POST">
//       <h2>Select Operation Mode:</h2>
//       <select name="mode" required>
//         <option value="chat">Chat Mode</option>
//         <option value="auto">Autonomous Mode</option>
//       </select>
//       <button type="submit">Start Agent</button>
//     </form>
//   `);
// });

// app.post('/run-mode', async (req, res) => {
//     const { mode } = req.body;
//     const { agent, config } = app.locals;

//     try {
//         res.send(`Agent running in ${mode} mode - check server console for output`);

//         // Run selected mode in background
//         if (mode === 'chat') {
//             await runChatMode(agent, config);
//         } else {
//             await runAutonomousMode(agent, config);
//         }
//     } catch (error) {
//         console.error('Mode execution error:', error);
//         res.status(500).send('Error starting agent mode');
//     }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

import express from 'express';
import bodyParser from 'body-parser';
import { initializeAgent, runChatMode } from './cli-agent';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/initialize', async (req, res) => {
    const { modelName, apiKey } = req.body;

    try {
        // Initialize agent with the selected model configuration
        const { agent, config } = await initializeAgent(modelName, apiKey);

        // Send immediate response to the client
        res.send('Agent initialized and running in Chat Mode - check server console for output');

        // Start Chat Mode in background (fire-and-forget)
        runChatMode(agent, config)
            .then(() => console.log('Chat mode finished.'))
            .catch((error) => console.error('Error in Chat Mode:', error));
    } catch (error) {
        console.error('Initialization error:', error);
        res.status(500).send('Error initializing agent');
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
