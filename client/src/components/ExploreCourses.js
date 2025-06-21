import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentDashboard.css"; 

function ExploreCourses() {
  const [courses, setCourses] = useState([]);
  const [coupon, setCoupon] = useState({});
  const [applyMsg, setApplyMsg] = useState({});

  useEffect(() => {
  axios.get("http://localhost:5000/api/courses/published")
    .then(res => {
      console.log('Courses:', res.data); // <--- Add this
      setCourses(res.data);
    })
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

  const enrollCourse = async (courseId, price) => {
    try {
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
      <div className="courses-list">
        {courses.length === 0 && <div>No courses found.</div>}
        {courses.map((course) => (
          <div key={course._id} className="course-card">
            {course.thumbnail && (
              <img
                src={`http://localhost:5000/uploads/thumbnails/${course.thumbnail}`}
                alt="Course Thumbnail"
                className="course-thumb"
              />
            )}
            <h4>{course.title}</h4>
            <div className="course-meta">
              <span><b>Instructor:</b> {course.teacher}</span>
              <span><b>Level:</b> {course.difficulty}</span>
              <span><b>Duration:</b> {course.chapters ? `${course.chapters.length} Chapters` : "N/A"}</span>
            </div>
            <p>{course.description}</p>
            <div><b>Price:</b> ₹{course.price}</div>
            <div className="coupon-box">
              <input
                type="text"
                placeholder="Coupon code"
                value={coupon[course._id] || ""}
                onChange={e => handleCouponChange(course._id, e.target.value)}
              />
              <button onClick={() => applyCoupon(course._id)}>Apply Coupon</button>
              <span>{applyMsg[course._id]}</span>
            </div>
            <button className="enroll-btn" onClick={() => enrollCourse(course._id, course.price)}>
              Enroll
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExploreCourses;
