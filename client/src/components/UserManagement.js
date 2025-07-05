import React, { useEffect, useState } from "react";
import axios from "axios";

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
      fetchUsers();
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
      fetchUsers();
    } catch {
      alert("Failed to update block status");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
      fetchUsers();
    } catch {
      alert("Failed to delete user");
    }
  };

  const filtered = users.filter((u) => {
    const byRole = filterRole === "all" || u.role === filterRole;
    const name = u.name || "";
    const email = u.email || "";
    return (
      byRole &&
      (name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4 fw-bold">👥 User Management</h2>

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
        <table className="table">
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
                  <td>{user.name || "N/A"}</td>
                  <td>{user.email || "N/A"}</td>
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
                      className={`badge ${
                        user.blocked ? "bg-danger" : "bg-success"
                      } text-white`}
                    >
                      {user.blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-warning me-2"
                      onClick={() =>
                        handleBlockToggle(user._id, user.blocked)
                      }
                    >
                      {user.blocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
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
