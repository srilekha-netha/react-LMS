import React, { useEffect, useState } from "react";
import axios from "axios";

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discount: 0,
    type: "percentage", // or "flat"
    expiry: "",
    usageLimit: 1,
    applicableCourses: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = () => {
    axios
      .get("/api/admin/coupons")
      .then((res) => {
        setCoupons(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching coupons", err);
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const createCoupon = (e) => {
    e.preventDefault();
    axios
      .post("/api/admin/coupons", form)
      .then(() => {
        setForm({
          code: "",
          discount: 0,
          type: "percentage",
          expiry: "",
          usageLimit: 1,
          applicableCourses: "",
        });
        fetchCoupons();
      })
      .catch((err) => {
        console.error("Error creating coupon", err);
      });
  };

  const deleteCoupon = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      axios
        .delete(`/api/admin/coupons/${id}`)
        .then(fetchCoupons)
        .catch((err) => console.error("Delete failed", err));
    }
  };

  return (
    <div className="container mt-4">
      <h3>🏷️ Coupon Management</h3>

      {/* Coupon Creation Form */}
      <form className="row g-3 my-3" onSubmit={createCoupon}>
        <div className="col-md-3">
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

        <div className="col-md-2">
          <input
            type="number"
            name="discount"
            className="form-control"
            placeholder="Discount"
            value={form.discount}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="col-md-2">
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

        <div className="col-md-2">
          <input
            type="date"
            name="expiry"
            className="form-control"
            value={form.expiry}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="col-md-1">
          <input
            type="number"
            name="usageLimit"
            className="form-control"
            placeholder="Limit"
            value={form.usageLimit}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="col-md-2">
          <input
            type="text"
            name="applicableCourses"
            className="form-control"
            placeholder="Course IDs (comma)"
            value={form.applicableCourses}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-12 text-end">
          <button className="btn btn-success">
            <i className="bi bi-plus-circle me-1"></i> Create Coupon
          </button>
        </div>
      </form>

      {/* Coupon Table */}
      {loading ? (
        <p>Loading coupons...</p>
      ) : (
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
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td>{coupon.code}</td>
                <td>
                  {coupon.discount}
                  {coupon.type === "percentage" ? "%" : "₹"}
                </td>
                <td>{coupon.expiry}</td>
                <td>{coupon.usageLimit}</td>
                <td>{coupon.applicableCourses}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteCoupon(coupon.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Coupons;
