# **AI Gas Price Forecaster** 🚀
An AI-powered gas price prediction tool that fetches real-time Ethereum gas prices and predicts future values using OpenAI. This project features a **Node.js backend** and an **Angular frontend**.
## **📌 Features**
✨ Fetches real-time Ethereum gas prices
🤖 Predicts future prices with AI (using OpenAI)
📊 Displays live vs predicted gas prices on a graph
🔗 Seamless combination of a robust backend and an interactive frontend
🚀 Easily deployable on **Railway**, **Heroku**, or **Fly.io**
## **🚀 How to Run Locally**
### 1️⃣ Clone the Repository
``` bash
git clone https://github.com/yourusername/warden-gas-forecaster.git
cd warden-gas-forecaster
```
### 2️⃣ Set Up the Backend (requires nvm 18+)
``` bash
npm install  
```
Create a `.env` file inside the `backend/` root directory with the following values:
``` ini
OPENAI_API_KEY=your_openai_key  
PRIVATE_KEY=your_warden_private_key  
```
Start the backend server:
``` bash
node src/index.js
```
✅ **You should see**:
``` bash
✅ Server running at http://localhost:3000  
```
### 3️⃣ Set Up the Frontend
``` bash
cd frontend  
npm install  
```
Update the API URL in `frontend/src/environments/environment.ts`:
``` typescript
export const environment = {  
  production: false,  
  apiUrl: 'http://localhost:3000'  
};  
```
Start the frontend:
``` bash
npm start  
```
🌐 **The app will open in your browser at**:
``` 
http://localhost:4200  
```
## **🌍 API Endpoints**

| **Method** | **Endpoint** | **Description** |
| --- | --- | --- |
| GET | /gas-prices | Returns real-time and predicted gas prices |
### **📋 Example Response:**
``` json
{
  "real": [
    { "timestamp": "2025-02-09T16:59:01.123Z", "price": 2654.61 },
    { "timestamp": "2025-02-09T16:59:11.456Z", "price": 2654.81 }
  ],
  "predicted": [
    { "timestamp": "2025-02-09T16:59:02.789Z", "price": 2653.97 },
    { "timestamp": "2025-02-09T16:59:32.123Z", "price": 2654.55 }
  ]
}
```
## **🎯 Project Structure**
``` plaintext
warden-gas-forecaster/
│── backend/
│   ├── src/
│   │   ├── server.js            # Express backend
│   │   ├── agent.js             # AI prediction logic
│   │   ├── services/            # Supporting services
│   │   ├── utils/               # Helper utilities
│   ├── package.json
│   ├── .env
│── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── gas-chart/       # Angular chart component
│   │   │   ├── app.module.ts    # Angular module
│   ├── package.json
│── README.md
```
## **🔥 Deployment**
You can deploy this project on **Railway**, **Heroku**, or **Fly.io**.
Follow the detailed steps in the [`DEPLOYMENT.md`](./DEPLOYMENT.md) file.
## **📜 Future Improvements**
✅ Refactor app to show gas fee instead of actual ETH price.
✅ Enhance UI with dark/light mode toggle
✅ Integrate database support to store historical prices