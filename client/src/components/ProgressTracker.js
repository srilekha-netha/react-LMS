import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentDashboard.css";

const chaptersData = [
  { id: 1, title: "Introduction to Node.js", quiz: true },
  { id: 2, title: "Express Framework", quiz: true },
  { id: 3, title: "REST APIs", quiz: true },
  { id: 4, title: "Authentication & Authorization", quiz: true },
];

function ProgressTracker({ courseId }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [unlockedChapters, setUnlockedChapters] = useState([1]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [activeChapter, setActiveChapter] = useState(1);

  // 📥 Load progress from backend
  useEffect(() => {
    if (!user?._id || !courseId) return;

    axios
      .get(`http://localhost:5000/api/enrollments/progress/${user._id}/${courseId}`)
      .then((res) => {
        const enr = res.data;
        setUnlockedChapters(
          Array.from({ length: enr.chaptersUnlocked }, (_, i) => i + 1)
        );
        setCompletedQuizzes(enr.completedQuizzes || []);
      })
      .catch((err) => console.error("❌ Failed to load progress", err));
  }, [user?._id, courseId]);

  // ✅ Submit quiz
  const handleQuizCompletion = async (chapterId) => {
    try {
      await axios.post("http://localhost:5000/api/enrollments/progress/update", {
        studentId: user._id,
        courseId,
        chapterId,
      });

      setCompletedQuizzes((prev) => [...prev, chapterId]);
      const next = chapterId + 1;
      if (!unlockedChapters.includes(next)) {
        setUnlockedChapters((prev) => [...prev, next]);
      }
    } catch (err) {
      console.error("❌ Error updating progress", err);
    }
  };

  return (
    <div className="progress-container">
      <aside className="chapter-sidebar">
        <h5>Chapters</h5>
        <ul className="chapter-list">
          {chaptersData.map((chapter) => (
            <li
              key={chapter.id}
              className={`chapter-item ${activeChapter === chapter.id ? "active" : ""} ${
                !unlockedChapters.includes(chapter.id) ? "locked" : ""
              }`}
              onClick={() =>
                unlockedChapters.includes(chapter.id) && setActiveChapter(chapter.id)
              }
            >
              {chapter.title}
              {!unlockedChapters.includes(chapter.id) && <span className="lock-icon">🔒</span>}
            </li>
          ))}
        </ul>
      </aside>

      <main className="chapter-content">
        <h3>{chaptersData[activeChapter - 1].title}</h3>
        <p>Complete the quiz to unlock the next chapter.</p>
        <button
          className="btn btn-success"
          disabled={completedQuizzes.includes(activeChapter)}
          onClick={() => handleQuizCompletion(activeChapter)}
        >
          {completedQuizzes.includes(activeChapter)
            ? "Quiz Completed ✅"
            : "Complete Chapter Quiz"}
        </button>
      </main>
    </div>
  );
}

export default ProgressTracker;
