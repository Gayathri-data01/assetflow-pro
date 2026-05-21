import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {

  const navigate = useNavigate();

  // FORM STATES
  const [assetType, setAssetType] = useState("");
  const [assetName, setAssetName] = useState("");
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");
  const [department, setDepartment] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [attachment, setAttachment] = useState("");

  // DATA STATES
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);

  // EDIT STATE
  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");

  // LOGOUT
  const handleLogout = () => {

    localStorage.clear();

    navigate("/");
  };

  // CREATE REQUEST
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      const res = await API.post(
        "/assets/requests",
        {
          asset_type: assetType,
          asset_name: assetName,
          reason,
          duration,
          department,
          issue_date: issueDate,
          attachment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);

      // CLEAR FORM
      clearForm();

      fetchRequests();

    } catch (err) {

      console.log(err);

      setMessage("Failed to create request");
    }
  };

  // EDIT REQUEST
  const handleEdit = async (id) => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.put(
        `/assets/requests/edit/${id}`,
        {
          asset_type: assetType,
          asset_name: assetName,
          reason,
          duration,
          department,
          issue_date: issueDate,
          attachment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);

      setEditingId(null);

      clearForm();

      fetchRequests();

    } catch (err) {

      console.log(err);

      setMessage(
        err.response?.data?.message ||
        "Edit Failed"
      );
    }
  };

  // CLEAR FORM
  const clearForm = () => {

    setAssetType("");
    setAssetName("");
    setReason("");
    setDuration("");
    setDepartment("");
    setIssueDate("");
    setAttachment("");
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

    } catch (err) {
      console.log(err);
    }
  };

  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.get(
        "/assets/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // FETCH COMMENTS
  const fetchComments = async (requestId) => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.get(
        `/assets/requests/${requestId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // FETCH HISTORY
  const fetchHistory = async (requestId) => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.get(
        `/assets/requests/${requestId}/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // LOAD DATA
  useEffect(() => {

    fetchRequests();
    fetchNotifications();

  }, []);

  return (

    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>

        <h1>Employee Dashboard</h1>

        <button
          style={styles.logoutBtn}
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* MESSAGE */}
      {message && (
        <p style={styles.message}>
          {message}
        </p>
      )}

      {/* FORM */}
      <div style={styles.card}>

        <h2>
          {editingId
            ? "Edit Asset Request"
            : "Create Asset Request"}
        </h2>

        <form
          onSubmit={
            editingId
              ? (e) => {
                  e.preventDefault();
                  handleEdit(editingId);
                }
              : handleSubmit
          }
        >

          <input
            style={styles.input}
            type="text"
            placeholder="Asset Type"
            value={assetType}
            onChange={(e) =>
              setAssetType(e.target.value)
            }
            required
          />

          <input
            style={styles.input}
            type="text"
            placeholder="Asset Name"
            value={assetName}
            onChange={(e) =>
              setAssetName(e.target.value)
            }
            required
          />

          <textarea
            style={styles.input}
            placeholder="Reason"
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
            required
          />

          <input
            style={styles.input}
            type="number"
            placeholder="Duration (Days)"
            value={duration}
            onChange={(e) =>
              setDuration(e.target.value)
            }
            required
          />

          <input
            style={styles.input}
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
            required
          />

          <input
            style={styles.input}
            type="date"
            value={issueDate}
            onChange={(e) =>
              setIssueDate(e.target.value)
            }
            required
          />

          <input
            style={styles.input}
            type="text"
            placeholder="Attachment Link"
            value={attachment}
            onChange={(e) =>
              setAttachment(e.target.value)
            }
          />

          <button
            style={styles.submitBtn}
            type="submit"
          >
            {editingId
              ? "Update Request"
              : "Submit Request"}
          </button>

        </form>

      </div>

      {/* REQUEST TABLE */}
      <div style={styles.card}>

        <h2>My Asset Requests</h2>

        {requests.length === 0 ? (

          <p>No Requests Found</p>

        ) : (

          <table style={styles.table}>

            <thead>

              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {requests.map((req) => (

                <tr key={req.id}>

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
                            : req.status === "Returned"
                            ? "orange"
                            : "blue",
                        fontWeight: "bold",
                      }}
                    >
                      {req.status}
                    </span>

                  </td>

                  <td>{req.duration} Days</td>

                  <td>

                    <button
                      style={styles.detailsBtn}
                      onClick={() => {

                        fetchComments(req.id);
                        fetchHistory(req.id);

                      }}
                    >
                      View Details
                    </button>

                    {
                      req.status === "Requested" && (

                        <button
                          style={styles.editBtn}
                          onClick={() => {

                            setEditingId(req.id);

                            setAssetType(req.asset_type);
                            setAssetName(req.asset_name);
                            setReason(req.reason);
                            setDuration(req.duration);
                            setDepartment(req.department);
                            setIssueDate(req.issue_date);
                            setAttachment(req.attachment);

                          }}
                        >
                          Edit
                        </button>

                      )
                    }

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

      {/* NOTIFICATIONS */}
      <div style={styles.card}>

        <h2>Notifications</h2>

        {notifications.length === 0 ? (

          <p>No Notifications</p>

        ) : (

          notifications.map((note) => (

            <div
              key={note.id}
              style={styles.notificationBox}
            >
              <p>{note.message}</p>
            </div>

          ))
        )}

      </div>

      {/* COMMENTS */}
      <div style={styles.card}>

        <h2>Manager Comments</h2>

        {comments.length === 0 ? (

          <p>No Comments</p>

        ) : (

          comments.map((comment) => (

            <div
              key={comment.id}
              style={styles.commentBox}
            >
              <p>
                <strong>
                  {comment.manager_name}
                </strong>
              </p>

              <p>{comment.comment}</p>
            </div>

          ))
        )}

      </div>

      {/* TIMELINE */}
      <div style={styles.card}>

        <h2>Activity Timeline</h2>

        {history.length === 0 ? (

          <p>No Timeline</p>

        ) : (

          history.map((item) => (

            <div
              key={item.id}
              style={styles.timelineBox}
            >
              <p>
                <strong>{item.action}</strong>
              </p>

              <p>{item.created_at}</p>
            </div>

          ))
        )}

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

  message: {
    color: "green",
    fontWeight: "bold",
    marginBottom: "20px",
  },

  card: {
    backgroundColor: "white",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
  },

  submitBtn: {
    backgroundColor: "blue",
    color: "white",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
  },

  detailsBtn: {
    backgroundColor: "black",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },

  editBtn: {
    backgroundColor: "orange",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    marginLeft: "10px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  notificationBox: {
    backgroundColor: "#f4f4f4",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
  },

  commentBox: {
    backgroundColor: "#f9f9f9",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
  },

  timelineBox: {
    backgroundColor: "#f4f4f4",
    padding: "10px",
    marginBottom: "10px",
    borderLeft: "5px solid blue",
  },
};

export default EmployeeDashboard;