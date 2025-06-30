import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

function ExploreCourses() {
  const [courses, setCourses] = useState([]);
  const [coupon, setCoupon] = useState({});
  const [applyMsg, setApplyMsg] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || !user._id) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/enrollments/notEnrolled/${user._id}`);
        setCourses(res.data);
      } catch (err) {
        console.error("❌ Failed to load courses:", err);
        setCourses([]);
      }
    };
    fetchCourses();
  }, [user._id]);

  const handleCouponChange = (id, value) => {
    setCoupon({ ...coupon, [id]: value });
  };

  const applyCoupon = async (courseId) => {
    try {
      const res = await axios.post("http://localhost:5000/api/coupons/apply", {
        courseId,
        code: coupon[courseId],
        userId: user._id,
      });
      setApplyMsg({ ...applyMsg, [courseId]: res.data.message });
    } catch (err) {
      setApplyMsg({
        ...applyMsg,
        [courseId]: err.response?.data?.message || "Invalid Coupon",
      });
    }
  };

  const startPayment = async (course) => {
    try {
      const res = await axios.post("http://localhost:5000/api/payments/create-order", {
        amount: course.price, // amount in rupees, backend multiplies by 100
        studentId: user._id,
        courseId: course._id,
      });

      const options = {
        key: "rzp_test_dGFALpaB5MZyZr", // Replace with your real Razorpay key
        amount: res.data.amount,
        currency: "INR",
        name: "LMS Payment",
        description: course.title,
        order_id: res.data.id,
        handler: async function (response) {
          try {
            await axios.post("http://localhost:5000/api/enrollments/enroll", {
              userId: user._id,
              courseId: course._id,
              amountPaid: course.price,
            });

            await axios.post("http://localhost:5000/api/payments/save", {
              studentId: user._id,
              courseId: course._id,
              amount: course.price,
              coupon: coupon[course._id] || "",
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              receipt: res.data.receipt,
              status: "paid",
            });

            alert("✅ Payment successful and enrollment done!");
            setCourses((prev) => prev.filter((c) => c._id !== course._id));
          } catch (err) {
            console.error("❌ Enrollment or payment save failed:", err);
            alert("Payment succeeded, but enrollment failed!");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Payment initiation failed:", err);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Explore Courses</h2>
      {courses.length === 0 ? (
        <div className="alert alert-info">No courses available to explore.</div>
      ) : (
        <div className="row g-4">
          {courses.map((course) => (
            <div className="col-12 col-md-6 col-lg-4" key={course._id}>
              <div className="card course-card shadow-sm border-0 h-100 position-relative">
                <div className="card-img-top-wrap">
                  {course.thumbnail ? (
                    <img
                      src={`http://localhost:5000/uploads/thumbnails/${course.thumbnail}`}
                      className="card-img-top course-img"
                      alt={course.title}
                    />
                  ) : (
                    <div className="course-img bg-light d-flex align-items-center justify-content-center text-muted">
                      No Image
                    </div>
                  )}
                  <span
                    className={`badge position-absolute top-0 end-0 mt-2 me-2 rounded-pill px-3 py-1 small ${
                      course.published ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {course.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate">{course.title}</h5>
                  <p className="card-text small text-muted" style={{ minHeight: "48px" }}>
                    {course.description ? course.description.slice(0, 90) : "No description"}
                    {course.description && course.description.length > 90 ? "..." : ""}
                  </p>
                  <p className="mb-1">
                    <strong>Level:</strong> {course.difficulty}
                  </p>
                  <p className="mb-1">
                    <strong>Price:</strong> ₹{course.price}
                  </p>

                  <input
                    type="text"
                    className="form-control form-control-sm mt-2"
                    placeholder="Enter coupon code"
                    value={coupon[course._id] || ""}
                    onChange={(e) => handleCouponChange(course._id, e.target.value)}
                  />
                  <button
                    className="btn btn-outline-primary btn-sm mt-2"
                    onClick={() => applyCoupon(course._id)}
                  >
                    Apply Coupon
                  </button>
                  {applyMsg[course._id] && (
                    <div className="text-success small mt-1">{applyMsg[course._id]}</div>
                  )}

                  <button
                    className="btn btn-primary mt-3"
                    onClick={() => startPayment(course)}
                  >
                    Pay & Enroll
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExploreCourses;
