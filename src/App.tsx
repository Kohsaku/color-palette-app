import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Auth from "./components/Auth";
import "./App.css";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
    </Routes>
  );
};

export default App;
