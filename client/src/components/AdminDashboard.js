import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
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
    { label: "⏳ Awaiting Approvals", value: stats.coursesAwaitingApproval },
    { label: "💰 Total Earnings (₹)", value: `₹${stats.totalEarnings}` },
  ];

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold">📊 Admin Dashboard</h2>
      <div className="row g-4">
        {statCards.map((stat, index) => (
          <StatCard key={index} label={stat.label} value={stat.value} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="col-12 col-sm-6 col-md-4">
      <div className="card shadow-sm text-center p-3 border-0 rounded-3">
        <h5 className="mb-2 fw-semibold">{label}</h5>
        <h2 className="fw-bold text-primary">{value}</h2>
      </div>
    </div>
  );
}

export default AdminDashboard;
