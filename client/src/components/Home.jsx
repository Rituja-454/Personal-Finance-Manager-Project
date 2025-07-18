import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import balanceImg from "../assets/balance.jpg";
import incomeImg from "../assets/income.avif";
import expenseImg from "../assets/expense.jpg";
import AddExpenseModal from "./AddExpenseModal";
import NavbarComponent from "./NavbarComponent";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
      calculateTotals(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const calculateTotals = (transactions) => {
    let income = 0;
    let expenses = 0;

    transactions.forEach((transaction) => {
      if (transaction.type.toLowerCase() === "income") {
        income += transaction.amount;
      } else if (transaction.type.toLowerCase() === "expense") {
        expenses += transaction.amount;
      }
    });

    setTotalIncome(income);
    setTotalExpenses(expenses);
    setTotalBalance(income - expenses);
  };

  return (
    <div className="container-fluid bg-white min-vh-100">

      <NavbarComponent handleLogout={() => navigate("/")} />

      <div className="text-center my-4">
        <h3 className="fw-bold" style={{ margin: "40px 0", textAlign: "center", fontFamily: "Poppins", color: "#6f42c1" }}>
          "Smart budgeting made simple - track, save, and grow!"
        </h3>
      </div>

      <div className="d-flex justify-content-center mb-4">
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          <FaPlus /> Add New Transaction
        </button>
      </div>
      <AddExpenseModal show={showModal} handleClose={() => setShowModal(false)} fetchTransactions={fetchTransactions} />

      <div className="d-flex justify-content-around flex-wrap mb-4">
        <div className="card text-center p-3 shadow" style={{ width: "20rem", height: "25rem" }}>
          <img src={balanceImg} alt="Total Balance" className="card-img-top" style={{ height: "300px", objectFit: "contain" }} />
          <div className="card-body">
            <h5 className="fw-bold">Total Balance</h5>
            <h3>₹{totalBalance.toFixed(2)}</h3>
          </div>
        </div>

        <div className="card text-center p-3 shadow" style={{ width: "20rem", height: "25rem" }}>
          <img src={incomeImg} alt="Total Income" className="card-img-top" style={{ height: "300px", objectFit: "contain" }} />
          <div className="card-body">
            <h5 className="fw-bold">Total Income</h5>
            <h3>₹{totalIncome.toFixed(2)}</h3>
          </div>
        </div>

        <div className="card text-center p-3 shadow" style={{ width: "20rem", height: "25rem" }}>
          <img src={expenseImg} alt="Total Expenses" className="card-img-top" style={{ height: "300px", objectFit: "contain" }} />
          <div className="card-body">
            <h5 className="fw-bold">Total Expenses</h5>
            <h3>₹{totalExpenses.toFixed(2)}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
