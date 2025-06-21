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
    published: false
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/courses/${id}`).then(res => {
      setForm({ ...res.data, thumbnail: null }); // thumbnail: null so we don't overwrite unless uploading new
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm({
      ...form,
      [name]: type === "file" ? files[0] : (type === "checkbox" ? checked : value)
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
      headers: { "Content-Type": "multipart/form-data" }
    });
    setMsg("Updated!");
    setTimeout(() => navigate("/teacher/courses"), 1000);
  };

  return (
    <div className="container" style={{ maxWidth: 700 }}>
      <h2>Edit Course</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Course Title</label>
          <input name="title" type="text" className="form-control" value={form.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea name="description" className="form-control" rows="3" value={form.description} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Category</label>
          <input name="category" type="text" className="form-control" value={form.category} onChange={handleChange} required />
        </div>
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <label>Difficulty</label>
            <select name="difficulty" className="form-select" value={form.difficulty} onChange={handleChange}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div className="col-md-6">
            <label>Price (₹)</label>
            <input name="price" type="number" className="form-control" value={form.price} onChange={handleChange} required />
          </div>
        </div>
        <div className="mb-3">
          <label>Thumbnail Image (leave blank to keep current)</label>
          <input name="thumbnail" type="file" className="form-control" accept="image/*" onChange={handleChange} />
        </div>
        <div className="form-check mb-3">
          <input type="checkbox" className="form-check-input" name="published" checked={form.published} onChange={handleChange} />
          <label className="form-check-label">Published</label>
        </div>
        <button type="submit" className="btn btn-primary">Save Changes</button>
        <span className="ms-3 text-success">{msg}</span>
      </form>
    </div>
  );
}
export default EditCourse;
