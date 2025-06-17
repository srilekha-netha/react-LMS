import React, { useState } from "react";
import "./StudentDashboard";

const quizzes = [
  {
    id: 1,
    chapter: "Introduction to Node.js",
    questions: [
      {
        question: "What is Node.js primarily used for?",
        options: ["Mobile Development", "Machine Learning", "Server-side applications", "Database Design"],
        correctAnswer: "Server-side applications",
      },
      {
        question: "Node.js runs on which engine?",
        options: ["JavaScriptCore", "V8", "SpiderMonkey", "Chakra"],
        correctAnswer: "V8",
      },
    ],
  },
  {
    id: 2,
    chapter: "Express Framework",
    questions: [
      {
        question: "What does `app.use()` do in Express?",
        options: ["Defines a route", "Mounts middleware", "Starts server", "Creates a module"],
        correctAnswer: "Mounts middleware",
      },
      {
        question: "What is the default HTTP port?",
        options: ["3000", "80", "5000", "8080"],
        correctAnswer: "80",
      },
    ],
  },
];

function Quizzes() {
  const [currentQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const currentQuiz = quizzes[currentQuizIndex];

  const handleOptionChange = (questionIndex, selectedOption) => {
    setAnswers({ ...answers, [questionIndex]: selectedOption });
  };

  const handleSubmit = () => {
    let correct = 0;
    currentQuiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) correct++;
    });
    const scorePercent = (correct / currentQuiz.questions.length) * 100;
    setResult(scorePercent >= 70 ? "Passed" : "Failed");
  };

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">📝 Quiz - {currentQuiz.chapter}</h2>

      {currentQuiz.questions.map((q, idx) => (
        <div key={idx} className="quiz-question">
          <p>
            <strong>Q{idx + 1}:</strong> {q.question}
          </p>
          {q.options.map((option, i) => (
            <label key={i} className="quiz-option">
              <input
                type="radio"
                name={`question-${idx}`}
                value={option}
                checked={answers[idx] === option}
                onChange={() => handleOptionChange(idx, option)}
              />
              {option}
            </label>
          ))}
        </div>
      ))}

      {!result ? (
        <button className="submit-quiz-btn" onClick={handleSubmit}>
          Submit Quiz
        </button>
      ) : (
        <div className={`quiz-result ${result === "Passed" ? "passed" : "failed"}`}>
          {result === "Passed" ? "✅ You passed! Next chapter unlocked." : "❌ You failed. Try again."}
        </div>
      )}
    </div>
  );
}

export default Quizzes;
