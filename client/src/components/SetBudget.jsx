import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.css";
import { getExpenses } from "../services/api";
import { FaPencilAlt } from "react-icons/fa";

const Reports = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [budgets, setBudgets] = useState([]);
  const [budgetInputs, setBudgetInputs] = useState({ category: "", limit: "" });
  const [transactions, setTransactions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [futurePayments, setFuturePayments] = useState(() => JSON.parse(localStorage.getItem(`futurePayments_${userId}`)) || []);
  const [isEditing, setIsEditing] = useState(false);
  const [paymentInput, setPaymentInput] = useState(futurePayments.join("\n"));

  useEffect(() => {
    if (userId) {
      fetchTransactions();
      loadBudgets();
      loadFuturePayments();
    }
  }, [userId]);

  useEffect(() => {
    if (transactions.length > 0 && budgets.length > 0) {
      updateBudgets();
    }
  }, [transactions]);

  const fetchTransactions = async () => {
    const data = await getExpenses();
    if (!data || data.error) {
      console.error("Failed to fetch transactions:", data.error);
      setTransactions([]);
    } else {
      const userTransactions = data.filter((t) => t.userId === userId);
      setTransactions(userTransactions);
    }
  };

  const loadBudgets = () => {
    const storedBudgets = JSON.parse(localStorage.getItem(`budgets_${userId}`)) || [];
    setBudgets(storedBudgets);
  };

  const updateBudgets = () => {
    const spentByCategory = transactions.reduce((acc, t) => {
      if (t.category && t.amount) {
        acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
      }
      return acc;
    }, {});

    const updatedBudgets = budgets.map((b) => ({
      ...b,
      spent: spentByCategory[b.category] || 0,
    }));

    if (JSON.stringify(updatedBudgets) !== JSON.stringify(budgets)) {
      setBudgets(updatedBudgets);
      localStorage.setItem(`budgets_${userId}`, JSON.stringify(updatedBudgets));
    }
  };

  const handleSetBudget = () => {
    const { category, limit } = budgetInputs;
    if (category && limit) {
      const spentAmount = transactions.filter((t) => t.category === category).reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const updatedBudgets = budgets.some((b) => b.category === category)
        ? budgets.map((b) => (b.category === category ? { ...b, limit: parseFloat(limit), spent: spentAmount } : b))
        : [...budgets, { category, limit: parseFloat(limit), spent: spentAmount }];
      setBudgets(updatedBudgets);
      localStorage.setItem(`budgets_${userId}`, JSON.stringify(updatedBudgets));
      setBudgetInputs({ category: "", limit: "" });
    }
  };

  const loadFuturePayments = () => {
    if (userId) {
      const storedPayments = JSON.parse(localStorage.getItem(`futurePayments_${userId}`)) || [];
      setFuturePayments(storedPayments);
      setPaymentInput(storedPayments.join("\n")); // Prefill input
    }
  };

  const handleSavePayments = () => {
    if (!userId) return;

    const paymentList = paymentInput.split("\n").filter((p) => p.trim() !== "");
    setFuturePayments(paymentList);
    localStorage.setItem(`futurePayments_${userId}`, JSON.stringify(paymentList));
    setIsEditing(false);
  };

  return (
    <>
      <div className="d-flex">
        <Sidebar setSidebarOpen={setSidebarOpen} />
        <div
          className="container p-3"
          style={{ marginLeft: "250px" }}
        >
          <Nav handleLogout={() => navigate("/")} />
          <h3 className="text-center mb-4 mt-4 fw-bold" style={{ color: "#6f42c1" }}>
            "Set your budget here and take control of your expenses!"
          </h3>

          <div className="mb-5">
            <h4 className="fw-bold">Set Budgets</h4>
            <div className="d-flex mb-4">
              <select
                className="form-select me-2 fw-bold"
                value={budgetInputs.category}
                onChange={(e) => setBudgetInputs({ ...budgetInputs, category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health</option>
              </select>
              <input
                type="number"
                placeholder="Set Limit"
                value={budgetInputs.limit}
                onChange={(e) => setBudgetInputs({ ...budgetInputs, limit: e.target.value })}
                className="form-control me-2 fw-bold"
              />
              <button className="btn btn-primary" onClick={handleSetBudget}>Set Budget</button>
            </div>

            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Category</th>
                  <th>Budget Limit</th>
                  <th>Amount Spent</th>
                  <th>Remaining</th>
                  <th>Usage</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((b) => (
                  <tr key={b.category}>
                    <td>{b.category}</td>
                    <td>₹{b.limit}</td>
                    <td>₹{b.spent}</td>
                    <td>₹{b.limit - b.spent}</td>
                    <td>
                      <div className="progress">
                        <div
                          className={`progress-bar ${b.spent / b.limit > 0.8 ? "bg-danger" : "bg-success"}`}
                          role="progressbar"
                          style={{ width: `${(b.spent / b.limit) * 100}%` }}
                          aria-valuenow={(b.spent / b.limit) * 100}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {Math.round((b.spent / b.limit) * 100)}%
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="future-payments-box p-3 border rounded">
            <div className="d-flex align-items-center gap-2">
              <h4 className="fw-bold mb-0">Future Payments</h4>
              <div
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  backgroundColor: "#ADD8E6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
                onClick={() => setIsEditing(true)}
              >
                <FaPencilAlt style={{ color: "#000" }} />
              </div>
            </div>

            {isEditing ? (
              <div className="mt-2">
                <textarea
                  className="form-control"
                  placeholder="Enter future payments, one per line..."
                  value={paymentInput}
                  onChange={(e) => setPaymentInput(e.target.value)}
                  rows={4}
                />
                <button className="btn btn-success mt-2" onClick={handleSavePayments}>
                  Save
                </button>
              </div>
            ) : (
              <ul className="mt-2">
                {futurePayments.length > 0 ? (
                  futurePayments.map((payment, index) => <li key={index}>{payment}</li>)
                ) : (
                  <p className="text-muted">No future payments listed.</p>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;


