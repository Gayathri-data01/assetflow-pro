import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    department: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {

      await API.post("/auth/register", formData);

      alert("Registration Successful");

      navigate("/");

    } catch (err) {
      console.log(err);

      setMessage(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1>Register</h1>

        {message && (
          <p style={{ color: "red" }}>{message}</p>
        )}

        <form onSubmit={handleRegister}>

          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Enter Name"
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="text"
            name="department"
            placeholder="Department"
            onChange={handleChange}
            required
          />

          <select
            style={styles.input}
            name="role"
            onChange={handleChange}
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>

          <button style={styles.button} type="submit">
            Register
          </button>

        </form>

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
    background: "#f4f4f4",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    width: "350px",
    boxShadow: "0px 0px 10px gray",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "black",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default Register;