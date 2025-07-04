import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        handler: async function (response) {
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
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("❌ Payment failed");
    }
  };

  return (
    <div style={{ padding: "20px 30px" }}>
      <style>{css}</style>
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
              <p className="instructor">{course.instructor || "Instructor"}</p>
              <p className="meta"><strong>Level:</strong> {course.difficulty || "Beginner"}</p>
              <p className="meta"><strong>Price:</strong> ₹{course.price}</p>
              <button className="enroll" onClick={() => handleView(course)}>View & Enroll</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedCourse && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <span className="close-btn" onClick={() => setShowModal(false)}>&times;</span>
            <div className="modal-left">
              <h2 className="title">{selectedCourse.title}</h2>
              <p>{selectedCourse.description}</p>
              <div className="coupon-box">
                <input
                  type="text"
                  placeholder="Enter Coupon"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="coupon-input"
                />
                <button className="btn-apply" onClick={handleCouponApply}>Apply</button>
              </div>
              {applyMsg && <p className="apply-msg">{applyMsg}</p>}
              <button className="btn-enroll" onClick={handleEnroll}>
                Enroll & Pay ₹{finalPrice}
              </button>
              <p className="meta"><i className="bi bi-people-fill"></i> 1.5M learners already enrolled</p>
            </div>
            <div className="modal-right">
              <img
                src={`http://localhost:5000/uploads/thumbnails/${selectedCourse.thumbnail}`}
                alt="preview"
                className="modal-img"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const css = `
.explore-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
}
.course-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}
.course-card {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
}
.img-wrap {
  height: 160px;
  overflow: hidden;
}
.course-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.no-img {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f2f2f2;
  color: #888;
  font-size: 14px;
}
.info {
  padding: 16px;
}
.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}
.instructor, .meta {
  font-size: 14px;
  color: #444;
  margin-bottom: 6px;
}
.enroll {
  background-color: #007bff;
  border: none;
  color: white;
  padding: 8px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
}
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-card {
  display: flex;
  background: white;
  border-radius: 16px;
  padding: 20px;
  width: 500px;
  height: 300px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  position: relative;
}
.modal-left {
  flex: 1.3;
  padding-right: 20px;
}
.modal-right {
  flex: 1;
}
.modal-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 10px;
}
.coupon-box {
  display: flex;
  margin: 10px 0;
}
.coupon-input {
  flex: 1;
  padding: 8px;
  font-size: 13px;
  margin-right: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.btn-apply {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}
.apply-msg {
  color: green;
  font-size: 13px;
  margin-top: 4px;
}
.btn-enroll {
  background: #28a745;
  color: white;
  padding: 10px;
  margin-top: 50px;
  width: 100%;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  font-size: 14px;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 14px;
  font-size: 26px;
  cursor: pointer;
  color: #888;
}
.close-btn:hover {
  color: #000;
}
`;

export default ExploreCourses;
