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

  const user = JSON.parse(localStorage.getItem("user"));
  const query = useQuery();
  const courseId = query.get("id");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/courses/${courseId}`)
      .then(res => setCourse(res.data));
    axios.get(`http://localhost:5000/api/enrollments/byUserAndCourse/${user._id}/${courseId}`)
      .then(res => {
        setEnrollment(res.data);
        setCurrentChapter(res.data.chaptersUnlocked - 1);
      });
  }, [courseId, user._id]);

  const handleCompleteChapter = async (idx) => {
    try {
      await axios.post(`http://localhost:5000/api/enrollments/unlockChapter`, {
        userId: user._id,
        courseId,
        chapterIndex: idx,
      });
      setCurrentChapter(idx + 1);
    } catch (e) { alert("Failed"); }
  };

  if (!course || !enrollment) return <div>Loading...</div>;
  return (
    <div>
      <h3>{course.title}</h3>
      <div>
        {course.chapters.map((chapter, idx) => (
          <div key={idx} style={{
            opacity: idx < enrollment.chaptersUnlocked ? 1 : 0.5,
            background: idx === currentChapter ? "#def" : "#fff",
            margin: 8,
            padding: 8,
            border: "1px solid #ccc"
          }}>
            <strong>Chapter {idx + 1}: {chapter.title}</strong>
            <div>
              {idx < enrollment.chaptersUnlocked
                ? (
                  <>
                    <p>{chapter.content}</p>
                    {chapter.videoUrl && <video controls src={chapter.videoUrl} width="300"></video>}
                    {chapter.pdfUrl && <a href={chapter.pdfUrl} target="_blank" rel="noopener noreferrer">Download PDF</a>}
                    {/* Quiz, Mark Complete logic here */}
                    {idx === currentChapter &&
                      <button onClick={() => handleCompleteChapter(idx)}>Mark as Complete</button>
                    }
                  </>
                ) : (
                  <span>Locked. Complete previous chapters to unlock.</span>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default CourseDetails;
