import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css"; // External CSS

function CreateCourse() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Beginner",
    price: "",
    thumbnail: null,
    published: true
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [thumbPreview, setThumbPreview] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setForm({ ...form, [name]: files[0] });
      setThumbPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.difficulty || !form.price || !form.description) {
      setMsg("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });
      formData.append("teacher", user._id);

      await axios.post("http://localhost:5000/api/courses/create", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setMsg("Course created successfully!");
      setTimeout(() => navigate("/teacher/courses"), 1000);
    } catch (err) {
      setMsg("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container create-course-container">
      <h2 className="mb-4 fw-bold">Create New Course</h2>
      <form className="create-course-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row g-3">
          <div className="col-12 col-md-8">
            <div className="form-group mb-3">
              <label className="form-label fw-medium">Course Title<span className="text-danger">*</span></label>
              <input
                name="title"
                type="text"
                className="form-control"
                placeholder="e.g. Introduction to React"
                value={form.title}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label fw-medium">Description<span className="text-danger">*</span></label>
              <textarea
                name="description"
                className="form-control"
                rows={3}
                placeholder="Briefly describe this course..."
                value={form.description}
                onChange={handleChange}
                required
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label fw-medium">Category<span className="text-danger">*</span></label>
                <input
                  name="category"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Web Development"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">Difficulty<span className="text-danger">*</span></label>
                <select
                  name="difficulty"
                  className="form-select"
                  value={form.difficulty}
                  onChange={handleChange}
                  required
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <div className="row g-2 mt-2">
              <div className="col-md-6">
                <label className="form-label fw-medium">Price (₹)<span className="text-danger">*</span></label>
                <input
                  name="price"
                  type="number"
                  min={0}
                  className="form-control"
                  placeholder="Enter price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 d-flex align-items-end">
                <div className="form-check mb-0 ms-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="published"
                    id="publishSwitch"
                    checked={form.published}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="publishSwitch">
                    Publish Immediately
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail upload and preview */}
          <div className="col-12 col-md-4 d-flex flex-column align-items-center">
            <label className="form-label fw-medium">Thumbnail Image</label>
            <div className="thumb-preview-area mb-2">
              {thumbPreview ? (
                <img src={thumbPreview} alt="Thumbnail Preview" className="thumb-preview-img" />
              ) : (
                <div className="thumb-placeholder">No Image</div>
              )}
            </div>
            <input
              name="thumbnail"
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
            />
            <small className="text-muted mt-1">Best size: 16:9 or 4:3</small>
          </div>
        </div>

        <div className="mt-4 d-flex gap-3 justify-content-end">
          <button type="submit" className="btn btn-lg btn-primary create-course-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Course"}
          </button>
        </div>

        {msg && (
          <div className={`alert mt-3 mb-0 ${msg.startsWith("Error") ? "alert-danger" : "alert-success"}`}>
            {msg}
          </div>
        )}
      </form>
    </div>
  );
}

export default CreateCourse;
