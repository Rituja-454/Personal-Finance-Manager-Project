import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import "./components/home.css"
import Transactions from "./components/Transactions";
import Reports from "./components/Reports";
import SetBudget from "./components/SetBudget";
import Sidebar from "./components/Sidebar";
import NavbarComponent from "./components/NavbarComponent";
import Nav from "./components/Nav";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/reports" element={< Reports />} />
        <Route path="/setbudget" element={< SetBudget />} />
        <Route element={< NavbarComponent />} />
        <Route element={< Nav />} />
        <Route element={< Sidebar />} />
        
      </Routes>
    </Router>
  </React.StrictMode>
);
