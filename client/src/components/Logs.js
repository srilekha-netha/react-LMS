import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Table, Spinner, Alert } from "react-bootstrap";

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
    <Container className="my-4">
      <Card>
        <Card.Header as="h5">📋 System Logs & Activity</Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" />
              <p>Loading logs...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : logs.length === 0 ? (
            <p className="text-center">No logs found.</p>
          ) : (
            <Table striped bordered hover responsive className="mt-3">
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
                {logs.map((log, index) => (
                  <tr key={log._id || index}>
                    <td>{index + 1}</td>
                    <td className="text-wrap">{log.action || "-"}</td>
                    <td className="text-wrap">{log.user || "-"}</td>
                    <td>{log.role || "-"}</td>
                    <td>{log.ip || "-"}</td>
                    <td>
                      {log.timestamp
                        ? new Date(log.timestamp).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Logs;
