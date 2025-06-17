import React, { useEffect, useState } from "react";
import axios from "axios";

function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all payment records
  useEffect(() => {
    axios
      .get("/api/admin/payments")
      .then((res) => {
        setPayments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch payments", err);
        setLoading(false);
      });
  }, []);

  const filteredPayments = payments.filter((p) =>
    filter ? p.teacherName?.toLowerCase().includes(filter.toLowerCase()) : true
  );

  const totalEarnings = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  const handleDownload = () => {
    axios({
      url: "/api/admin/payments/export",
      method: "GET",
      responseType: "blob", // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "earnings_report.csv");
      document.body.appendChild(link);
      link.click();
    });
  };

  const handleApprovePayout = (id) => {
    axios
      .put(`/api/admin/payments/${id}/approve`)
      .then(() => {
        alert("Payout approved");
        setPayments((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, payoutStatus: "Paid" } : p
          )
        );
      })
      .catch(() => alert("Payout approval failed"));
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">💳 Payment & Earnings</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by Teacher Name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button className="btn btn-outline-primary btn-sm" onClick={handleDownload}>
          <i className="bi bi-download me-1"></i> Download Report
        </button>
      </div>

      {loading ? (
        <p>Loading payments...</p>
      ) : filteredPayments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Teacher</th>
                <th>Course</th>
                <th>Amount (₹)</th>
                <th>Date</th>
                <th>Status</th>
                <th>Payout</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p._id}>
                  <td>{p.teacherName}</td>
                  <td>{p.courseTitle}</td>
                  <td>₹{p.amount}</td>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        p.status === "Success"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>
                    {p.payoutStatus === "Pending" ? (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleApprovePayout(p._id)}
                      >
                        Approve Payout
                      </button>
                    ) : (
                      <span className="text-success fw-semibold">Paid</span>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="fw-bold">
                <td colSpan="2">Total</td>
                <td>₹{totalEarnings}</td>
                <td colSpan="3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PaymentManagement;
