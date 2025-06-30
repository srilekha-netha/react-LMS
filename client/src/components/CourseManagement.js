import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!id || id === "undefined") {
      setError("Invalid course ID. Please select a course again.");
      return;
    }

    axios
      .get(`http://localhost:5000/api/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch(() => {
        setError("❌ Failed to fetch course details.");
      });
  }, [id]);

  if (error)
    return (
      <div style={{ color: "red", padding: "20px" }}>
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );

  if (!course) return <div style={{ padding: "20px" }}>Loading course details...</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-3">{course.title}</h2>

      <img
        src={`http://localhost:5000/uploads/thumbnails/${course.thumbnail || "default.png"}`}
        alt={course.title}
        style={{ width: "300px", borderRadius: "10px", marginBottom: "20px" }}
      />

      <p>{course.description}</p>

      <h4 className="mt-4">Chapters</h4>
      <ul className="list-unstyled">
        {course.chapters?.filter((ch) => !ch.locked).map((ch, idx) => (
          <li key={idx} className="mb-4 p-3 border rounded">
            <h5>{ch.title}</h5>

            {ch.videoUrl && (
              <div className="mb-2">
                <a
                  href={`http://localhost:5000${ch.videoUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  ▶️ Watch Video
                </a>
              </div>
            )}

            {ch.pdfUrl && (
              <div className="mb-2">
                <a
                  href={`http://localhost:5000${ch.pdfUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  📄 Download PDF
                </a>
              </div>
            )}

            <div>{ch.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseDetails;
