import React, { useEffect, useState } from "react";
import axios from "axios";
import './TeacherLayout.css'; // Make sure this CSS file exists

function Earnings() {
  const [summary, setSummary] = useState({
    total: 0,
    redeemedCoupons: 0,
    reportUrl: "#",
  });
  const [studentPayments, setStudentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")); // teacher

  useEffect(() => {
    if (!user?._id) return;

    // Fetch summary
    axios
      .get(`http://localhost:5000/api/teacher/earnings/summary/${user._id}`)
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("❌ Earnings summary error:", err));

    // Fetch student payments
    axios
      .get(`http://localhost:5000/api/teacher/earnings/by-student/${user._id}`)
      .then((res) => {
        setStudentPayments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Student payment error:", err);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="earnings-wrapper">
      <div className="earnings-container container">
        <h2 className="earnings-title">
          📊 Teacher Earnings Dashboard
        </h2>

        {/* Summary Card */}
        <div className="earnings-summary-card card mb-4">
          <div className="card-body">
            <h5 className="card-title">Overview</h5>
            <p className="card-text mb-2">
              <strong>Total Earnings:</strong>{" "}
              <span className="fs-4 text-success">
                ₹{summary.total?.toLocaleString() || 0}
              </span>
            </p>
            <p className="card-text mb-3">
              <strong>Coupons Redeemed:</strong>{" "}
              <span className="badge bg-primary">
                {summary.redeemedCoupons || 0}
              </span>
            </p>
            <hr />
            <a
              href={summary.reportUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary"
              disabled={!summary.reportUrl}
            >
              <i className="bi bi-download me-1"></i> Download Report
            </a>
          </div>
        </div>

        {/* Student-wise Table */}
        <h4 className="earnings-subtitle">👨‍🎓 Student-wise Course Payments</h4>

        {loading ? (
          <p>Loading data...</p>
        ) : studentPayments.length === 0 ? (
          <p>No student payment data found.</p>
        ) : (
          <div className="table-responsive earnings-table">
            <table className="table table-bordered table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Course</th>
                  <th>Payment Status</th>
                  <th>Amount</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {studentPayments.map((entry, index) =>
                  entry.courses.map((course, i) => (
                    <tr key={`${index}-${i}`}>
                      {i === 0 && (
                        <td rowSpan={entry.courses.length}>{index + 1}</td>
                      )}
                      {i === 0 && (
                        <td rowSpan={entry.courses.length}>{entry.student}</td>
                      )}
                      <td>{course.title}</td>
                      <td>
                        {course.paid ? (
                          <span className="badge bg-success">Paid</span>
                        ) : (
                          <span className="badge bg-warning text-dark">
                            Pending
                          </span>
                        )}
                      </td>
                      <td>₹{course.amount}</td>
                      <td>
                        {course.date
                          ? new Date(course.date).toLocaleDateString()
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
    </div>
  );
}

export default Earnings;
