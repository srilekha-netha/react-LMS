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

  // Redirect if not logged in
  useEffect(() => {
    if (!user || !user._id) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Load only not-enrolled courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/enrollments/notEnrolled/${user._id}`);
        console.log("✅ Not Enrolled Courses:", res.data);
        setCourses(res.data);
      } catch (err) {
        console.error("❌ Failed to load not enrolled courses:", err);
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
      setApplyMsg({ ...applyMsg, [courseId]: err.response?.data?.message || "Invalid Coupon" });
    }
  };

  const enrollCourse = async (courseId, price) => {
    try {
      await axios.post("http://localhost:5000/api/enrollments/enroll", {
        courseId,
        userId: user._id,
        amountPaid: price,
      });
      alert("✅ Enrolled successfully! Check 'My Courses'.");
      // Remove the course from list after enrolling
      setCourses(courses.filter(course => course._id !== courseId));
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed");
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
                    className={`badge position-absolute top-0 end-0 mt-2 me-2 rounded-pill px-3 py-1 small 
                      ${course.published ? "bg-success" : "bg-secondary"}`}
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
                  <p className="mb-1"><strong>Level:</strong> {course.difficulty}</p>
                  <p className="mb-1"><strong>Price:</strong> ₹{course.price}</p>

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

                  {/* ✅ Enroll Button */}
                  <button
                    className="btn btn-primary mt-3"
                    onClick={() => enrollCourse(course._id, course.price)}
                  >
                    Enroll
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
