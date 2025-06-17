import React, { useEffect, useState } from "react";
import axios from "axios";

function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("all");

  // Fetch all courses
  useEffect(() => {
    axios
      .get("/api/admin/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Error loading courses:", err));
  }, []);

  const handleAction = (id, action) => {
    axios
      .put(`/api/admin/courses/${id}/${action}`)
      .then(() => {
        alert(`Course ${action}d successfully`);
        setCourses((prev) =>
          prev.map((c) =>
            c._id === id ? { ...c, status: action === "approve" ? "Approved" : action === "reject" ? "Rejected" : c.status } : c
          )
        );
      })
      .catch((err) => alert("Action failed:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      axios
        .delete(`/api/admin/courses/${id}`)
        .then(() => {
          alert("Deleted");
          setCourses((prev) => prev.filter((c) => c._id !== id));
        })
        .catch((err) => alert("Delete failed"));
    }
  };

  const filteredCourses =
    filter === "all" ? courses : courses.filter((course) => course.status === filter);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">📘 Course Management</h3>

      <div className="d-flex gap-3 mb-3">
        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {filteredCourses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Teacher</th>
                <th>Status</th>
                <th>Price</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course._id}>
                  <td>{course.title}</td>
                  <td>{course.category}</td>
                  <td>{course.teacherName || "N/A"}</td>
                  <td>
                    <span
                      className={`badge ${
                        course.status === "Approved"
                          ? "bg-success"
                          : course.status === "Pending"
                          ? "bg-warning text-dark"
                          : "bg-danger"
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td>₹{course.price}</td>
                  <td>{new Date(course.createdAt).toLocaleDateString()}</td>
                  <td>
                    {course.status === "Pending" && (
                      <>
                        <button
                          className="btn btn-sm btn-success me-1"
                          onClick={() => handleAction(course._id, "approve")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger me-1"
                          onClick={() => handleAction(course._id, "reject")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-sm btn-secondary me-1"
                      onClick={() => alert("Edit feature coming soon")}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(course._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CourseManagement;
