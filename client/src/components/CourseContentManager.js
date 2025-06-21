import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./StudentDashboard.css";

function CourseContentManager() {
  const { id } = useParams();
  const [course, setCourse] = useState({});
  const [chapters, setChapters] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [chapterForm, setChapterForm] = useState({
    title: "",
    content: "",
    video: null,
    pdf: null,
    quiz: [{ question: "", options: ["", "", "", ""], answer: "" }]
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch course and chapters
  useEffect(() => {
    axios.get(`http://localhost:5000/api/courses/${id}`).then(res => {
      setCourse(res.data);
      setChapters(res.data.chapters || []);
    });
  }, [id]);

  // Input change handlers
  const handleChapterChange = (e) => {
    const { name, value, type, files } = e.target;
    setChapterForm({
      ...chapterForm,
      [name]: type === "file" ? files[0] : value
    });
  };

  // Quiz logic
  const handleQuizChange = (idx, field, value) => {
    const updatedQuiz = chapterForm.quiz.map((q, i) =>
      i === idx ? { ...q, [field]: value } : q
    );
    setChapterForm({ ...chapterForm, quiz: updatedQuiz });
  };
  const handleQuizOptionChange = (qIdx, oIdx, value) => {
    const updatedQuiz = chapterForm.quiz.map((q, i) => {
      if (i === qIdx) {
        const newOptions = q.options.map((opt, j) => (j === oIdx ? value : opt));
        return { ...q, options: newOptions };
      }
      return q;
    });
    setChapterForm({ ...chapterForm, quiz: updatedQuiz });
  };
  const addQuizQuestion = () => {
    setChapterForm({
      ...chapterForm,
      quiz: [...chapterForm.quiz, { question: "", options: ["", "", "", ""], answer: "" }]
    });
  };

  // Add chapter
  const handleAddChapter = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", chapterForm.title);
    formData.append("content", chapterForm.content);
    if (chapterForm.video) formData.append("video", chapterForm.video);
    if (chapterForm.pdf) formData.append("pdf", chapterForm.pdf);
    if (showQuiz) formData.append("quiz", JSON.stringify(chapterForm.quiz));

    try {
      const res = await axios.post(
        `http://localhost:5000/api/courses/${id}/add-chapter`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setChapters(res.data.chapters);
      setChapterForm({
        title: "",
        content: "",
        video: null,
        pdf: null,
        quiz: [{ question: "", options: ["", "", "", ""], answer: "" }]
      });
      setMessage("✅ Chapter added successfully!");
      setSuccess(true);
      setShowAdd(false);
      setShowQuiz(false);
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data?.message || err.message));
      setSuccess(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <div className="container content-mgr-container py-3 px-2">
      <h3 className="mb-4">
        <span className="text-primary">{course.title || "..."}</span>
        <span className="fs-6 text-muted ms-2">({chapters.length} Chapters)</span>
      </h3>
      {/* Course Update Message */}
      {message && (
        <div className={`alert content-mgr-msg ${success ? "alert-success" : "alert-danger"} mb-3`}>
          {message}
        </div>
      )}

      {/* Chapters List */}
      <ul className="list-group mb-4 shadow-sm">
        {chapters.map((ch, idx) => (
          <li className="list-group-item content-mgr-chapter" key={idx}>
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <div>
                <strong>{ch.title}</strong>
                {ch.videoUrl && (
                  <span className="ms-2">
                    <a
                      href={`http://localhost:5000${ch.videoUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="content-mgr-link"
                    >
                      <i className="bi bi-play-circle-fill me-1"></i>Video
                    </a>
                  </span>
                )}
                {ch.pdfUrl && (
                  <span className="ms-2">
                    <a
                      href={`http://localhost:5000${ch.pdfUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="content-mgr-link"
                    >
                      <i className="bi bi-file-earmark-pdf-fill me-1"></i>PDF
                    </a>
                  </span>
                )}
              </div>
              <span
                className={`badge content-mgr-badge px-3 py-1 ${
                  ch.locked ? "bg-warning text-dark" : "bg-success"
                }`}
              >
                {ch.locked ? "Locked" : "Unlocked"}
              </span>
            </div>
            <div className="content-mgr-content mb-2">{ch.content}</div>
            <div>
              <b className="me-2">Quiz:</b>
              <ul className="ps-3">
                {ch.quiz && ch.quiz.map((q, qi) => (
                  <li key={qi} className="mb-1">{q.question}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      {/* Add Chapter Button */}
      <div className="d-flex justify-content-center mb-4">
        <button
          className={`btn btn-lg btn-primary px-5 content-mgr-add-btn ${showAdd ? "active" : ""}`}
          onClick={() => setShowAdd(!showAdd)}
        >
          {showAdd ? "Close" : "Add New Chapter"}
        </button>
      </div>

      {/* Add Chapter Form (Collapsible) */}
      {showAdd && (
        <form
          onSubmit={handleAddChapter}
          className="card p-4 shadow-sm mb-5 content-mgr-form"
          encType="multipart/form-data"
        >
          <h5 className="mb-3 fw-semibold text-primary">Add Chapter</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <input
                name="title"
                value={chapterForm.title}
                onChange={handleChapterChange}
                className="form-control"
                placeholder="Chapter Title"
                required
                autoFocus
              />
            </div>
            <div className="col-md-6">
              <input
                name="video"
                type="file"
                className="form-control"
                accept="video/*"
                onChange={handleChapterChange}
              />
            </div>
            <div className="col-md-6">
              <input
                name="pdf"
                type="file"
                className="form-control"
                accept="application/pdf"
                onChange={handleChapterChange}
              />
            </div>
            <div className="col-md-6">
              <textarea
                name="content"
                value={chapterForm.content}
                onChange={handleChapterChange}
                className="form-control"
                placeholder="Chapter description/content"
                rows={2}
              />
            </div>
          </div>
          {/* Add Quiz Button */}
          <div className="d-flex align-items-center gap-2 mt-3">
            <button
              type="button"
              className={`btn btn-outline-secondary btn-sm content-mgr-toggle-quiz ${showQuiz ? "active" : ""}`}
              onClick={() => setShowQuiz((v) => !v)}
            >
              {showQuiz ? "Hide Quiz" : "Add Quiz"}
            </button>
            <span className="small text-muted">Add quiz questions for this chapter (optional)</span>
          </div>
          {/* Quiz Fields (collapsible) */}
          {showQuiz && (
            <div className="mt-3 content-mgr-quiz-fields">
              {chapterForm.quiz.map((q, qIdx) => (
                <div key={qIdx} className="mb-3 p-3 border rounded bg-light">
                  <input
                    className="form-control mb-2"
                    placeholder="Question"
                    value={q.question}
                    onChange={e => handleQuizChange(qIdx, "question", e.target.value)}
                    required
                  />
                  <div className="row g-2">
                    {q.options.map((opt, oIdx) => (
                      <div className="col-6 col-md-3" key={oIdx}>
                        <input
                          className="form-control mb-1"
                          placeholder={`Option ${oIdx + 1}`}
                          value={opt}
                          onChange={e => handleQuizOptionChange(qIdx, oIdx, e.target.value)}
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <input
                    className="form-control mb-2"
                    placeholder="Correct Answer"
                    value={q.answer}
                    onChange={e => handleQuizChange(qIdx, "answer", e.target.value)}
                    required
                  />
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={addQuizQuestion}
              >
                + Add Another Question
              </button>
            </div>
          )}
          <div className="d-flex mt-4">
            <button type="submit" className="btn btn-success ms-auto content-mgr-submit-btn">
              Add Chapter
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CourseContentManager;
