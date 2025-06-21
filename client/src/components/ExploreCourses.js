import React, { useEffect, useState } from "react";
import axios from "axios";

function ExploreCourses() {
  const [courses, setCourses] = useState([]);
  const [coupon, setCoupon] = useState({});
  const [applyMsg, setApplyMsg] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/api/courses/published")
      .then(res => setCourses(res.data))
      .catch(() => setCourses([]));
  }, []);

  const handleCouponChange = (id, value) => {
    setCoupon({ ...coupon, [id]: value });
  };

  const applyCoupon = async (courseId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/coupons/apply`, {
        courseId,
        code: coupon[courseId],
        userId: JSON.parse(localStorage.getItem("user"))._id,
      });
      setApplyMsg({ ...applyMsg, [courseId]: res.data.message });
    } catch (err) {
      setApplyMsg({ ...applyMsg, [courseId]: err.response?.data?.message || "Invalid Coupon" });
    }
  };

  const enrollCourse = async (courseId, price, idx) => {
    // Here you would integrate a payment gateway in real app
    try {
      // Simulate payment: always succeed
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      await axios.post("http://localhost:5000/api/enrollments/enroll", {
        courseId,
        userId,
        amountPaid: price,
      });
      alert("Enrolled successfully! Check My Courses");
    } catch (err) {
      alert("Enrollment failed");
    }
  };

  return (
    <div>
      <h2>Explore Courses</h2>
      {courses.map((course, idx) => (
        <div key={course._id} style={{ border: "1px solid #ddd", margin: 12, padding: 16, borderRadius: 6 }}>
          <h5>{course.title}</h5>
          <p>{course.description}</p>
          <div>Instructor: {course.teacher?.name || "N/A"}</div>
          <div>Duration: {course.chapters.length} chapters</div>
          <div>Level: {course.difficulty}</div>
          <div>Price: ₹{course.price}</div>
          <input
            type="text"
            placeholder="Coupon code"
            value={coupon[course._id] || ""}
            onChange={e => handleCouponChange(course._id, e.target.value)}
            style={{ marginRight: 6 }}
          />
          <button onClick={() => applyCoupon(course._id)}>Apply Coupon</button>
          <span>{applyMsg[course._id]}</span>
          <button style={{ marginLeft: 16 }} onClick={() => enrollCourse(course._id, course.price, idx)}>
            Enroll
          </button>
        </div>
      ))}
    </div>
  );
}
export default ExploreCourses;
