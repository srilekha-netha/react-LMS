// src/components/TeacherOnboarding.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentDashboard.css";  // or a dedicated CSS

function TeacherOnboarding() {
  const [teachers, setTeachers] = useState([]);

  // Fetch pending teachers on mount
  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/onboarding/pending")
      .then(res => setTeachers(res.data))
      .catch(err => console.error("Load pending teachers failed:", err));
  }, []);

  // Approve a teacher
  const verifyTeacher = id => {
    axios.put(`http://localhost:5000/api/admin/onboarding/${id}/verify`)
      .then(() => {
        setTeachers(ts => ts.filter(t => t._id !== id));
      })
      .catch(() => alert("Verification failed"));
  };

  // Reject (delete) teacher signup
  const rejectTeacher = id => {
    if (!window.confirm("Reject and delete this teacher account?")) return;
    axios.delete(`http://localhost:5000/api/admin/users/${id}`)
      .then(() => {
        setTeachers(ts => ts.filter(t => t._id !== id));
      })
      .catch(() => alert("Delete failed"));
  };

  return (
    <div className="container-fluid py-3">
      <h2 className="mb-3">Teacher Onboarding & Verification</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle dashboard-table">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length > 0 ? teachers.map(t => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.email}</td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-success me-1"
                    onClick={() => verifyTeacher(t._id)}
                  >
                    Verify
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => rejectTeacher(t._id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} className="text-center text-muted py-4">
                  No pending teacher sign-ups.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeacherOnboarding;
