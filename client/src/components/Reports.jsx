import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Sidebar from "./Sidebar";
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer
} from "recharts";
import axios from "axios";
import moment from "moment";

const Reports = () => {
  const [timeFilter, setTimeFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      processCategoryData();
      processBarChartData();
    }
  }, [transactions, timeFilter]);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const filterTransactions = (data) => {
    if (timeFilter === "all") return data;
    const now = moment();
    return data.filter((t) => {
      const transactionDate = moment(t.date);
      if (timeFilter === "weekly") return transactionDate.isSameOrAfter(now.clone().subtract(7, "days"));
      if (timeFilter === "monthly") return transactionDate.isSameOrAfter(now.clone().subtract(1, "month"));
      return true;
    });
  };

  const processCategoryData = () => {
    let filteredTransactions = filterTransactions(transactions);
    let categories = filteredTransactions
      .filter((t) => t?.type?.toLowerCase() === "expense")
      .reduce((acc, curr) => {
        if (!curr.category || !curr.amount) return acc;
        let found = acc.find((item) => item.name === curr.category);
        if (found) {
          found.value += curr.amount;
        } else {
          acc.push({ name: curr.category, value: curr.amount });
        }
        return acc;
      }, []);

    if (categories.length === 0) {
      categories = [{ name: "Other", value: 1 }];
    }
    setCategoryData(categories);
  };

  const processBarChartData = () => {
    let filteredTransactions = filterTransactions(transactions);
    let groupedData = {};

    filteredTransactions.forEach(({ date, amount, type }) => {
      if (!date || !amount || !type) return;

      let monthName = moment(date).format("MMM");
      if (!groupedData[monthName]) {
        groupedData[monthName] = { name: monthName, income: 0, expense: 0 };
      }

      if (type.toLowerCase() === "income") {
        groupedData[monthName].income += amount;
      } else if (type.toLowerCase() === "expense") {
        groupedData[monthName].expense += amount;
      }
    });

    setBarChartData(Object.values(groupedData));
  };

  return (
    <>
      <Sidebar setSidebarOpen={setSidebarOpen} />
      <div
        className="content p-3"
        style={{ marginLeft: "250px" }}
      >
        <Nav handleLogout={() => navigate("/")} />
        <div className="container-fluid bg-white vh-90 overflow-hidden">
          <h3 className="text-center mb-4 my-4 fw-bold" style={{ color: "#6f42c1" }}>
            View Clear Financial Reports Easily!
          </h3>

          <div className="d-flex justify-content-center mb-3">
            <select className="form-select w-auto fw-bold" value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
              <option value="all">All Transactions</option>
              <option value="weekly">Last Week</option>
              <option value="monthly">Last Month</option>
            </select>
          </div>

          <div className="container d-flex justify-content-center align-items-center mt-4">
            <div className="row w-100">
              <div className="col-md-6 d-flex flex-column align-items-center fw-bold">
                <h5 className="fw-bold">Bar Chart</h5>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill="#28A745" />
                    <Bar dataKey="expense" fill="#DC3545" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="col-md-6 d-flex flex-column align-items-center">
                <h5 className="fw-bold">Pie Chart</h5>
                <ResponsiveContainer width={400} height={400}>
                  <PieChart className="fw-bold">
                    <Pie data={categoryData} cx="50%" cy="53%" outerRadius={143} fill="#8884d8" dataKey="value" label>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
