import React, { useEffect, useState } from "react";
import axios from "axios";

function Quizzes() {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios.get(`http://localhost:5000/api/enrollments/byUser/${user._id}`)
      .then(res => {
        const valid = res.data.filter(en => en.course !== null); // ✅ filter null courses
        setCourses(valid);
      });
  }, []);

  const handleSelect = async (enrollment) => {
    setSelected(enrollment);
    const chapter = enrollment.course.chapters.find((c, i) =>
      i < enrollment.chaptersUnlocked && c.quiz.length > 0
    );
    if (chapter) {
      setQuiz(chapter.quiz);
      setAnswers(new Array(chapter.quiz.length).fill(""));
    } else {
      setQuiz([]);
    }
    setResult(null);
  };

  const handleChange = (idx, val) => {
    const updated = [...answers];
    updated[idx] = val;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    const chapterIdx = selected.course.chapters.findIndex((c, i) =>
      i < selected.chaptersUnlocked && c.quiz.length > 0
    );
    const res = await axios.post(
      `http://localhost:5000/api/courses/${selected.course._id}/submit-quiz/${chapterIdx}`,
      {
        userId: JSON.parse(localStorage.getItem("user"))._id,
        answers
      }
    );
    setResult(res.data);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Quizzes</h2>

      <ul className="list-group mb-4">
        {courses.length === 0 ? (
          <li className="list-group-item text-muted">No courses with quizzes available</li>
        ) : (
          courses.map((en) => (
            <li key={en._id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{en.course?.title || "Untitled Course"}</span>
              <button className="btn btn-sm btn-outline-primary" onClick={() => handleSelect(en)}>Take Quiz</button>
            </li>
          ))
        )}
      </ul>

      {quiz.length > 0 && selected && (
        <div className="card p-3">
          <h4 className="mb-3">Quiz for {selected.course?.title || "Course"}</h4>
          {quiz.map((q, idx) => (
            <div key={idx} className="mb-3">
              <strong>{q.question}</strong>
              {q.options.map((opt, j) => (
                <div key={j} className="form-check">
                  <input
                    type="radio"
                    name={`q${idx}`}
                    id={`q${idx}_opt${j}`}
                    className="form-check-input"
                    checked={answers[idx] === opt}
                    onChange={() => handleChange(idx, opt)}
                  />
                  <label htmlFor={`q${idx}_opt${j}`} className="form-check-label">{opt}</label>
                </div>
              ))}
            </div>
          ))}
          <button className="btn btn-success" onClick={handleSubmit}>Submit Quiz</button>
          {result && (
            <div className="alert mt-3" style={{ background: result.passed ? "#d4edda" : "#f8d7da" }}>
              <p><strong>Score:</strong> {result.score} / {result.total}</p>
              <p><strong>Percent:</strong> {result.percent}% {result.passed ? "(Passed)" : "(Failed)"}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Quizzes;
