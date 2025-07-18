import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { HouseDoor, ListCheck, BarChart, Wallet2 } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import LogoImg from "../assets/logo.png";
import "./home.css";

const NavbarComponent = ({ handleLogout }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";


  return (
    <nav className="navbar navbar-expand-lg bg-light shadow p-3">
      <div className="container">
        <a className="navbar-brand fw-bold text-black d-flex align-items-center" href="#">
          <img
            src={LogoImg}
            alt="Logo"
            className="logo me-2"
            style={{ width: "45px", height: "45px", borderRadius: "5px", objectFit: "cover" }}
          />
          Personal Finance Manager
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav custom-nav d-flex align-items-center gap-4">
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={() => navigate("/home")}>
                <HouseDoor className="me-2" /> Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={() => navigate("/transactions")}>
                <ListCheck className="me-2" /> Transactions
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={() => navigate("/reports")}>
                <BarChart className="me-2" /> Reports
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={() => navigate("/setbudget")}>
                <Wallet2 className="me-2" /> Budgets
              </a>
            </li>
            <li className="nav-item">
              <button className="btn btn-danger d-flex align-items-center" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Logout
              </button>
            </li>

            <li className="nav-item">
              <li className="nav-item d-flex align-items-center gap-2">
                <FaUserCircle className="fs-2 text-secondary cursor-pointer" />
                <span className="fw-bold text-dark">{userName}</span>
              </li>

            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
