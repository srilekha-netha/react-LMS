import React from "react";
import "./StudentDashboard"; // Optional for extra styling
import { Link } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "React for Beginners",
    instructor: "Jane Doe",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?fit=crop&w=600&q=80",
    level: "Beginner",
    progress: 40,
  },
  {
    id: 2,
    title: "Advanced Node.js",
    instructor: "John Smith",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?fit=crop&w=600&q=80",
    level: "Advanced",
    progress: 70,
  },
  {
    id: 3,
    title: "Full-Stack Web Dev",
    instructor: "Emily Johnson",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?fit=crop&w=600&q=80",
    level: "Intermediate",
    progress: 90,
  },
];

function StudentCourses() {
  return (
    <div className="container">
      <h2 className="mb-4 text-primary">📘 My Courses</h2>
      <div className="row">
        {courses.map((course) => (
          <div className="col-md-6 col-lg-4 mb-4" key={course.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={course.image}
                className="card-img-top"
                alt={course.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text mb-1">
                  <strong>Instructor:</strong> {course.instructor}
                </p>
                <p className="card-text mb-1">
                  <strong>Level:</strong> {course.level}
                </p>
                <div className="mb-3">
                  <strong>Progress:</strong>
                  <div className="progress mt-1">
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${course.progress}%` }}
                      aria-valuenow={course.progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {course.progress}%
                    </div>
                  </div>
                </div>
                <div className="mt-auto d-flex justify-content-between">
                  <button className="btn btn-sm btn-outline-primary">
                    Continue
                  </button>
                  <Link
                     to="/student/coursedetails"
                     state={{ title: course.title }}
                      className="btn btn-sm btn-secondary"
                 >
                 View Details
                  </Link>


                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentCourses;
