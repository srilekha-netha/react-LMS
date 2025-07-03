// src/components/PaymentManagement.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/payments/all")
      .then(res => {
        setPayments(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Failed to fetch payments:", err);
        setLoading(false);
      });
  }, []);

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  if (loading) return <p className="p-4">Loading payments...</p>;
  if (payments.length === 0)
    return <div className="alert alert-info m-4">No payments found.</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4 fw-bold">💰 All Payments</h3>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th><th>Course</th><th>Student</th>
              <th>Amount (₹)</th><th>Status</th>
              <th>Date</th><th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={p._id}>
                <td>{i+1}</td>
                <td>{p.course?.title || "N/A"}</td>
                <td>{p.student?.name || "N/A"}</td>
                <td>₹{p.amount}</td>
                <td>
                  <span className={
                    p.status === "paid"   ? "badge bg-success" :
                    p.status === "failed" ? "badge bg-danger"  :
                                            "badge bg-secondary"
                  }>
                    {p.status[0].toUpperCase() + p.status.slice(1)}
                  </span>
                </td>
                <td>{new Date(p.date).toLocaleString()}</td>
                <td>
                  {p.invoice ? (
                    <a
                      href={p.invoice}
                      className="btn btn-sm btn-outline-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
            <tr className="fw-bold">
              <td colSpan="3">Total</td>
              <td>₹{totalAmount}</td>
              <td colSpan="3"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
