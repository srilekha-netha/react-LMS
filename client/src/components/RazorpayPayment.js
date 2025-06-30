import React, { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function RazorpayPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get("courseId");
  const amount = queryParams.get("amount");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user?._id || !courseId || !amount) {
      alert("Missing payment data");
      return navigate("/student/explore");
    }

    const loadRazorpayScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    };

    const startPayment = async () => {
      try {
        const { data } = await axios.post("http://localhost:5000/api/payments/create", {
          amount,
          userId: user._id,
          courseId,
        });

        const options = {
          key: "rzp_test_dGFALpaB5MZyZr", // 🔑 Your Razorpay key
          amount: data.amount,
          currency: "INR",
          name: "LMS Payment",
          description: "Course Enrollment",
          order_id: data.orderId,
          handler: async function (response) {
            try {
              await axios.post("http://localhost:5000/api/payments/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user._id,
                courseId,
                amount,
              });

              alert("✅ Payment successful!");
              navigate("/student/my-courses");
            } catch (err) {
              console.error("❌ Payment verification failed", err);
              alert("Payment verification failed");
              navigate("/student/explore");
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: "#0d6efd",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error("❌ Payment initiation failed:", err);
        alert("Payment failed");
        navigate("/student/explore");
      }
    };

    loadRazorpayScript();
    setTimeout(startPayment, 500);
  }, [user, courseId, amount, navigate]);

  return <h3 className="text-center mt-5">Processing Payment...</h3>;
}

export default RazorpayPayment;
