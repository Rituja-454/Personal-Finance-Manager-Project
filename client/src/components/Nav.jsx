
import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import LogoImg from "../assets/logo.png";

const NavbarComponent = ({ handleLogout }) => {

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
              <button className="btn btn-danger d-flex align-items-center" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
