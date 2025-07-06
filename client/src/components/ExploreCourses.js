import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ExploreCourses.css";

export default function ExploreCourses() {
  const [courses, setCourses]       = useState([]);
  const [showModal, setShowModal]   = useState(false);
  const [selectedCourse, setCourse] = useState(null);
  const [coupon, setCoupon]         = useState("");
  const [applyMsg, setApplyMsg]     = useState("");
  const [finalPrice, setFinalPrice] = useState(0);

  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user") || "{}");

  // Redirect if not logged in
  useEffect(() => {
    if (!user._id) navigate("/login");
  }, [user, navigate]);

  // Load courses not yet enrolled
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/enrollments/notEnrolled/${user._id}`)
      .then(res => setCourses(res.data))
      .catch(() => setCourses([]));
  }, [user._id]);

  // Open modal
  const openModal = course => {
    setCourse(course);
    setFinalPrice(course.price);
    setCoupon("");
    setApplyMsg("");
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "";
  };

  // Apply coupon
  const applyCoupon = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/coupons/apply", {
        courseId: selectedCourse._id,
        code: coupon,
        userId: user._id,
      });
      if (res.data.discountedPrice !== undefined) {
        setFinalPrice(res.data.discountedPrice);
      }
      setApplyMsg(res.data.message || "Coupon applied!");
    } catch (err) {
      setApplyMsg(err.response?.data?.message || "Invalid coupon");
    }
  };

  // Enroll & pay
  const enroll = async () => {
    try {
      const orderRes = await axios.post("http://localhost:5000/api/payments/create-order", {
        amount: finalPrice,
        studentId: user._id,
        courseId: selectedCourse._id,
      });

      const options = {
        key: "rzp_test_dGFALpaB5MZyZr",
        amount: orderRes.data.amount,
        currency: "INR",
        name: "LMS Payment",
        description: selectedCourse.title,
        order_id: orderRes.data.id,
        handler: async response => {
          await axios.post("http://localhost:5000/api/enrollments/enroll", {
            userId: user._id,
            courseId: selectedCourse._id,
            amountPaid: finalPrice,
          });
          await axios.post("http://localhost:5000/api/payments/save", {
            studentId: user._id,
            courseId: selectedCourse._id,
            amount: finalPrice,
            coupon,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            receipt: orderRes.data.receipt,
            status: "paid",
          });
          alert("✅ Enrolled successfully!");
          closeModal();
          navigate("/student/my-courses");
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#3399cc" },
      };

      new window.Razorpay(options).open();
    } catch {
      alert("❌ Payment failed");
    }
  };

  return (
    <div className="explore-container">
      <h2 className="explore-title">📚 Explore Courses</h2>

      <div className="course-grid">
        {courses.map(c => (
          <div className="course-card" key={c._id}>
            <span className="badge">🔥 New</span>
            <div className="img-wrap">
              {c.thumbnail
                ? <img
                    src={`http://localhost:5000/uploads/thumbnails/${c.thumbnail}`}
                    alt={c.title}
                    className="course-img"
                  />
                : <div className="course-img no-img">No Image</div>
              }
            </div>
            <div className="info">
              <h5 className="title">{c.title}</h5>
              <p className="meta"><strong>Instructor:</strong> {c.instructor || "N/A"}</p>
              <p className="meta"><strong>Level:</strong> {c.difficulty || "Beginner"}</p>
              <p className="meta"><strong>Price:</strong> ₹{c.price}</p>
              <button className="enroll" onClick={() => openModal(c)}>
                View & Enroll
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>×</button>
            <div className="modal-body">
              <div className="modal-left">
                <h3 className="modal-title">{selectedCourse.title}</h3>
                <p className="modal-desc">{selectedCourse.description}</p>
                <div className="coupon-box">
                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                  />
                  <button className="btn-apply" onClick={applyCoupon}>
                    Apply
                  </button>
                </div>
                {applyMsg && <p className="apply-msg">{applyMsg}</p>}
                <button className="btn-enroll" onClick={enroll}>
                  Enroll &amp; Pay ₹{finalPrice}
                </button>
              </div>
              <div className="modal-right">
                {selectedCourse.thumbnail
                  ? <img
                      src={`http://localhost:5000/uploads/thumbnails/${selectedCourse.thumbnail}`}
                      alt="preview"
                      className="modal-img"
                    />
                  : <div className="no-img-preview">No Image</div>
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
