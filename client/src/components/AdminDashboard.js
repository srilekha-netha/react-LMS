import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminLayout.css"; // or "./Dashboard.css" if you split it out

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    pendingApprovals: 0,
    publishedCourses: 0,
    totalEnrollments: 0,
    activeStudents: 0,
    coursesAwaitingApproval: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("❌ Failed to fetch stats:", err));
  }, []);

  const statCards = [
    { label: "👥 Total Users", value: stats.totalUsers },
    { label: "🎓 Students", value: stats.totalStudents },
    { label: "🧑‍🏫 Teachers", value: stats.totalTeachers },
    { label: "📤 Pending Approvals", value: stats.pendingApprovals },
    { label: "✅ Published Courses", value: stats.publishedCourses },
    { label: "📚 Total Enrollments", value: stats.totalEnrollments },
    { label: "🧑‍💻 Active Students", value: stats.activeStudents },
    { label: "⏳ Awaiting Approval", value: stats.coursesAwaitingApproval },
    { label: "💰 Total Earnings (₹)", value: `₹${stats.totalEarnings}` },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Admin Dashboard</h2>
      <div className="dashboard-grid">
        {statCards.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
