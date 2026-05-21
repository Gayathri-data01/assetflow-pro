import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function ManagerDashboard() {

  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [comment, setComment] = useState("");

  // LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // FETCH REQUESTS
  const fetchRequests = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.get(
        "/assets/requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(res.data);
      setFilteredRequests(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {

    try {

      const token = localStorage.getItem("token");

      await API.put(
        `/assets/requests/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Status Updated");

      fetchRequests();

    } catch (err) {
      console.log(err);
    }
  };

  // ADD COMMENT
  const addComment = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await API.post(
        `/assets/requests/${id}/comments`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Comment Added");

      setComment("");

    } catch (err) {
      console.log(err);
    }
  };

  // SEARCH
  useEffect(() => {

    const filtered = requests.filter((req) =>

      req.asset_name
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      req.employee_name
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      req.status
        .toLowerCase()
        .includes(search.toLowerCase())

    );

    setFilteredRequests(filtered);

  }, [search, requests]);

  useEffect(() => {
    fetchRequests();
  }, []);

  return (

    <div style={styles.container}>

      <div style={styles.header}>

        <h1>Manager Dashboard</h1>

        <button
          style={styles.logoutBtn}
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {message && (
        <p style={styles.message}>
          {message}
        </p>
      )}

      <input
        type="text"
        placeholder="Search Requests..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {filteredRequests.length === 0 ? (

        <p>No Requests Found</p>

      ) : (

        <table style={styles.table}>

          <thead>

            <tr>
              <th>Employee</th>
              <th>Asset</th>
              <th>Type</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {filteredRequests.map((req) => (

              <tr key={req.id}>

                <td>{req.employee_name}</td>

                <td>{req.asset_name}</td>

                <td>{req.asset_type}</td>

                <td>

                  <span
                    style={{
                      color:
                        req.status === "Approved"
                          ? "green"
                          : req.status === "Rejected"
                          ? "red"
                          : "orange",
                      fontWeight: "bold",
                    }}
                  >
                    {req.status}
                  </span>

                </td>

                <td>{req.duration} Days</td>

                <td>

                  <button
                    style={styles.approveBtn}
                    onClick={() =>
                      updateStatus(req.id, "Approved")
                    }
                  >
                    Approve
                  </button>

                  <button
                    style={styles.rejectBtn}
                    onClick={() =>
                      updateStatus(req.id, "Rejected")
                    }
                  >
                    Reject
                  </button>

                  <button
                    style={styles.returnBtn}
                    onClick={() =>
                      updateStatus(req.id, "Returned")
                    }
                  >
                    Returned
                  </button>

                  <div style={{ marginTop: "10px" }}>

                    <input
                      type="text"
                      placeholder="Add Comment"
                      value={comment}
                      onChange={(e) =>
                        setComment(e.target.value)
                      }
                      style={{
                        padding: "5px",
                        marginRight: "5px",
                      }}
                    />

                    <button
                      onClick={() =>
                        addComment(req.id)
                      }
                    >
                      Add
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

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

  message: {
    color: "green",
    fontWeight: "bold",
    marginBottom: "15px",
  },

  search: {
    width: "300px",
    padding: "10px",
    marginBottom: "20px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
  },

  approveBtn: {
    backgroundColor: "green",
    color: "white",
    border: "none",
    padding: "8px",
    marginRight: "5px",
    cursor: "pointer",
  },

  rejectBtn: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "8px",
    marginRight: "5px",
    cursor: "pointer",
  },

  returnBtn: {
    backgroundColor: "orange",
    color: "white",
    border: "none",
    padding: "8px",
    cursor: "pointer",
  },
};

export default ManagerDashboard;