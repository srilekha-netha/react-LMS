// src/components/StudentCourses.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./StudentDashboardOverrides.css";  // contains both dashboard + “My Courses” styles

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return;

    axios
      .get(`http://localhost:5000/api/enrollments/byUser/${user._id}`)
      .then((res) => {
        const valid = res.data.filter((e) => e.course);
        setCourses(valid);
      })
      .catch(() => setCourses([]));
  }, []);

  return (
    <div className="sc-container">
      <h2 className="sc-title">My Courses</h2>

      {courses.length === 0 ? (
        <div className="alert alert-info">
          You have not enrolled in any courses yet.
        </div>
      ) : (
        <div className="row g-4">
          {courses.map(({ course, progress }) => (
            <div key={course._id} className="col-12 col-sm-6 col-md-4 col-xl-3">
              <div className="card sc-card h-100">
                <div className="sc-img-wrap">
                  {course.thumbnail ? (
                    <img
                      src={`http://localhost:5000/uploads/thumbnails/${course.thumbnail}`}
                      alt={course.title}
                      className="sc-img"
                    />
                  ) : (
                    <div className="sc-noimg">No Image</div>
                  )}
                  <div className="sc-badge">{progress || 0}% Complete</div>
                </div>

                <div className="card-body d-flex flex-column">
                  <h5 className="sc-course-title text-truncate">
                    {course.title || "Untitled Course"}
                  </h5>
                  <p className="sc-desc">
                    {course.description
                      ? `${course.description.slice(0, 100)}${
                          course.description.length > 100 ? "…" : ""
                        }`
                      : "No description"}
                  </p>
                  <div className="mt-auto pt-2">
                    <Link
                      to={`/student/coursedetails?id=${course._id}`}
                      className="btn btn-primary btn-sm sc-btn"
                    >
                      Continue Course
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
