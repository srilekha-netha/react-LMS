// src/components/UserManagement.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentDashboard.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch users:", err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role: newRole }
      );
      await fetchUsers();
    } catch {
      alert("Failed to update role");
    }
  };

  const handleBlockToggle = async (userId, isBlocked) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/block`,
        { blocked: !isBlocked }
      );
      await fetchUsers();
    } catch {
      alert("Failed to update block status");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
      await fetchUsers();
    } catch {
      alert("Failed to delete user");
    }
  };

  // apply client-side role & search filters, with guards against undefined
  const filtered = users.filter((u) => {
    const byRole = filterRole === "all" || u.role === filterRole;

    const needle = search.toLowerCase();
    const name  = (u.name  || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const byText = name.includes(needle) || email.includes(needle);

    return byRole && byText;
  });

  return (
    <div className="container-fluid">
      <h2 className="mb-4 fw-bold">👥 User Management</h2>

      {/* dropdown + search in one row */}
      <div className="d-flex mb-3 align-items-center">
        <select
          className="form-select form-select-sm me-2"
          style={{ maxWidth: "150px" }}
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">All</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
        </select>

        <input
          type="text"
          className="form-control flex-grow-1"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((user) => (
                <tr key={user._id}>
                  <td>{user.name || "-"}</td>
                  <td>{user.email || "-"}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  </td>
                  <td>
                    <span
                      className={`dashboard-badge-status ${
                        user.blocked
                          ? "bg-danger text-white"
                          : "bg-success text-white"
                      }`}
                    >
                      {user.blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-sm btn-outline-warning dashboard-action-btn"
                        onClick={() =>
                          handleBlockToggle(user._id, user.blocked)
                        }
                      >
                        {user.blocked ? "Unblock" : "Block"}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger dashboard-action-btn"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;
