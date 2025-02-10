import React from "react";
import "./index.css";
import Discover from "./Discover";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import Layout from "./Layout";
import Agent from "./Agent";
import Game from "./Game";
// import ChessGame from "./ChessGame"; // Import the chess game component here
import ChessGame from "./ChessGame";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Parent Route for Tabs */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Discover />} />{/* Default Tab */}
          <Route path="Game" element={<Game />} />
          <Route path="Agent" element={<Agent />} /> {/* Use lowercase */}
          <Route path="Profile" element={<Profile />} /> {/* Use lowercase */}
        </Route>
        <Route path="/ChessGame" element={<ChessGame />} />
      </Routes>
    </Router>
  );
}
