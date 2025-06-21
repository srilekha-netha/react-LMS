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
      .then(res => setCourses(res.data));
  }, []);

  const handleSelect = async (course) => {
    setSelected(course);
    // Show first unlocked chapter with quiz
    const ch = course.course.chapters.find((c, i) => i < course.chaptersUnlocked && c.quiz.length > 0);
    setQuiz(ch ? ch.quiz : []);
    setAnswers(new Array(ch ? ch.quiz.length : 0).fill(""));
    setResult(null);
  };

  const handleChange = (idx, val) => {
    const arr = [...answers];
    arr[idx] = val;
    setAnswers(arr);
  };

  const handleSubmit = async () => {
    const chapterIdx = selected.course.chapters.findIndex((c, i) => i < selected.chaptersUnlocked && c.quiz.length > 0);
    const res = await axios.post(`http://localhost:5000/api/courses/${selected.course._id}/submit-quiz/${chapterIdx}`, {
      userId: JSON.parse(localStorage.getItem("user"))._id,
      answers
    });
    setResult(res.data);
  };

  return (
    <div>
      <h2>Quizzes</h2>
      <ul>
        {courses.map((en, i) => (
          <li key={en._id}>
            {en.course.title}
            <button onClick={() => handleSelect(en)} style={{ marginLeft: 6 }}>Take Quiz</button>
          </li>
        ))}
      </ul>
      {quiz.length > 0 &&
        <div>
          <h4>Quiz for {selected.course.title}</h4>
          {quiz.map((q, idx) => (
            <div key={idx}>
              <b>{q.question}</b>
              {q.options.map((opt, j) =>
                <div key={j}>
                  <input
                    type="radio"
                    name={`q${idx}`}
                    checked={answers[idx] === opt}
                    onChange={() => handleChange(idx, opt)}
                  /> {opt}
                </div>
              )}
            </div>
          ))}
          <button onClick={handleSubmit}>Submit Quiz</button>
          {result && (
            <div>
              <p>Score: {result.score} / {result.total}</p>
              <p>Percent: {result.percent}% {result.passed ? "(Passed)" : "(Failed)"}</p>
            </div>
          )}
        </div>
      }
    </div>
  );
}
export default Quizzes;
