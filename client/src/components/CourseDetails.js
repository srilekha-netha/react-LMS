import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./StudentDashboardOverrides.css";  // <-- your single override file

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
    (async () => {
      try {
        const [courseRes, enrollRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/courses/${courseId}`),
          axios.get(`http://localhost:5000/api/enrollments/byUserAndCourse/${user._id}/${courseId}`)
        ]);
        setCourse(courseRes.data);
        setEnrollment(enrollRes.data);
        setCurrentChapter(Math.max(enrollRes.data.chaptersUnlocked - 1, 0));
      } catch {
        setError("Failed to load course or enrollment.");
      }
    })();
  }, [courseId, user._id]);

  const handleAnswerChange = (i,opt) => {
    const u = [...answers]; u[i] = opt; setAnswers(u);
  };

  const handleSubmitQuiz = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/submit-quiz/${currentChapter}`,
        { userId: user._id, answers }
      );
      setQuizResult(res.data);
    } catch {
      alert("❌ Quiz submission failed");
    }
  };

  const handleCompleteChapter = async () => {
    try {
      await axios.post(`http://localhost:5000/api/enrollments/progress/update`, {
        studentId: user._id,
        courseId,
        chapterId: currentChapter,
      });
      const nr = await axios.get(
        `http://localhost:5000/api/enrollments/byUserAndCourse/${user._id}/${courseId}`
      );
      setEnrollment(nr.data);
      // advance
      if (currentChapter + 1 < course.chapters.length) {
        setCurrentChapter(currentChapter + 1);
        setVideoWatched(false);
        setPdfViewed(false);
        setAnswers([]);
        setQuizResult(null);
      }
    } catch {
      alert("❌ Failed to complete or unlock next chapter");
    }
  };

  if (error)       return <div className="cd-error">{error}</div>;
  if (!course || !enrollment)
    return <div className="cd-loading">Loading…</div>;

  const total = course.chapters.length;
  const percent = Math.round((enrollment.chaptersUnlocked/total)*100);
  const chap = course.chapters[currentChapter] || {};
  const isLast = currentChapter === total - 1;
  const canComplete =
    (!chap.videoUrl || videoWatched) &&
    (!chap.pdfUrl   || pdfViewed) &&
    (!chap.quiz     || chap.quiz.length===0 || quizResult?.passed);
  const doneAll = enrollment.completed && isLast;

  return (
    <div className="cd-container">
      <aside className="cd-sidebar">
        <h5>Chapters</h5>
        <div className="cd-progress-bar">
          <div className="cd-progress-filled" style={{width:`${percent}%`}} />
        </div>
        <ul>
          {course.chapters.map((c,i) => {
            const unlocked = i < enrollment.chaptersUnlocked;
            return (
              <li
                key={i}
                className={`${i===currentChapter?"active":""} ${!unlocked?"locked":""}`}
                onClick={()=> unlocked && setCurrentChapter(i)}
              >
                {c.title||`Chapter ${i+1}`}
                {!unlocked && <span className="lock-icon">🔒</span>}
              </li>
            );
          })}
        </ul>
      </aside>

      <main className="cd-content">
        <div className="cd-card">
          <h3 className="fw-bold">{chap.title}</h3>

          {chap.videoUrl && (
            <video
              ref={videoRef}
              src={`http://localhost:5000${chap.videoUrl}`}
              controls
              onEnded={()=>setVideoWatched(true)}
              className="cd-video"
            />
          )}

          {chap.pdfUrl && (
            <button
              className="btn cd-btn btn-outline-info"
              onClick={()=>{setPdfViewed(true); window.open(`http://localhost:5000${chap.pdfUrl}`, "_blank");}}
            >
              📄 View PDF
            </button>
          )}

          {Array.isArray(chap.quiz) && chap.quiz.length>0 && (
            <div className="mt-4">
              <h5>Quiz</h5>
              {chap.quiz.map((q,idx)=>(
                <div key={idx} className="mb-3">
                  <strong>{q.question}</strong>
                  {q.options.map((opt,j)=>(
                    <div key={j} className="form-check">
                      <input
                        type="radio"
                        name={`quiz${idx}`}
                        className="form-check-input"
                        disabled={!videoWatched}
                        checked={answers[idx]===opt}
                        onChange={()=>handleAnswerChange(idx,opt)}
                      />
                      <label className="form-check-label">{opt}</label>
                    </div>
                  ))}
                </div>
              ))}
              <button
                className="btn btn-success"
                disabled={answers.length!==chap.quiz.length}
                onClick={handleSubmitQuiz}
              >
                Submit Quiz
              </button>
              {quizResult && (
                <div className={`alert mt-3 ${quizResult.passed?"alert-success":"alert-danger"}`}>
                  <p><strong>Score:</strong> {quizResult.score}/{quizResult.total}</p>
                  <p><strong>Result:</strong> {quizResult.percent}% — {quizResult.passed?"Passed":"Failed"}</p>
                </div>
              )}
            </div>
          )}

          {!doneAll && (
            <button
              className="btn btn-primary mt-3"
              disabled={!canComplete}
              onClick={handleCompleteChapter}
            >
              ✅ {isLast?"Finish Course":"Mark as Complete"}
            </button>
          )}

          {doneAll && (
            <div className="alert alert-success text-center mt-3">
              🎉 Congratulations! You’ve completed the course.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
