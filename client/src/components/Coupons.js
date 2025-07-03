import React, { useEffect, useState } from "react";
import './StudentDashboard.css';

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discount: 0,
    type: "percentage",
    expiry: "",
    usageLimit: 1,
    applicableCourses: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = () => {
    // use fake data demonstration
    setTimeout(() => {
      setCoupons([
        { id: 1, code: 'WELCOME10', discount: 10, type: 'percentage', expiry: '2025-12-31', usageLimit: 100, applicableCourses: 'All' },
        { id: 2, code: 'FLAT500', discount: 500, type: 'flat', expiry: '2025-10-01', usageLimit: 50, applicableCourses: 'React,Node' }
      ]);
      setLoading(false);
    }, 500);
  };

  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const createCoupon = (e) => {
    e.preventDefault();
    alert('Coupon Created: ' + form.code);
    setForm({ code: "", discount: 0, type: "percentage", expiry: "", usageLimit: 1, applicableCourses: "" });
    fetchCoupons();
  };
  const deleteCoupon = (id) => {
    if (window.confirm('Delete coupon?')) fetchCoupons();
  };

  return (
    <div className="container mt-4">
      <h3 className="fw-bold">🏷️ Coupon Management</h3>
      <form className="row g-3 my-3" onSubmit={createCoupon}>
        <div className="col-12 col-md-3">
          <label className="form-label">Code</label>
          <input
            type="text"
            name="code"
            className="form-control"
            placeholder="Coupon Code"
            value={form.code}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-6 col-md-2">
          <label className="form-label">Discount</label>
          <input
            type="number"
            name="discount"
            className="form-control"
            value={form.discount}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-6 col-md-2">
          <label className="form-label">Type</label>
          <select
            name="type"
            className="form-select"
            value={form.type}
            onChange={handleInputChange}
          >
            <option value="percentage">%</option>
            <option value="flat">₹</option>
          </select>
        </div>
        <div className="col-6 col-md-2">
          <label className="form-label">Expiry</label>
          <input
            type="date"
            name="expiry"
            className="form-control"
            value={form.expiry}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-6 col-md-1">
          <label className="form-label">Limit</label>
          <input
            type="number"
            name="usageLimit"
            className="form-control"
            value={form.usageLimit}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-12 col-md-2">
          <label className="form-label">Courses</label>
          <input
            type="text"
            name="applicableCourses"
            className="form-control"
            value={form.applicableCourses}
            onChange={handleInputChange}
            placeholder="Comma-separated"
          />
        </div>
        <div className="col-12 text-end">
          <button className="btn btn-success">
            <i className="bi bi-plus-circle me-1"></i> Create
          </button>
        </div>
      </form>

      {loading ? (
        <p>Loading coupons...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Expiry</th>
                <th>Usage Limit</th>
                <th>Courses</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td data-label="Code">{c.code}</td>
                  <td data-label="Discount">{c.discount}{c.type === 'percentage' ? '%' : '₹'}</td>
                  <td data-label="Expiry">{c.expiry}</td>
                  <td data-label="Usage Limit">{c.usageLimit}</td>
                  <td data-label="Courses">{c.applicableCourses}</td>
                  <td data-label="Actions">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteCoupon(c.id)}
                    >
                      <i className="bi bi-trash"></i>
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

export default Coupons;
