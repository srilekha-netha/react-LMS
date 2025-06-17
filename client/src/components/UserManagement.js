// src/components/UserManagement.js
import React, { useState } from "react";
import { Table, Tabs, Tab, Button } from "react-bootstrap";

const dummyUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Teacher",
    email: "jane@edu.com",
    role: "Teacher",
    status: "Pending",
  },
  {
    id: 3,
    name: "Admin Man",
    email: "admin@site.com",
    role: "Admin",
    status: "Active",
  },
];

function UserManagement() {
  const [key, setKey] = useState("Users");

  const filteredUsers = dummyUsers.filter((user) => user.role === key.slice(0, -1)); // "Users" => "User"

  return (
    <div>
      <h2>User Management</h2>
      <Tabs
        id="user-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
        fill
      >
        <Tab eventKey="Users" title="Users"></Tab>
        <Tab eventKey="Teachers" title="Teachers"></Tab>
        <Tab eventKey="Admins" title="Admins"></Tab>
      </Tabs>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td className="text-center">
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => alert(`Edit user ${user.name}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="me-2"
                    onClick={() => alert(`Delete user ${user.name}`)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => alert(`Reset password for ${user.name}`)}
                  >
                    Reset Password
                  </Button>
                  {user.role === "User" && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => alert(`Promote ${user.name} to Teacher`)}
                    >
                      Promote
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No {key.toLowerCase()} found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default UserManagement;
