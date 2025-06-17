import React, { useState } from "react";

// ⚡️ Demo data – later fetch this from your backend / API
const sampleCourses = [
  {
    id: 1,
    title: "Full‑Stack Web Development",
    description:
      "Master MERN stack from scratch and build deploy‑ready applications.",
    instructor: "Priya Sharma",
    duration: "10 weeks",
    level: "Beginner",
    price: 6999,
  },
  {
    id: 2,
    title: "Data Science with Python",
    description:
      "Data wrangling, visualisation, and machine‑learning pipelines in Python.",
    instructor: "Dr. Rohit Rao",
    duration: "8 weeks",
    level: "Intermediate",
    price: 8999,
  },
  {
    id: 3,
    title: "Advanced React Patterns",
    description:
      "Hooks, Context, Suspense, server components, and high‑performance UI design.",
    instructor: "Anita George",
    duration: "6 weeks",
    level: "Advanced",
    price: 5499,
  },
];

function ExploreCourses() {
  // Track coupon code and discounted price for every course id
  const [coupons, setCoupons] = useState({}); // { [courseId]: { code:'SAVE20', final:5999 } }

  const handleApplyCoupon = (id, originalPrice, code) => {
    // Very simple demo logic: a code SAVE20 gives 20 % off
    let final = originalPrice;
    if (code.trim().toUpperCase() === "SAVE20") {
      final = Math.round(originalPrice * 0.8);
    }
    setCoupons(prev => ({ ...prev, [id]: { code, final } }));
  };

  return (
    <div className="container-fluid px-3 px-md-4">
      <h2 className="mb-4 fw-semibold">Explore Courses</h2>

      {/* Responsive grid */}
      <div className="row g-4">
        {sampleCourses.map(course => {
          const couponInfo = coupons[course.id];
          const displayPrice = couponInfo ? couponInfo.final : course.price;

          return (
            <div key={course.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm course-card">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="text-muted small mb-2">
                    <i className="bi bi-person-workspace me-1"></i>
                    {course.instructor}
                  </p>
                  <p className="card-text flex-grow-1">{course.description}</p>

                  <ul className="list-unstyled mb-3 small">
                    <li>
                      <i className="bi bi-clock me-1"></i> {course.duration}
                    </li>
                    <li>
                      <i className="bi bi-bar-chart me-1"></i> {course.level}
                    </li>
                  </ul>

                  {/* Price & coupon */}
                  <div className="mb-3">
                    <span className="h5 fw-bold">
                      ₹{displayPrice.toLocaleString()}
                    </span>
                    {couponInfo && couponInfo.final !== course.price && (
                      <span className="text-decoration-line-through text-muted ms-2">
                        ₹{course.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Coupon code"
                      defaultValue={couponInfo?.code || ""}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          handleApplyCoupon(
                            course.id,
                            course.price,
                            e.target.value
                          );
                        }
                      }}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        const input =
                          document.getElementById(`coupon-${course.id}`);
                        handleApplyCoupon(
                          course.id,
                          course.price,
                          input ? input.value : ""
                        );
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="card-footer bg-transparent border-0">
                  <button className="btn btn-success w-100">
                    Enrol&nbsp;Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExploreCourses;
