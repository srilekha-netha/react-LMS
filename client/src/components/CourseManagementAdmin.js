// src/components/CourseManagement.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

function CourseManagement() {
  const [courses,    setCourses]    = useState([]);
  const [filterStat, setFilterStat] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/courses")
      .then(res => setCourses(res.data))
      .catch(err => console.error("Load courses failed:", err));
  }, []);

  const togglePublish = (id, pub) => {
    axios.put(`http://localhost:5000/api/courses/${id}`, { published: !pub })
      .then(() => setCourses(cs =>
        cs.map(c => c.id === id ? { ...c, published: !pub } : c)
      ))
      .catch(() => alert("Status update failed"));
  };

  const deleteCourse = id => {
    if (!window.confirm("Delete this course?")) return;
    axios.delete(`http://localhost:5000/api/courses/${id}`)
      .then(() => setCourses(cs => cs.filter(c => c.id !== id)))
      .catch(() => alert("Delete failed"));
  };

  const filtered = courses.filter(c => {
    return filterStat === "all"
      ? true
      : filterStat === "published"
        ? c.published
        : !c.published;
  });

  return (
    <div className="container-fluid py-3">
      <div className="d-flex align-items-center mb-3 flex-column flex-md-row">
        <h2 className="me-auto mb-2 mb-md-0">Course Management</h2>
        <select
          className="form-select form-select-sm w-auto"
          value={filterStat}
          onChange={e => setFilterStat(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle dashboard-table">
          <thead className="table-dark">
            <tr>
              <th>Course Name</th>
              <th>Teacher Name</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map(c => (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>{c.teacherName}</td>
                  <td>
                    <span className={`badge ${c.published ? "bg-success" : "bg-secondary"} text-white`}>
                      {c.published ? "Published" : "Unpublished"}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => togglePublish(c.id, c.published)}
                    >
                      {c.published ? "Reject" : "Approve"}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary me-1"
                      onClick={() => navigate(`/admin/courses/${c.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteCourse(c.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-muted py-4">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CourseManagement;
