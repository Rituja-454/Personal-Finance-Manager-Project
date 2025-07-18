import axios from "axios";
const API_URL = "http://localhost:5000/api";  

const API = axios.create({
  baseURL: API_URL,  
  headers: { "Content-Type": "application/json" },
});

export const registerUser = async (formData) => {
  console.log("Sending API request to register:", formData);  
  const response = await axios.post(`${API_URL}/auth/register`, formData);
  console.log("API Response:", response.data);
  return response.data;
};

export const loginUser = async (formData) => {
  console.log("Sending login request:", formData);  
  const response = await axios.post(`${API_URL}/auth/login`, formData);
  console.log("Login response:", response.data);
  return response.data;
};

export const getExpenses = async () => {
  const response = await fetch(`${API_URL}/transactions`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.json();
};

export const getUserDetails = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};


export const addExpense = async (expenseData) => {
  const token = localStorage.getItem("token");
  return await API.post("/transactions", expenseData, {  
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateExpense = async (id, expense) => {
  if (!id || typeof id !== "string") {
    console.error("Invalid transaction ID:", id);
    return { error: "Invalid ID" };
  }

  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`${API_URL}/transactions/${id}`, expense, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating transaction:", error);
    return { error: error.response?.data || "Failed to update expense" };
  }
};

export const deleteExpense = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${API_URL}/transactions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },  
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting expense:", error);
    return { error: error.response?.data?.message || "Failed to delete expense" };
  }
};

export default API;
