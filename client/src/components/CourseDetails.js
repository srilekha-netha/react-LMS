import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function CourseDetails() {
  const { search } = useLocation();
  const courseId = new URLSearchParams(search).get("id");

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [videoWatched, setVideoWatched] = useState(false);
  const [pdfViewed, setPdfViewed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [error, setError] = useState(null);

  const videoRef = useRef();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!courseId || !user._id) {
      setError("Missing course ID or user not logged in.");
      return;
    }

    const fetchData = async () => {
      try {
        const [courseRes, enrollRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/courses/${courseId}`),
          axios.get(`http://localhost:5000/api/enrollments/byUserAndCourse/${user._id}/${courseId}`)
        ]);
        setCourse(courseRes.data);
        setEnrollment(enrollRes.data);
        setCurrentChapter(Math.max(enrollRes.data.chaptersUnlocked - 1, 0));
      } catch (err) {
        setError("Failed to load course or enrollment.");
        console.error(err);
      }
    };

    fetchData();
  }, [courseId, user._id]);

  const handleAnswerChange = (idx, value) => {
    const updated = [...answers];
    updated[idx] = value;
    setAnswers(updated);
  };

  const handleSubmitQuiz = async (chapterIdx) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/courses/${courseId}/submit-quiz/${chapterIdx}`, {
        userId: user._id,
        answers,
      });
      setQuizResult(res.data);
    } catch (err) {
      alert("❌ Quiz submission failed");
    }
  };

  const handleCompleteChapter = async (idx) => {
    try {
      await axios.post(`http://localhost:5000/api/enrollments/progress/update`, {
        studentId: user._id,
        courseId,
        chapterId: idx,
      });

      const enrollRes = await axios.get(
        `http://localhost:5000/api/enrollments/byUserAndCourse/${user._id}/${courseId}`
      );
      setEnrollment(enrollRes.data);

      if (idx + 1 < course.chapters.length) {
        setCurrentChapter(idx + 1);
        setVideoWatched(false);
        setPdfViewed(false);
        setAnswers([]);
        setQuizResult(null);
      }
    } catch (err) {
      alert("❌ Failed to complete or unlock next chapter");
      console.error(err);
    }
  };

  if (error) return <div className="cd-error">{error}</div>;
  if (!course || !enrollment || !Array.isArray(course.chapters)) return <div className="cd-loading">Loading...</div>;

  const total = course.chapters.length;
  const percent = Math.round((enrollment.chaptersUnlocked / total) * 100);
  const activeChapter = course.chapters[currentChapter];
  const isLastChapter = currentChapter === total - 1;

  const canMarkComplete =
    (!activeChapter?.videoUrl || videoWatched) &&
    (!activeChapter?.pdfUrl || pdfViewed) &&
    (!activeChapter?.quiz || activeChapter.quiz.length === 0 || quizResult?.passed);

  const allCompleted = enrollment.completed && currentChapter === total - 1;

  return (
    <div className="cd-container">
      <aside className="cd-sidebar">
        <h5>Chapters</h5>
        <div className="cd-progress-bar">
          <div className="cd-progress-filled" style={{ width: `${percent}%` }} />
        </div>
        <ul>
          {course.chapters.map((ch, i) => {
            const isUnlocked = i < enrollment.chaptersUnlocked;
            const isCompleted = i < enrollment.completedQuizzes?.length;
            return (
              <li
                key={i}
                className={`${i === currentChapter ? "active" : ""} ${!isUnlocked ? "locked" : ""}`}
                onClick={() => isUnlocked && setCurrentChapter(i)}
              >
                {ch.title || `Chapter ${i + 1}`}
                {isCompleted && <span className="check-icon">✅</span>}
              </li>
            );
          })}
        </ul>
      </aside>

      <main className="cd-content">
        <div className="cd-card">
          {activeChapter ? (
            <>
              <h3 className="fw-bold">{activeChapter?.title}</h3>

              {activeChapter?.videoUrl && (
                <video
                  ref={videoRef}
                  src={`http://localhost:5000${activeChapter.videoUrl}`}
                  controls
                  onEnded={() => setVideoWatched(true)}
                  className="cd-video"
                />
              )}

              {activeChapter?.pdfUrl && (
                <div className="mt-2">
                  <a
                    href={`http://localhost:5000${activeChapter.pdfUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-info"
                    onClick={() => setPdfViewed(true)}
                  >
                    📄 View PDF
                  </a>
                </div>
              )}

              {activeChapter?.assignmentQuestion && (
                <div className="mt-3">
                  <h6>📌 Assignment</h6>
                  <p><strong>Question:</strong> {activeChapter.assignmentQuestion}</p>
                </div>
              )}

              {Array.isArray(activeChapter?.quiz) && activeChapter.quiz.length > 0 && (
                <div className="mt-4">
                  <h5>Quiz</h5>
                  {activeChapter.quiz.map((q, idx) => (
                    <div key={idx} className="mb-3">
                      <strong>{q.question}</strong>
                      {q.options.map((opt, i) => (
                        <div key={i} className="form-check">
                          <input
                            type="radio"
                            name={`quiz${idx}`}
                            className="form-check-input"
                            checked={answers[idx] === opt}
                            onChange={() => handleAnswerChange(idx, opt)}
                            disabled={!videoWatched}
                          />
                          <label className="form-check-label">{opt}</label>
                        </div>
                      ))}
                    </div>
                  ))}

                  <button
                    onClick={() => handleSubmitQuiz(currentChapter)}
                    disabled={answers.length !== activeChapter.quiz.length}
                    className="btn btn-success"
                  >
                    Submit Quiz
                  </button>

                  {quizResult && (
                    <div className={`alert mt-3 ${quizResult.passed ? "alert-success" : "alert-danger"}`}>
                      <p><strong>Score:</strong> {quizResult.score} / {quizResult.total}</p>
                      <p><strong>Result:</strong> {quizResult.percent}% - {quizResult.passed ? "Passed" : "Failed"}</p>
                    </div>
                  )}
                </div>
              )}

              {!allCompleted && (
                <button
                  className="btn btn-primary mt-3"
                  disabled={!canMarkComplete}
                  onClick={() => handleCompleteChapter(currentChapter)}
                >
                  ✅ {isLastChapter ? "Finish Course" : "Mark as Complete"}
                </button>
              )}

              {allCompleted && (
                <div className="alert alert-success text-center mt-3">
                  🎓 <strong>Congratulations!</strong> You’ve completed the course. No more chapters left.
                </div>
              )}
            </>
          ) : (
            <p className="text-danger">⚠️ No chapter content available.</p>
          )}
        </div>
      </main>

      {/* Inline CSS for simplicity */}
      <style>{`
        .cd-container {
          display: flex;
          min-height: 100vh;
        }
        .cd-sidebar {
          width: 260px;
          background: #f8f9fa;
          padding: 20px;
          border-right: 1px solid #ddd;
        }
        .cd-sidebar h5 {
          font-size: 18px;
          font-weight: bold;
          color: #0d6efd;
          margin-bottom: 16px;
        }
        .cd-sidebar ul {
          list-style: none;
          padding: 0;
        }
        .cd-sidebar li {
          background: #eee;
          margin-bottom: 8px;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: 0.2s;
        }
        .cd-sidebar li.active {
          background: #0d6efd;
          color: white;
          font-weight: bold;
        }
        .cd-sidebar li.active .check-icon {
          color: white;
        }
        .check-icon {
          color: #28a745;
          margin-left: 8px;
        }
        .cd-content {
          flex: 1;
          padding: 20px;
        }
        .cd-progress-bar {
          height: 6px;
          background: #ddd;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        .cd-progress-filled {
          height: 100%;
          background: #0d6efd;
          border-radius: 4px;
        }
        .cd-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(0,0,0,0.05);
        }
        .cd-video {
          width: 100%;
          max-height: 360px;
          border-radius: 12px;
          margin-top: 12px;
        }
      `}</style>
    </div>
  );
}
