import React, { useEffect, useState } from "react";
import axios from "axios";

function PaymentHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios.get(`http://localhost:5000/api/payments/history/${user._id}`)
      .then(res => setHistory(res.data));
  }, []);

  return (
    <div>
      <h2>Payment History</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Course</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Coupon</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, i) => (
            <tr key={i}>
              <td>{h.course}</td>
              <td>₹{h.amount}</td>
              <td>{h.date}</td>
              <td>{h.coupon}</td>
              <td>{h.invoice && <a href={h.invoice} target="_blank" rel="noopener noreferrer">Download</a>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default PaymentHistory;
