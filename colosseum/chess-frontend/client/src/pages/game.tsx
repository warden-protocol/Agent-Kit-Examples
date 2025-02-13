import React, { useState } from "react";
import ChessBoard from "@/components/game/ChessBoard";
import GameInfo from "@/components/game/GameInfo";
import { Card } from "@/components/ui/card";

// Define types for the messages
interface Message {
  sender: string;
  text: string;
}

const GamePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "me", text: "Good luck!" },
    { sender: "other", text: "You too!" },
  ]);
  const [message, setMessage] = useState<string>("");

  const handleSendMessage = (): void => {
    if (message.trim()) {
      setMessages([...messages, { sender: "me", text: message }]);
      setMessage(""); // Clear the input after sending
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          On-Chain Chess Game
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <ChessBoard />
            </Card>
          </div>

          <div className="lg:col-span-1 flex flex-col space-y-4">
            <GameInfo />

            {/* Chat Section */}
            <Card className="p-4 space-y-4">
              <h2 className="text-xl font-bold">Live Chat</h2>

              <div className="overflow-y-auto h-48 border rounded-md p-2 bg-gray-100 flex flex-col space-y-2">
                {messages.length === 0 ? (
                  <p className="text-gray-500">No messages yet.</p>
                ) : (
                  messages.map((msg, index) => (
                    <p
                      key={index}
                      className={`p-2 rounded-md max-w-xs ${
                        msg.sender === "me"
                          ? "bg-blue-100 text-blue-800 self-start"
                          : "bg-gray-200 text-gray-800 self-end ml-auto"
                      }`}
                    >
                      {msg.text}
                    </p>
                  ))
                )}
              </div>

              <div className="flex space-x-2">
                <textarea
                  className="flex-grow border rounded-md p-2"
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  aria-label="Type your message"
                />
                <button
                  className="bg-primary text-white rounded-md px-4 py-2"
                  onClick={handleSendMessage}
                  aria-label="Send message"
                >
                  Send
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
