import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId, price, userId, title, thumbnail } = location.state || {};

  const handlePayment = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/enrollments/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, userId, amountPaid: price }),
      });

      if (!res.ok) throw new Error("Payment failed");
      alert("✅ Payment successful!");
      navigate("/student/my-courses");
    } catch (err) {
      alert("❌ Payment or enrollment failed");
    }
  };

  if (!courseId) return <div style={{ color: "white", textAlign: "center" }}>Missing payment info</div>;

  return (
    <div className="payment-page">
      {/* Embedded CSS */}
      <style>{`
        .payment-page {
          height: 100vh;
          background: linear-gradient(to right, #6a82fb, #a162e8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .payment-box {
          background: rgba(0, 0, 0, 0.6);
          padding: 2rem;
          border-radius: 16px;
          text-align: center;
          max-width: 400px;
          width: 100%;
        }
        .payment-box .thumbnail {
          width: 100%;
          height: auto;
          border-radius: 12px;
          margin-bottom: 1rem;
        }
      `}</style>

      <div className="payment-box">
        {thumbnail && (
          <img
            src={`http://localhost:5000/uploads/thumbnails/${thumbnail}`}
            alt={title}
            className="thumbnail"
          />
        )}
        <h3>{title}</h3>
        <p><strong>Amount to Pay:</strong> ₹{price}</p>
        <button className="btn btn-success mt-3" onClick={handlePayment}>
          Pay & Enroll
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;
