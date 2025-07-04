// src/components/RazorpayPayment.js
import React, { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function RazorpayPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user") || "{}");
  const qp       = new URLSearchParams(location.search);
  const courseId = qp.get("courseId");
  const amount   = qp.get("amount");

  useEffect(() => {
    if (!user._id || !courseId || !amount) {
      alert("Missing payment data");
      return navigate("/student/explore");
    }

    const loadRz = () => {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(s);
    };

    const startPayment = async () => {
      try {
        // 1. create order
        const { data: order } = await axios.post(
          "http://localhost:5000/api/payments/create-order",
          { amount }
        );

        // 2. open checkout
        const options = {
          key:         "rzp_test_dGFALpaB5MZyZr",
          amount:      order.amount,
          currency:    order.currency,
          order_id:    order.id,
          name:        "LMS Payment",
          description: "Course Enrollment",
          handler: async (resp) => {
            // 3. verify & save
            await axios.post("http://localhost:5000/api/payments/verify", {
              razorpay_order_id:   resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature:  resp.razorpay_signature,
              userId:              user._id,    // ← match backend
              courseId,
              amount,
            });
            alert("✅ Payment successful!");
            navigate("/student/my-courses");
          },
          prefill: { name: user.name, email: user.email },
          theme:   { color: "#0d6efd" },
        };

        new window.Razorpay(options).open();
      } catch (err) {
        console.error("❌ Payment init failed:", err);
        alert("Payment failed");
        navigate("/student/explore");
      }
    };

    loadRz();
    startPayment();
  }, [user, courseId, amount, navigate]);

  return <h3 className="text-center mt-5">Processing Payment...</h3>;
}
