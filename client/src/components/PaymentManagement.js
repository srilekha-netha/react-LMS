import React, { useEffect, useState } from "react";
import axios from "axios";
import './StudentDashboard.css';

function PaymentManagement() {
  const [history, setHistory] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || !user._id) {
      // inject fake data when no real user
      setHistory([
        { course: { title: 'React Basics' }, amount: 499, date: new Date(), coupon: 'WELCOME10', invoice: '#' },
        { course: { title: 'NodeJS Mastery' }, amount: 799, date: new Date(), coupon: null, invoice: '#' }
      ]);
      return;
    }

    axios
      .get(`http://localhost:5000/api/payments/user/${user._id}`)
      .then((res) =>
        setHistory(res.data.length ? res.data : [
          { course: { title: 'React Basics' }, amount: 499, date: new Date(), coupon: 'WELCOME10', invoice: '#' },
          { course: { title: 'NodeJS Mastery' }, amount: 799, date: new Date(), coupon: null, invoice: '#' }
        ])
      )
      .catch((err) => {
        console.error("❌ Failed to load payment history:", err);
        setHistory([
          { course: { title: 'React Basics' }, amount: 499, date: new Date(), coupon: 'WELCOME10', invoice: '#' },
          { course: { title: 'NodeJS Mastery' }, amount: 799, date: new Date(), coupon: null, invoice: '#' }
        ]);
      });
  }, [user]);

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">🧾 Payment History</h2>
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
                <td data-label="#">{i + 1}</td>
                <td data-label="Course Title">{h.course?.title || 'N/A'}</td>
                <td data-label="Amount Paid">₹{h.amount}</td>
                <td data-label="Date">{new Date(h.date).toLocaleString()}</td>
                <td data-label="Coupon Used">{h.coupon || '—'}</td>
                <td data-label="Invoice">
                  {h.invoice ? (
                    <a href={h.invoice} className="btn btn-sm btn-outline-primary">
                      Download
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentManagement;