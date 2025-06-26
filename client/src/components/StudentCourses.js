import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./StudentDashboard.css"; // Reuse existing styles

function StudentCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) return;

    axios
      .get(`http://localhost:5000/api/enrollments/byUser/${user._id}`)
      .then((res) => {
        // Filter out entries with null or missing course
        const validEnrollments = res.data.filter((e) => e.course !== null);
        setCourses(validEnrollments);
      })
      .catch(() => setCourses([]));
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">My Courses</h2>
      {courses.length === 0 ? (
        <div className="alert alert-info">
          You have not enrolled in any courses yet.
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((enroll) => {
            const course = enroll.course;
            if (!course) return null;

            return (
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
                    <span className="badge bg-info position-absolute top-0 end-0 mt-2 me-2 rounded-pill px-3 py-1 small">
                      {enroll.progress || 0}% Complete
                    </span>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-truncate">{course.title || "Untitled Course"}</h5>
                    <p className="card-text small text-muted" style={{ minHeight: "48px" }}>
                      {course.description
                        ? course.description.slice(0, 90)
                        : "No description"}
                      {course.description && course.description.length > 90 ? "..." : ""}
                    </p>
                    <div className="mt-auto">
                      <Link
                        to={`/student/coursedetails?id=${course._id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Continue Course
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentCourses;
