import React, { useState, useEffect } from "react";
import { Table, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import { getExpenses, deleteExpense, updateExpense } from "../services/api";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditFormModel from "./EditFormModel";
import Sidebar from "./Sidebar";

const Transactions = () => {
  const navigate = useNavigate();
  const [transactionType, setTransactionType] = useState("all");
  const [filter, setFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, transactionType, filter]);

  const fetchTransactions = async () => {
    const data = await getExpenses();
    if (!data || data.error) {
      console.error("Failed to fetch transactions:", data.error);
      setTransactions([]);
    } else {
      setTransactions(data);
    }
  };

  const applyFilters = () => {
    let filteredData = [...transactions];

    if (transactionType !== "all") {
      filteredData = filteredData.filter(
        (t) => t.type && t.type.toLowerCase() === transactionType.toLowerCase()
      );
    }

    const now = new Date();
    filteredData = filteredData.filter((t) => {
      const transactionDate = t.date ? new Date(t.date) : null;
      if (!transactionDate || isNaN(transactionDate)) return false;

      if (filter === "lastWeek") {
        const lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);
        return transactionDate >= lastWeek;
      } else if (filter === "lastMonth") {
        const lastMonth = new Date();
        lastMonth.setMonth(now.getMonth() - 1);
        return transactionDate >= lastMonth;
      }
      return true;
    });

    filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredTransactions(filteredData);
  };


  const handleLogout = () => {
    navigate("/");
  };

  const handleDelete = async (id) => {
    const response = await deleteExpense(id);
    if (response.error) {
      console.error("Failed to delete transaction:", response.error);
    } else {
      fetchTransactions();
    }
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleUpdate = async (e, id, updatedExpense) => {
    e.preventDefault();
    if (!id || !updatedExpense) return;

    try {
      const response = await updateExpense(id, updatedExpense);
      if (!response.error) {
        fetchTransactions();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <>
      <Sidebar setSidebarOpen={setSidebarOpen} />
      <Container fluid>
        <div
          className="content p-3"
          style={{ marginLeft: "250px" }}
        >
          <Nav handleLogout={() => navigate("/")} />
          <h3 className="text-center my-4 fw-bold" style={{ color: "#6f42c1" }}>
            "View and manage all your Transactions easily!"
          </h3>

          <div className="d-flex justify-content-center mb-4 mt-4">
            <select
              className="form-select w-auto me-2 fw-bold"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="all">Show All</option>
              <option value="Income">Show Income</option>
              <option value="Expense">Show Expenses</option>
            </select>
            <select
              className="form-select w-auto fw-bold"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Transactions</option>
              <option value="lastWeek">Last Week</option>
              <option value="lastMonth">Last Month</option>
            </select>
          </div>

          <Table responsive hover>
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Type</th>
                <th>Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t._id}>
                  <td>{t.title}</td>
                  <td>₹{t.amount}</td>
                  <td>{t.category}</td>
                  <td>{t.type}</td>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td>{t.description}</td>
                  <td>
                    <Button
                      style={{ backgroundColor: "#F4B400", borderColor: "#F4B400", color: "white" }}
                      size="sm"
                      onClick={() => handleEdit(t)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      style={{ backgroundColor: "#E63946", borderColor: "#E63946", color: "white", marginLeft: "5px" }}
                      size="sm"
                      onClick={() => handleDelete(t._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <EditFormModel
            showModal={showModal}
            selectedTransaction={selectedTransaction}
            setSelectedTransaction={setSelectedTransaction}
            handleUpdate={handleUpdate}
            setShowModal={setShowModal}
          />
        </div>
      </Container>
    </>
  );

};

export default Transactions;
