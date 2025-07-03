import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

export default function EditCourse() {
  const { id }       = useParams();   // course ID from URL
  const navigate     = useNavigate();
  const [form, setForm]           = useState({
    title: "", description: "", category: "",
    difficulty: "Beginner", price: "",
    published: false, thumbnail: null
  });
  const [thumbPreview, setThumbPreview] = useState(null);
  const [msg, setMsg]               = useState("");
  const [loading, setLoading]       = useState(false);

  // 1️⃣ Load existing course on mount
  useEffect(() => {
    axios.get(`http://localhost:5000/api/courses/${id}`)
      .then(res => {
        const c = res.data;
        setForm({
          title:       c.title || "",
          description: c.description || "",
          category:    c.category || "",
          difficulty:  c.difficulty || "Beginner",
          price:       c.price  || "",
          published:   c.published,
          thumbnail:   null      // file input blank by default
        });
        // show existing thumbnail
        setThumbPreview(
          c.thumbnail
            ? `http://localhost:5000/uploads/thumbnails/${c.thumbnail}`
            : null
        );
      })
      .catch(err => {
        console.error("❌ Failed to load course:", err);
        setMsg("Error loading course.");
      });
  }, [id]);

  // 2️⃣ Form handlers (same as Create)
  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setForm(f => ({ ...f, [name]: files[0] }));
      setThumbPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else if (type === "checkbox") {
      setForm(f => ({ ...f, [name]: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  // 3️⃣ Submit updated data
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      // append only fields you want
      ["title","description","category","difficulty","price","published"].forEach(key=>{
        data.append(key, form[key]);
      });
      if (form.thumbnail) data.append("thumbnail", form.thumbnail);

      await axios.put(
        `http://localhost:5000/api/courses/${id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMsg("Course updated successfully!");
      setTimeout(() => navigate("/admin/courses"), 800);
    } catch (err) {
      console.error("❌ Update failed:", err);
      setMsg("Update error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container create-course-container">
      <h2 className="mb-4 fw-bold">Edit Course</h2>
      {msg && (
        <div className={`alert ${msg.startsWith("Update error") ? "alert-danger" : "alert-success"}`}>
          {msg}
        </div>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* reuse your CreateCourse form layout:
            title, description, category, difficulty, price, published checkbox */}
        <div className="row g-3">
          <div className="col-12 col-md-8">
            {/* Title */}
            <div className="form-group mb-3">
              <label className="form-label fw-medium">Title<span className="text-danger">*</span></label>
              <input
                name="title" type="text" className="form-control"
                value={form.title} onChange={handleChange} required
              />
            </div>
            {/* Description */}
            <div className="form-group mb-3">
              <label className="form-label fw-medium">Description<span className="text-danger">*</span></label>
              <textarea
                name="description" className="form-control" rows={3}
                value={form.description} onChange={handleChange} required
              />
            </div>
            {/* Category & Difficulty */}
            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label fw-medium">Category<span className="text-danger">*</span></label>
                <input
                  name="category" className="form-control"
                  value={form.category} onChange={handleChange} required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">Difficulty<span className="text-danger">*</span></label>
                <select
                  name="difficulty" className="form-select"
                  value={form.difficulty} onChange={handleChange}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
            {/* Price & Published */}
            <div className="row g-2 mt-2">
              <div className="col-md-6">
                <label className="form-label fw-medium">Price (₹)<span className="text-danger">*</span></label>
                <input
                  name="price" type="number" min={0} className="form-control"
                  value={form.price} onChange={handleChange} required
                />
              </div>
              <div className="col-md-6 d-flex align-items-end">
                <div className="form-check ms-2 mb-0">
                  <input
                    type="checkbox" className="form-check-input"
                    name="published" id="pubSwitch"
                    checked={form.published} onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="pubSwitch">
                    Published
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail Preview & Upload */}
          <div className="col-12 col-md-4 d-flex flex-column align-items-center">
            <label className="form-label fw-medium">Thumbnail</label>
            <div className="thumb-preview-area mb-2">
              {thumbPreview ? (
                <img src={thumbPreview} className="thumb-preview-img" alt="thumb"/>
              ) : (
                <div className="thumb-placeholder">No Image</div>
              )}
            </div>
            <input
              name="thumbnail" type="file" className="form-control"
              accept="image/*" onChange={handleChange}
            />
            <small className="text-muted mt-1">16:9 or 4:3 recommended</small>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-4 text-end">
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update Course"}
          </button>
        </div>
      </form>
    </div>
  );
}
