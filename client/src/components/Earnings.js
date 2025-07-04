// src/components/Earnings.js
import React, { useEffect, useState } from "react";

// Move fake data to module scope so it's not a hook dependency
const fakeSummary = {
  total: 125000,
  redeemedCoupons: 45,
  reportUrl: "/downloads/june-earnings.pdf",
};

const fakeStudentPayments = [
  {
    student: "Alice Johnson",
    courses: [
      { title: "React Basics", paid: true, amount: 499, date: "2025-06-21" },
      { title: "Advanced CSS", paid: true, amount: 299, date: "2025-06-23" },
    ],
  },
  {
    student: "Bob Smith",
    courses: [
      { title: "Node.js Mastery", paid: false, amount: 799, date: null },
    ],
  },
  {
    student: "Carlos Rivera",
    courses: [
      { title: "Python for Data Science", paid: true, amount: 999, date: "2025-06-15" },
      { title: "Machine Learning 101", paid: false, amount: 1199, date: null },
    ],
  },
];

function Earnings() {
  const [summary, setSummary] = useState({ total: 0, redeemedCoupons: 0, reportUrl: "#" });
  const [studentPayments, setStudentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate loading delay
    setTimeout(() => {
      setSummary(fakeSummary);
      setStudentPayments(fakeStudentPayments);
      setLoading(false);
    }, 500);
  }, []); // no more warnings

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold">📊 Teacher Earnings Dashboard</h2>

      {/* Summary Card */}
      <div className="card shadow-sm mb-4" style={{ maxWidth: "480px" }}>
        <div className="card-body">
          <h5 className="card-title">Overview</h5>
          <p className="card-text mb-2">
            <strong>Total Earnings:</strong>{" "}
            <span className="fs-4 text-success">
              ₹{summary.total.toLocaleString()}
            </span>
          </p>
          <p className="card-text mb-3">
            <strong>Coupons Redeemed:</strong>{" "}
            <span className="badge bg-primary">
              {summary.redeemedCoupons}
            </span>
          </p>
          <hr />
          <a
            href={summary.reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-outline-primary${!summary.reportUrl ? " disabled" : ""}`}
          >
            <i className="bi bi-download me-1"></i> Download Report
          </a>
        </div>
      </div>

      {/* Student-wise Table */}
      <h4 className="fw-bold mb-3">👨‍🎓 Student-wise Course Payments</h4>

      {loading ? (
        <p>Loading data...</p>
      ) : studentPayments.length === 0 ? (
        <p>No student payment data found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Course</th>
                <th>Payment Status</th>
                <th>Amount (₹)</th>
                <th>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {studentPayments.map((entry, idx) =>
                entry.courses.map((course, i) => (
                  <tr key={`${idx}-${i}`}>
                    {i === 0 && (
                      <td rowSpan={entry.courses.length}>{idx + 1}</td>
                    )}
                    {i === 0 && (
                      <td rowSpan={entry.courses.length}>{entry.student}</td>
                    )}
                    <td>{course.title}</td>
                    <td>
                      {course.paid ? (
                        <span className="badge bg-success">Paid</span>
                      ) : (
                        <span className="badge bg-warning text-dark">Pending</span>
                      )}
                    </td>
                    <td>{course.amount.toLocaleString()}</td>
                    <td>
                      {course.date
                        ? new Date(course.date).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Earnings;
