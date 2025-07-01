import React, { useEffect, useState } from "react";
import axios from "axios";

function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const teacher = JSON.parse(localStorage.getItem("user")); // assuming teacher is logged in

  useEffect(() => {
    if (!teacher?._id) return;

    axios
      .get(`http://localhost:5000/api/teacher/earnings/${teacher._id}`)
      .then((res) => {
        setPayments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch earnings:", err);
        setLoading(false);
      });
  }, [teacher]);

  const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="container mt-4">
      <h3 className="mb-4 fw-bold">💰 My Earnings</h3>

      {loading ? (
        <p>Loading your earnings...</p>
      ) : payments.length === 0 ? (
        <div className="alert alert-info">No earnings available.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Course</th>
                <th>Student</th>
                <th>Amount (₹)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={p._id}>
                  <td>{i + 1}</td>
                  <td>{p.course?.title || "N/A"}</td>
                  <td>{p.student?.name || "N/A"}</td>
                  <td>₹{p.amount}</td>
                  <td>{new Date(p.date).toLocaleString()}</td>
                </tr>
              ))}
              <tr className="fw-bold">
                <td colSpan="3">Total Earnings</td>
                <td colSpan="2">₹{totalEarnings}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PaymentManagement;
