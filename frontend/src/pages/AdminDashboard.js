import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);

  // LOGOUT
  const handleLogout = () => {

    localStorage.clear();

    navigate("/");
  };

  // FETCH SUMMARY
  const fetchSummary = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.get(
        "/dashboard/summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummary(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {

    fetchSummary();

  }, []);

  if (!summary) {
    return <h2>Loading...</h2>;
  }

  return (

    <div style={styles.container}>

      <div style={styles.header}>

        <h1>Admin Dashboard</h1>

        <button
          style={styles.logoutBtn}
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* CARDS */}
      <div style={styles.cardContainer}>

        <div style={styles.card}>
          <h2>Total Requests</h2>
          <p>{summary.totalRequests}</p>
        </div>

        <div style={styles.card}>
          <h2>Approved</h2>
          <p>{summary.approvedRequests}</p>
        </div>

        <div style={styles.card}>
          <h2>Returned</h2>
          <p>{summary.returnedAssets}</p>
        </div>

        <div style={styles.card}>
          <h2>Pending</h2>
          <p>{summary.pendingApprovals}</p>
        </div>

      </div>

      {/* DEPARTMENT STATS */}
      <div style={styles.departmentBox}>

        <h2>Department Statistics</h2>

        <table style={styles.table}>

          <thead>

            <tr>
              <th>Department</th>
              <th>Total Requests</th>
            </tr>

          </thead>

          <tbody>

            {summary.departmentStats.map((dept) => (

              <tr key={dept.department}>

                <td>{dept.department}</td>

                <td>{dept.count}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

const styles = {

  container: {
    padding: "20px",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  logoutBtn: {
    backgroundColor: "black",
    color: "white",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
  },

  cardContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },

  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "200px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  departmentBox: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

export default AdminDashboard;