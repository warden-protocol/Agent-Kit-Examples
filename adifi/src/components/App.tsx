import React, { useState } from 'react';
import '../styles/App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const App: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        setMessages(prev => [...prev, `You: ${input}`]);

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            setMessages(prev => [...prev, `Assistant: ${data.response}`]);
        } catch (error) {
            console.error('Fetch error:', error);
            setMessages(prev => [...prev, `Error: ${error.message}`]);
        } finally {
            setLoading(false);
            setInput('');
        }
    };

    return (
        <div className="app-container">
            <header className="header">
                <div className="logo-container">
                    <img 
                        src="https://avatars.githubusercontent.com/u/36115574?s=200&v=4" 
                        alt="Uniswap" 
                        className="logo" 
                    />
                    <img 
                        src="https://cryptologos.cc/logos/the-graph-grt-logo.png" 
                        alt="Graph" 
                        className="logo" 
                    />
                    <img src="/warde-logo.png" alt="Warden" className="logo main-logo" />
                </div>
                <h1>Adifi</h1>
                <p>Get AI-powered trading analysis and recommendations for Uniswap pools</p>
            </header>

            <div className="chat-interface">
                <div className="chat-container">
                    <div className="messages">
                        {messages.length === 0 && (
                            <div className="feature-card">
                                <h3>Example Query</h3>
                                <p>Try asking: "Analyze the ETH/USDC pool at 0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8?"</p>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`message ${msg.startsWith('You:') ? 'user' : 'assistant'}`}
                            >
                                {msg}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className="input-form">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about Uniswap pools and trading opportunities..."
                            disabled={loading}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Analyzing...' : 'Send'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="features-grid">
                <div className="feature-card">
                    <h3>Market Analysis</h3>
                    <p>Get real-time analysis of Uniswap pool metrics and market conditions</p>
                </div>
                <div className="feature-card">
                    <h3>Trading Recommendations</h3>
                    <p>Receive AI-powered trading suggestions with entry, exit, and stop-loss levels</p>
                </div>
                <div className="feature-card">
                    <h3>Risk Assessment</h3>
                    <p>Understand market risks with confidence levels and detailed warnings</p>
                </div>
            </div>

            <footer className="footer">
                <p>From Latam to the world 🌎</p>
                <div className="footer-logos">
                <img 
                        src="https://avatars.githubusercontent.com/u/36115574?s=200&v=4" 
                        alt="Uniswap" 
                        className="footer-logo" 
                    />
                    <img 
                        src="https://cryptologos.cc/logos/the-graph-grt-logo.png" 
                        alt="Graph" 
                        className="footer-logo" 
                    />
                    <img src="/warde-logo.png" alt="Warden" className="footer-logo" />

                </div>
            </footer>
        </div>
    );
};

export default App; 