// src/components/AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    pendingApprovals: 0,
    publishedCourses: 0,
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("❌ Failed to fetch stats:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold">📊 Admin Dashboard</h2>
      <div className="row g-4">
        <StatCard label="👥 Total Users" value={stats.totalUsers} />
        <StatCard label="🎓 Students" value={stats.totalStudents} />
        <StatCard label="👨‍🏫 Teachers" value={stats.totalTeachers} />
        <StatCard label="📤 Pending Approvals" value={stats.pendingApprovals} />
        <StatCard label="✅ Published Courses" value={stats.publishedCourses} />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="col-md-4">
      <div className="card shadow-sm text-center p-3">
        <h5>{label}</h5>
        <h2 className="fw-bold text-primary">{value}</h2>
      </div>
    </div>
  );
}

export default AdminDashboard;
