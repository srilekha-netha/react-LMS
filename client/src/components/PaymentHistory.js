import React, { useEffect, useState } from "react";
import axios from "axios";

function PaymentHistory() {
  const [history, setHistory] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || !user._id) return;

    axios
      .get(`http://localhost:5000/api/payments/user/${user._id}`)
      .then((res) => setHistory(res.data))
      .catch((err) => {
        console.error("❌ Failed to load payment history:", err);
        setHistory([]);
      });
  }, [user]);

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">🧾 Payment History</h2>
      {history.length === 0 ? (
        <div className="alert alert-warning">No payment records found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Course Title</th>
                <th>Amount Paid</th>
                <th>Date</th>
                <th>Coupon Used</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{h.course?.title || "N/A"}</td>
                  <td>₹{h.amount}</td>
                  <td>{new Date(h.date).toLocaleString()}</td>
                  <td>{h.coupon || "—"}</td>
                  <td>
                    {h.invoice ? (
                      <a
                        href={h.invoice}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        Download
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PaymentHistory;
