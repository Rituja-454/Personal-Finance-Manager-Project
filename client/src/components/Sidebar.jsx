import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserCircle, FaHome, FaExchangeAlt, FaChartPie, FaWallet } from "react-icons/fa";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userName = localStorage.getItem("userName") || "User";

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="position-fixed top-0 start-0 h-100 text-white p-3" style={{ width: "250px", background: "linear-gradient(to bottom, #2C3E50, #1F2A38)" }}>


            <div className="d-flex flex-column align-items-center text-center mb-4">
                <FaUserCircle size={80} className="text-secondary mt-3" />
                <h5 className="mt-3">{userName}</h5>
            </div>

            <ul className="list-unstyled">
                <li className="p-2 mb-3">
                    <button
                        className={`btn w-100 text-start p-2 rounded ${location.pathname === "/home" ? "bg-light text-dark" : "text-white"}`}
                        onClick={() => handleNavigation("/home")}
                    >
                        <FaHome className="me-2" /> Dashboard
                    </button>
                </li>
                <li className="p-2 mb-3">
                    <button
                        className={`btn w-100 text-start p-2 rounded ${location.pathname === "/transactions" ? "bg-light text-dark" : "text-white"}`}
                        onClick={() => handleNavigation("/transactions")}
                    >
                        <FaExchangeAlt className="me-2" /> Transactions
                    </button>
                </li>
                <li className="p-2 mb-3">
                    <button
                        className={`btn w-100 text-start p-2 rounded ${location.pathname === "/reports" ? "bg-light text-dark" : "text-white"}`}
                        onClick={() => handleNavigation("/reports")}
                    >
                        <FaChartPie className="me-2" /> Reports
                    </button>
                </li>
                <li className="p-2 mb-3">
                    <button
                        className={`btn w-100 text-start p-2 rounded ${location.pathname === "/setbudget" ? "bg-light text-dark" : "text-white"}`}
                        onClick={() => handleNavigation("/setbudget")}
                    >
                        <FaWallet className="me-2" /> Budgets
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
