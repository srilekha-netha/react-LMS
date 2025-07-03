import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ExploreCourses.css"; // shared responsive styles

function ExploreCourses() {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [applyMsg, setApplyMsg] = useState("");
  const [finalPrice, setFinalPrice] = useState(0);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || !user._id) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/enrollments/notEnrolled/${user._id}`)
      .then((res) => setCourses(res.data))
      .catch((err) => {
        console.error("❌ Failed to load courses:", err);
        setCourses([]);
      });
  }, [user._id]);

  const handleView = (course) => {
    setSelectedCourse(course);
    setFinalPrice(course.price);
    setCoupon("");
    setApplyMsg("");
    setShowModal(true);
  };

  const handleCouponApply = async () => {
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

  const handleEnroll = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/payments/create-order", {
        amount: finalPrice,
        studentId: user._id,
        courseId: selectedCourse._id,
      });
      const options = {
        key: "rzp_test_dGFALpaB5MZyZr",
        amount: res.data.amount,
        currency: "INR",
        name: "LMS Payment",
        description: selectedCourse.title,
        order_id: res.data.id,
        handler: async (response) => {
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
            receipt: res.data.receipt,
            status: "paid",
          });
          alert("✅ Enrolled successfully!");
          setShowModal(false);
          navigate("/student/my-courses");
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#3399cc" },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      alert("❌ Payment failed");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="explore-title">📚 Explore Courses</h2>
      <div className="course-grid">
        {courses.map((course) => (
          <div className="course-card" key={course._id}>
            <div className="img-wrap">
              {course.thumbnail ? (
                <img
                  src={`http://localhost:5000/uploads/thumbnails/${course.thumbnail}`}
                  alt={course.title}
                  className="course-img"
                />
              ) : (
                <div className="course-img no-img">No Image</div>
              )}
            </div>
            <div className="info">
              <h5 className="title">{course.title}</h5>
              <p className="meta"><strong>Level:</strong> {course.difficulty || "Beginner"}</p>
              <p className="meta"><strong>Price:</strong> ₹{course.price}</p>
              <button className="enroll" onClick={() => handleView(course)}>
                View & Enroll
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedCourse && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <span className="close-btn" onClick={() => setShowModal(false)}>&times;</span>
            <div className="modal-left">
              <h4>{selectedCourse.title}</h4>
              <p>{selectedCourse.description}</p>
              <div className="coupon-box">
                <input
                  type="text"
                  className="coupon-input"
                  placeholder="Enter Coupon"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <button className="btn-apply" onClick={handleCouponApply}>
                  Apply
                </button>
              </div>
              {applyMsg && <p className="apply-msg">{applyMsg}</p>}
              <button className="btn-enroll mb-3" onClick={handleEnroll}>
                Enroll &amp; Pay ₹{finalPrice}
              </button>
            </div>
            <div className="modal-right">
              <img
                src={`http://localhost:5000/uploads/thumbnails/${selectedCourse.thumbnail}`}
                alt="Preview"
                className="modal-img"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExploreCourses;