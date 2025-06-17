import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateCourse() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Beginner",
    price: "",
    thumbnail: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm({
      ...form,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Build FormData
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    // TODO: Replace with real API call
    console.log("Submitting Course:", form);
    alert("Course submitted!");

    navigate("/teacher/courses");
  };

  return (
    <>
      {/* Bootstrap & Icons */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      <div className="container py-5">
        <div
          className="card shadow-lg mx-auto"
          style={{ maxWidth: "700px", minHeight: "80vh" }}
        >
          {/* Header */}
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">
              <i className="bi bi-journal-plus me-2"></i>Create New Course
            </h4>
          </div>

          {/* Body with scroll */}
          <div
            className="card-body"
            style={{ overflowY: "auto", paddingBottom: "1rem" }}
          >
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label className="form-label">Course Title</label>
                <input
                  name="title"
                  type="text"
                  className="form-control"
                  placeholder="Enter course title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Course Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  placeholder="Write a brief description..."
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Category</label>
                <input
                  name="category"
                  type="text"
                  className="form-control"
                  placeholder="e.g., Web Development"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Difficulty</label>
                  <select
                    name="difficulty"
                    className="form-select"
                    value={form.difficulty}
                    onChange={handleChange}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    className="form-control"
                    placeholder="Enter price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Thumbnail Image</label>
                <input
                  name="thumbnail"
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleChange}
                  required
                />
              </div>
            </form>
          </div>

          {/* Sticky Footer */}
          <div className="card-footer bg-white text-end">
            <button
              onClick={handleSubmit}
              className="btn btn-success"
            >
              <i className="bi bi-check-circle me-1"></i> Submit Course
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateCourse;
