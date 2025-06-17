import React, { useState } from "react";
import "./StudentDashboard.css"; // Custom styling file

const chaptersData = [
  { id: 1, title: "Introduction to Node.js", quiz: true },
  { id: 2, title: "Express Framework", quiz: true },
  { id: 3, title: "REST APIs", quiz: true },
  { id: 4, title: "Authentication & Authorization", quiz: true },
];

function ProgressTracker() {
  const [unlockedChapters, setUnlockedChapters] = useState([1]);
  const [activeChapter, setActiveChapter] = useState(1);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);

  const handleQuizCompletion = (chapterId) => {
    if (!completedQuizzes.includes(chapterId)) {
      setCompletedQuizzes([...completedQuizzes, chapterId]);
      const nextChapter = chapterId + 1;
      if (!unlockedChapters.includes(nextChapter)) {
        setUnlockedChapters([...unlockedChapters, nextChapter]);
      }
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
              className={`chapter-item ${
                activeChapter === chapter.id ? "active" : ""
              } ${!unlockedChapters.includes(chapter.id) ? "locked" : ""}`}
              onClick={() =>
                unlockedChapters.includes(chapter.id) &&
                setActiveChapter(chapter.id)
              }
            >
              {chapter.title}
              {!unlockedChapters.includes(chapter.id) && (
                <span className="lock-icon">🔒</span>
              )}
            </li>
          ))}
        </ul>
      </aside>

      <main className="chapter-content">
        <h3>{chaptersData[activeChapter - 1].title}</h3>
        <p>
          This is the content for <strong>{chaptersData[activeChapter - 1].title}</strong>. 
          Watch the video, read the content, and then complete the quiz to unlock the next chapter.
        </p>
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
