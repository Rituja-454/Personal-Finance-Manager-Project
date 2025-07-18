import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { loginUser } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login button clicked!");

    try {
      const data = await loginUser(formData);
      if (data.error) throw new Error(data.error);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userName", data.name);
      alert("Login Successful!");
      navigate("/home");
    } catch (err) {
      alert("Invalid login credentials!");
      setError(err.message);
    }
  };



  return (
    <>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
          <h3 className="text-center mb-4 fw-bold" style={{ color: "#6f42c1" }}>Login</h3>
          <form onSubmit={handleLogin} >
            <div className="mb-3">
              <label className="form-label fw-bold">Email Address</label>
              <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Password</label>
              <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-bold" style={{ backgroundColor: "#6f42c1", borderColor: "#6f42c1" }}>Login</button>
          </form>
          <p className="mt-3 text-center ">
            Don't have an account? <a href="/register" className="text-primary fw-bold">Register</a>
          </p>
        </div>
      </div></>
  );
};

export default Login;

