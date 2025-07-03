// src/components/CourseDetails.js
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./StudentDashboard.css";  // contains the .cd-… styles

export default function CourseDetails() {
  const { search } = useLocation();
  const courseId = new URLSearchParams(search).get("id");

  const [course, setCourse] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);
  const [progress, setProgress] = useState({ chaptersUnlocked: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) {
      setError("No course ID provided");
      return;
    }
    // Fetch course
    axios
      .get(`http://localhost:5000/api/courses/${courseId}`)
      .then(res => {
        setCourse(res.data);
        setActiveChapter(res.data.chapters[0] || null);
      })
      .catch(() => setError("Failed to load course"));

    // Fetch progress
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user._id) {
      axios
        .get(`http://localhost:5000/api/enrollments/progress/${user._id}/${courseId}`)
        .then(res => setProgress(res.data))
        .catch(() => {});
    }
  }, [courseId]);

  if (error) return <div className="cd-loading cd-error">{error}</div>;
  if (!course) return <div className="cd-loading">Loading…</div>;

  const total  = course.chapters.length;
  const unlocked = progress.chaptersUnlocked || 0;
  const percent = total ? Math.round(unlocked / total * 100) : 0;

  return (
    <div className="cd-container">
      <aside className="cd-sidebar">
        <h5>Chapters</h5>
        <div className="cd-progress-bar">
          <div className="cd-progress-filled" style={{ width: `${percent}%` }} />
        </div>
        <ul>
          {course.chapters.map((ch, idx) => {
            const isUnlocked = idx < unlocked;
            const isActive   = activeChapter?._id === ch._id;
            return (
              <li
                key={ch._id}
                className={`${isActive ? "active" : ""} ${isUnlocked ? "" : "locked"}`}
                onClick={() => isUnlocked && setActiveChapter(ch)}
              >
                {ch.title}
              </li>
            );
          })}
        </ul>
      </aside>

      <main className="cd-content">
        <div className="cd-card">
          {/* Chapter Title */}
          <h3>{activeChapter.title}</h3>

          {/* Video */}
          {activeChapter.videoUrl ? (
            <video
              src={activeChapter.videoUrl}
              controls
              className="cd-video"
            />
          ) : null}

          {/* PDF Link */}
          {activeChapter.pdfUrl ? (
            <a
              href={activeChapter.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cd-btn cd-btn-pdf"
            >
              Download PDF
            </a>
          ) : null}

          {/* Assignment */}
          {activeChapter.assignmentQuestion ? (
            <div className="cd-section">
              <h5>Assignment</h5>
              <p>{activeChapter.assignmentQuestion}</p>
            </div>
          ) : null}

          {/* Quiz */}
          {activeChapter.quizId ? (
            <div className="cd-section">
              <h5>Quiz</h5>
              <Link
                to={`/student/quizzes?chapter=${activeChapter._id}`}
                className="cd-btn cd-btn-quiz"
              >
                Take Quiz
              </Link>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
