// src/components/Logs.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Spinner, Alert } from "react-bootstrap";
import "./AdminLayout.css"; // our merged CSS

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/logs");
        if (Array.isArray(res.data)) {
          const sorted = res.data.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          setLogs(sorted);
        } else {
          setError("Invalid logs data received.");
        }
      } catch (err) {
        console.error("❌ Failed to fetch logs:", err);
        setError("Failed to load logs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <Container className="logs-container my-4">
      <h2 className="logs-title mb-3">📋 System Logs & Activity</h2>

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading logs...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : logs.length === 0 ? (
        <p className="text-center">No logs found.</p>
      ) : (
        <div className="table-responsive logs-table-wrapper">
          <table className="table logs-table">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Action</th>
                <th>User</th>
                <th>Role</th>
                <th>IP Address</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={log._id || idx}>
                  <td data-label="#">{idx + 1}</td>
                  <td data-label="Action">{log.action || "-"}</td>
                  <td data-label="User">{log.user || "-"}</td>
                  <td data-label="Role">{log.role || "-"}</td>
                  <td data-label="IP Address">{log.ip || "-"}</td>
                  <td data-label="Timestamp">
                    {log.timestamp
                      ? new Date(log.timestamp).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}

export default Logs;
