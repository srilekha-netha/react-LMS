import React, { useEffect, useState } from "react";

function MyCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Simulate fetch call – Replace with actual API later
    const dummyCourses = [
      { id: 1, title: "React for Beginners", status: "Published" },
      { id: 2, title: "Advanced JavaScript", status: "Draft" },
    ];
    setCourses(dummyCourses);
  }, []);

  return (
    <div className="container-fluid">
      <h2 className="my-4">My Courses</h2>

      {courses.length === 0 ? (
        <div className="alert alert-info">No courses created yet.</div>
      ) : (
        <div className="row g-3">
          {courses.map((course) => (
            <div className="col-md-6" key={course.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">
                    Status:{" "}
                    <span
                      className={`badge ${
                        course.status === "Published"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {course.status}
                    </span>
                  </p>
                  <div className="mt-auto">
                    <button className="btn btn-outline-primary btn-sm me-2">
                      Edit
                    </button>
                    <button className="btn btn-outline-danger btn-sm">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCourses;
