import React from "react";
import "./StudentDashboard.css";

const payments = [
  {
    id: "INV001",
    course: "React for Beginners",
    date: "2025-05-10",
    amount: "₹999",
    coupon: "REACT50",
    invoiceUrl: "#",
  },
  {
    id: "INV002",
    course: "Advanced Node.js",
    date: "2025-05-15",
    amount: "₹1499",
    coupon: "NODE20",
    invoiceUrl: "#",
  },
  {
    id: "INV003",
    course: "Full-Stack Web Dev",
    date: "2025-06-01",
    amount: "₹1999",
    coupon: "FULLSTACK10",
    invoiceUrl: "#",
  },
];

function PaymentHistory() {
  return (
    <div className="payment-container">
      <h3 className="text-center text-success mb-4">💳 Payment History</h3>
      <div className="table-responsive">
        <table className="table table-striped table-bordered shadow-sm">
          <thead className="table-success">
            <tr>
              <th>#Invoice</th>
              <th>Course</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Coupon Used</th>
              <th>Download Invoice</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.course}</td>
                <td>{payment.date}</td>
                <td>{payment.amount}</td>
                <td>{payment.coupon || "—"}</td>
                <td>
                  <a
                    href={payment.invoiceUrl}
                    className="btn btn-sm btn-outline-primary"
                    download
                  >
                    Download 📄
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentHistory;
