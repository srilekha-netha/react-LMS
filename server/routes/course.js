import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./ExploreCourses.css";  // <— fixed import

export default function CourseDetails() {
  const { search } = useLocation();
  const courseId = new URLSearchParams(search).get("id");

  const [course, setCourse] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);
  const [unlocked, setUnlocked] = useState(1);
  const [error, setError] = useState(null);

  const [videoDone, setVideoDone] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});

  const videoRef = useRef(null);

  useEffect(() => {
    if (!courseId) {
      setError("No course ID provided");
      return;
    }
    // 1) Fetch course
    axios.get(`/api/courses/${courseId}`)
      .then(res => {
        setCourse(res.data);
        setActiveChapter(res.data.chapters[0]);
      })
      .catch(() => setError("Failed to load course"));

    // 2) Fetch progress
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user._id) {
      axios.get(`/api/enrollments/progress/${user._id}/${courseId}`)
        .then(res => setUnlocked(res.data.chaptersUnlocked))
        .catch(() => {/* ignore */});
    }
  }, [courseId]);

  if (error)   return <div className="cd-error">{error}</div>;
  if (!course) return <div className="cd-loading">Loading…</div>;

  const total = course.chapters.length;
  const percent = Math.round((unlocked / total) * 100);

  // mark video done
  const handleVideoEnd = () => setVideoDone(true);

  // collect quiz answers
  const handleQuizChange = (idx, opt) => {
    setQuizAnswers(prev => ({ ...prev, [idx]: opt }));
  };

  // submit quiz to server
  const submitQuiz = () => {
    const chapterIdx = course.chapters.findIndex(c => c._id === activeChapter._id);
    axios.post(`/api/courses/${courseId}/submit-quiz/${chapterIdx}`, {
      userId: JSON.parse(localStorage.getItem("user"))._id,
      answers: quizAnswers
    })
    .then(({ data }) => {
      if (data.passed) {
        // unlock next
        axios.post(`/api/enrollments/unlock/${JSON.parse(localStorage.getItem("user"))._id}/${courseId}`)
          .then(res => setUnlocked(res.data.chaptersUnlocked));
        alert("🎉 Quiz passed! Next chapter unlocked.");
      } else {
        alert(`❌ You scored ${data.score}/${data.total}. Need ≥70% to pass.`);
      }
    })
    .catch(() => alert("Error submitting quiz"));
  };

  return (
    <div className="cd-container">
      <aside className="cd-sidebar">
        <h5>Chapters</h5>
        <div className="cd-progress-bar">
          <div className="cd-progress-filled" style={{ width: `${percent}%` }} />
        </div>
        <ul>
          {course.chapters.map((ch, i) => {
            const isOpen = i < unlocked;
            const isActive = activeChapter._id === ch._id;
            return (
              <li key={ch._id}
                  className={`${isActive?"active":""} ${isOpen?"":"locked"}`}
                  onClick={() => isOpen && setActiveChapter(ch)}>
                {ch.title}
              </li>
            );
          })}
        </ul>
      </aside>

      <main className="cd-content">
        <div className="cd-card">
          <h3>{activeChapter.title}</h3>

          {activeChapter.videoUrl && (
            <video
              ref={videoRef}
              src={activeChapter.videoUrl}
              controls
              onEnded={handleVideoEnd}
              className="cd-video"
            />
          )}

          {videoDone && activeChapter.pdfUrl && (
            <a
              href={activeChapter.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cd-btn cd-btn-pdf"
            >
              Download PDF
            </a>
          )}

          <div className="cd-section">
            <h5>Quiz</h5>
            {activeChapter.quiz.map((q, idx) => (
              <div key={idx} className="cd-quiz-question">
                <p>{q.question}</p>
                {q.options.map(opt => (
                  <label key={opt}>
                    <input
                      type="radio"
                      name={`quiz${idx}`}
                      onChange={() => handleQuizChange(idx, opt)}
                      disabled={!videoDone}
                    />
                    {" "}{opt}
                  </label>
                ))}
              </div>
            ))}
            <button
              onClick={submitQuiz}
              disabled={!videoDone}
              className="cd-btn cd-btn-quiz"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
