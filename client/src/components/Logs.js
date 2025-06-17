import React from "react";
import { Table, Container, Card } from "react-bootstrap";

const logsData = [
  {
    id: 1,
    action: "User Login",
    user: "admin@example.com",
    role: "Admin",
    ip: "192.168.1.10",
    timestamp: "2025-06-17 09:45:32",
  },
  {
    id: 2,
    action: "Deleted Course",
    user: "admin@example.com",
    role: "Admin",
    ip: "192.168.1.10",
    timestamp: "2025-06-16 16:22:08",
  },
  {
    id: 3,
    action: "Updated Payment Settings",
    user: "admin@example.com",
    role: "Admin",
    ip: "192.168.1.10",
    timestamp: "2025-06-15 12:05:47",
  },
];

function Logs() {
  return (
    <Container className="my-4">
      <Card>
        <Card.Header as="h5">System Logs & Activity</Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
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
              {logsData.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.action}</td>
                  <td>{log.user}</td>
                  <td>{log.role}</td>
                  <td>{log.ip}</td>
                  <td>{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Logs;
