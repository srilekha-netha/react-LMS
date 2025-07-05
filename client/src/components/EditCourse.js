import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditCourse() {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Beginner",
    price: "",
    thumbnail: null,
    published: false,
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/courses/${id}`).then((res) => {
      setForm({ ...res.data, thumbnail: null });
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm({
      ...form,
      [name]: type === "file" ? files[0] : type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== undefined)
        formData.append(key, form[key]);
    });
    await axios.put(`http://localhost:5000/api/courses/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setMsg("✅ Updated!");
    setTimeout(() => navigate("/teacher/courses"), 1000);
  };

  return (
 <div className="card shadow rounded-4 overflow-hidden"> { /* screen size change */}
        <div className="card shadow rounded-4 overflow-hidden">
        {/* Colored header bar matching sidebar/nav */}
<div className="p-4 text-white" style={{ backgroundColor: "#1e293b" }}>
          <h3 className="mb-0">Edit Course</h3>
        </div>

        {/* Card Body */}
        <div className="p-4 bg-light">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-bold text-primary">Course Title</label>
              <input
                name="title"
                type="text"
                className="form-control"
                id="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label fw-bold text-primary">Description</label>
              <textarea
                name="description"
                id="description"
                className="form-control"
                rows="3"
                value={form.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label fw-bold text-primary">Category</label>
              <input
                name="category"
                type="text"
                className="form-control"
                id="category"
                value={form.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="difficulty" className="form-label fw-bold text-primary">Difficulty</label>
                <select
                  name="difficulty"
                  className="form-select"
                  id="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="price" className="form-label fw-bold text-primary">Price (₹)</label>
                <input
                  name="price"
                  type="number"
                  className="form-control"
                  id="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="thumbnail" className="form-label fw-bold text-primary">
                Thumbnail Image <small className="text-muted">(optional)</small>
              </label>
              <input
                name="thumbnail"
                type="file"
                className="form-control"
                id="thumbnail"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                name="published"
                id="published"
                checked={form.published}
                onChange={handleChange}
              />
              <label htmlFor="published" className="form-check-label text-primary fw-semibold">
                Publish this course
              </label>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <button type="submit" className="btn btn-primary px-4">
                Save Changes
              </button>
              <span className="text-success #1e293b fw-medium">{msg}</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditCourse;
