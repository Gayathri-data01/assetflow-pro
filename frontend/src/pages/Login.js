import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await API.post("/auth/login", formData);

      // Save token and role
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);

      alert("Login Successful");

      // Role-based navigation
      if (response.data.user.role === "employee") {
        navigate("/employee");
      } else if (response.data.user.role === "manager") {
        navigate("/manager");
      } else if (response.data.user.role === "admin") {
        navigate("/admin");
      }

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.title}>AssetFlow Pro</h1>
        <p style={styles.subtitle}>Login to continue</p>

        {error && (
          <p style={styles.error}>{error}</p>
        )}

        <form onSubmit={handleLogin}>

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Login
          </button>

        </form>

        <p style={{ marginTop: "15px" }}>
          Don’t have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
  },

  card: {
    width: "350px",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
    textAlign: "center",
  },

  title: {
    marginBottom: "10px",
  },

  subtitle: {
    marginBottom: "20px",
    color: "gray",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },

  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    backgroundColor: "#000",
    color: "#fff",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  error: {
    color: "red",
    marginBottom: "15px",
  },

  link: {
    color: "blue",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Login;