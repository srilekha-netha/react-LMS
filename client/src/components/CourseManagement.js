import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent making API call if id is undefined
    if (!id || id === "undefined") {
      setError("Invalid course ID. Please select a course again.");
      return;
    }
    axios.get(`http://localhost:5000/api/courses/${id}`)
      .then(res => setCourse(res.data))
      .catch(err => {
        setError("Failed to fetch course.");
      });
  }, [id]);

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!course) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>{course.title}</h2>
      <img src={`http://localhost:5000/uploads/thumbnails/${course.thumbnail}`} alt={course.title} />
      <p>{course.description}</p>
      <h4>Chapters</h4>
      <ul>
        {course.chapters
          .filter(ch => !ch.locked) // show only unlocked chapters for the student
          .map((ch, idx) => (
            <li key={idx}>
              <strong>{ch.title}</strong>
              {ch.videoUrl && (
                <div>
                  <a href={`http://localhost:5000${ch.videoUrl}`} target="_blank" rel="noreferrer">
                    Watch Video
                  </a>
                </div>
              )}
              {ch.pdfUrl && (
                <div>
                  <a href={`http://localhost:5000${ch.pdfUrl}`} target="_blank" rel="noreferrer">
                    Download PDF
                  </a>
                </div>
              )}
              <div>{ch.content}</div>
              {/* Optionally: display quiz */}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default CourseDetails;
