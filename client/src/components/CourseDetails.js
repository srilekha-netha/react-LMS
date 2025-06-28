import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function CourseDetails() {
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [videoWatched, setVideoWatched] = useState(false);
  const [pdfViewed, setPdfViewed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const query = useQuery();
  const courseId = query.get("id");

  useEffect(() => {
    const fetchData = async () => {
      const courseRes = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
      const enrollRes = await axios.get(`http://localhost:5000/api/enrollments/byUserAndCourse/${user._id}/${courseId}`);
      setCourse(courseRes.data);
      setEnrollment(enrollRes.data);
      setCurrentChapter(Math.max(enrollRes.data.chaptersUnlocked - 1, 0));
    };
    fetchData();
  }, [courseId, user._id]);

  const handleAnswerChange = (idx, value) => {
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
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
      await axios.post(`http://localhost:5000/api/enrollments/unlockChapter`, {
        userId: user._id,
        courseId,
        chapterIndex: idx,
      });
      setCurrentChapter(idx + 1);
      setVideoWatched(false);
      setPdfViewed(false);
      setAnswers([]);
      setQuizResult(null);
    } catch {
      alert("❌ Failed to unlock next chapter");
    }
  };

  if (!course || !enrollment) return <div>Loading...</div>;

  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-bold">{course.title}</h3>

      {course.chapters.map((chapter, idx) => {
        const isUnlocked = idx < enrollment.chaptersUnlocked;
        const isCurrent = idx === currentChapter;

        return (
          <div key={idx} className="p-3 mb-4 border rounded bg-light">
            <h5>Chapter {idx + 1}: {chapter.title}</h5>

            {isUnlocked ? (
              <>
                <p>{chapter.content}</p>

                {chapter.videoUrl && (
                  <video
                    width="600"
                    controls
                    onEnded={() => setVideoWatched(true)}
                  >
                    <source
                      src={`http://localhost:5000${chapter.videoUrl}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                )}

                {chapter.pdfUrl && (
                  <div className="mt-2">
                    <a
                      href={`http://localhost:5000${chapter.pdfUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setPdfViewed(true)}
                    >
                      📄 View PDF
                    </a>
                  </div>
                )}

                {/* ✅ Assignment Display */}
                {typeof chapter.assignmentQuestion === "string" && chapter.assignmentQuestion.trim() !== "" && (
                  <div className="mt-3">
                    <h6>📝 Assignment</h6>
                    <p><strong>Question:</strong> {chapter.assignmentQuestion}</p>
                  </div>
                )}

                {/* ✅ Quiz Display */}
                {chapter.quiz && chapter.quiz.length > 0 && (
                  <div className="mt-4">
                    <h6>📝 Quiz</h6>
                    {chapter.quiz.map((q, qIdx) => (
                      <div key={qIdx} className="mb-3">
                        <strong>{q.question}</strong>
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="form-check">
                            <input
                              type="radio"
                              name={`q${qIdx}`}
                              id={`q${qIdx}_opt${oIdx}`}
                              className="form-check-input"
                              checked={answers[qIdx] === opt}
                              onChange={() => handleAnswerChange(qIdx, opt)}
                            />
                            <label htmlFor={`q${qIdx}_opt${oIdx}`} className="form-check-label">
                              {opt}
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                    <button
                      className="btn btn-outline-success mt-2"
                      onClick={() => handleSubmitQuiz(idx)}
                      disabled={answers.length !== chapter.quiz.length}
                    >
                      Submit Quiz
                    </button>
                    {quizResult && (
                      <div className="alert mt-3" style={{ background: quizResult.passed ? "#d4edda" : "#f8d7da" }}>
                        <p><strong>Score:</strong> {quizResult.score} / {quizResult.total}</p>
                        <p><strong>Percent:</strong> {quizResult.percent}% {quizResult.passed ? "(Passed)" : "(Failed)"}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ✅ Mark Chapter as Complete */}
                {isCurrent && (
                  <button
                    className="btn btn-primary mt-3"
                    disabled={
                      (chapter.videoUrl && !videoWatched) ||
                      (chapter.pdfUrl && !pdfViewed) ||
                      (chapter.quiz && chapter.quiz.length > 0 && !quizResult?.passed)
                    }
                    onClick={() => handleCompleteChapter(idx)}
                  >
                    ✅ Mark as Complete
                  </button>
                )}
              </>
            ) : (
              <span>🔒 Locked. Complete previous chapters to unlock.</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CourseDetails;
