import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./TeacherLayout.css"; // you can keep your old styles here if needed

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    async function fetchCourses() {
      if (!user._id) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/courses/teacher/${user._id}`
        );
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    }
    fetchCourses();
  }, [user._id]);

  const handleDelete = async (id) => {
    if (!id) return alert("Invalid course ID");
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`);
      alert("Course deleted!");
      // reload
      const res = await axios.get(
        `http://localhost:5000/api/courses/teacher/${user._id}`
      );
      setCourses(res.data);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">My Courses</h2>
      {courses.length === 0 ? (
        <div className="alert alert-info">No courses created yet.</div>
      ) : (
        <div className="row g-4">
          {courses.map((course) => (
            <div className="course-cell" key={course._id}>
              <div className="card course-card shadow-sm border-0 h-100">
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
                  <p
                    className="card-text small text-muted"
                    style={{ minHeight: "48px" }}
                  >
                    {course.description
                      ? course.description.slice(0, 90)
                      : "No description"}
                    {course.description && course.description.length > 90
                      ? "..."
                      : ""}
                  </p>
                  <div className="mt-auto d-flex gap-2 justify-content-end">
                    <Link
                      to={`/teacher/courses/${course._id}/edit`}
                      className="btn btn-outline-primary btn-sm course-btn"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/teacher/courses/${course._id}/content`}
                      className="btn btn-outline-secondary btn-sm course-btn"
                    >
                      Content
                    </Link>
                    <button
                      className="btn btn-outline-danger btn-sm course-btn"
                      onClick={() => handleDelete(course._id)}
                    >
                      Delete
                    </button>
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
