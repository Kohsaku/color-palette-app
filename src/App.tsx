import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Auth from "./components/Auth";
import Collection from "./components/Collection";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import "./App.css";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/collection" element={<Collection />} />
    </Routes>
  );
};

export default App;
