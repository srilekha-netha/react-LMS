import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./StudentDashboard.css";

function CourseContentManager() {
  const { id } = useParams();
  const [course, setCourse] = useState({});
  const [chapters, setChapters] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showAssignment, setShowAssignment] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [chapterForm, setChapterForm] = useState({
    title: "",
    content: "",
    video: null,
    pdf: null,
    quiz: [{ question: "", options: ["", "", "", ""], answer: "" }],
    assignment: ""
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/courses/${id}`).then(res => {
      setCourse(res.data);
      setChapters(res.data.chapters || []);
    });
  }, [id]);

  const handleChapterChange = (e) => {
    const { name, value, type, files } = e.target;
    setChapterForm({
      ...chapterForm,
      [name]: type === "file" ? files[0] : value
    });
  };

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

  const handleDeleteChapter = async (chapterIndex) => {
    if (!window.confirm("Are you sure you want to delete this chapter?")) return;
    try {
      const res = await axios.delete(`http://localhost:5000/api/courses/${id}/chapter/${chapterIndex}`);
      setChapters(res.data.chapters);
      setMessage("🗑️ Chapter deleted.");
      setSuccess(true);
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setMessage("❌ Failed to delete chapter");
      setSuccess(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleEditChapter = (chapterIndex) => {
    const chapter = chapters[chapterIndex];
    setChapterForm({
      title: chapter.title,
      content: chapter.content,
      video: null,
      pdf: null,
      quiz: chapter.quiz || [{ question: "", options: ["", "", "", ""], answer: "" }],
      assignment: chapter.assignmentQuestion || ""
    });
    setEditingIndex(chapterIndex);
    setShowAdd(true);
    setShowQuiz(!!chapter.quiz?.length);
    setShowAssignment(!!chapter.assignmentQuestion);
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", chapterForm.title);
    formData.append("content", chapterForm.content);
    if (chapterForm.video) formData.append("video", chapterForm.video);
    if (chapterForm.pdf) formData.append("pdf", chapterForm.pdf);
    if (showQuiz) formData.append("quiz", JSON.stringify(chapterForm.quiz));
    if (showAssignment) formData.append("assignmentQuestion", chapterForm.assignment);

    try {
      const endpoint = editingIndex === null
        ? `http://localhost:5000/api/courses/${id}/add-chapter`
        : `http://localhost:5000/api/courses/${id}/edit-chapter/${editingIndex}`;

      const res = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setChapters(res.data.chapters);
      setChapterForm({
        title: "",
        content: "",
        video: null,
        pdf: null,
        quiz: [{ question: "", options: ["", "", "", ""], answer: "" }],
        assignment: ""
      });
      setMessage(editingIndex === null ? "✅ Chapter added!" : "✅ Chapter updated!");
      setSuccess(true);
      setShowAdd(false);
      setShowQuiz(false);
      setShowAssignment(false);
      setEditingIndex(null);
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

      {message && (
        <div className={`alert content-mgr-msg ${success ? "alert-success" : "alert-danger"} mb-3`}>
          {message}
        </div>
      )}

      <ul className="list-group mb-4 shadow-sm">
        {chapters.map((ch, idx) => (
          <li className="list-group-item content-mgr-chapter" key={idx}>
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <div>
                <strong>{ch.title}</strong>
                {ch.videoUrl && (
                  <a href={`http://localhost:5000${ch.videoUrl}`} target="_blank" rel="noreferrer" className="ms-2">
                    🎥 Video
                  </a>
                )}
                {ch.pdfUrl && (
                  <a href={`http://localhost:5000${ch.pdfUrl}`} target="_blank" rel="noreferrer" className="ms-2">
                    📄 PDF
                  </a>
                )}
              </div>
              <div className="btn-group">
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditChapter(idx)}>
                  ✏️ Edit
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteChapter(idx)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
            <div className="content-mgr-content mb-2">{ch.content}</div>
            {ch.assignmentQuestion && (
              <div>
                <b>📝 Assignment:</b> {ch.assignmentQuestion}
              </div>
            )}
            {ch.quiz && ch.quiz.length > 0 && (
              <div>
                <b>🧠 Quiz:</b>
                <ul className="ps-3">
                  {ch.quiz.map((q, qi) => (
                    <li key={qi}>{q.question}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="d-flex justify-content-center mb-4">
        <button
          className="btn btn-lg btn-primary px-5"
          onClick={() => {
            setShowAdd(!showAdd);
            setEditingIndex(null);
            setChapterForm({
              title: "",
              content: "",
              video: null,
              pdf: null,
              quiz: [{ question: "", options: ["", "", "", ""], answer: "" }],
              assignment: ""
            });
          }}
        >
          {showAdd ? "Close" : "Add New Chapter"}
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleAddChapter}
          className="card p-4 shadow-sm mb-5 content-mgr-form"
          encType="multipart/form-data"
        >
          <h5 className="mb-3 fw-semibold text-primary">{editingIndex !== null ? "Edit Chapter" : "Add Chapter"}</h5>
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

          <div className="d-flex align-items-center gap-2 mt-3">
            <button type="button" className={`btn btn-outline-secondary btn-sm ${showQuiz ? "active" : ""}`} onClick={() => setShowQuiz(!showQuiz)}>
              {showQuiz ? "Hide Quiz" : "Add Quiz"}
            </button>
            <button type="button" className={`btn btn-outline-secondary btn-sm ${showAssignment ? "active" : ""}`} onClick={() => setShowAssignment(!showAssignment)}>
              {showAssignment ? "Hide Assignment" : "Add Assignment"}
            </button>
          </div>

          {showQuiz && (
            <div className="mt-3">
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
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={addQuizQuestion}>
                + Add Another Question
              </button>
            </div>
          )}

          {showAssignment && (
            <div className="mt-3">
              <textarea
                name="assignment"
                value={chapterForm.assignment}
                onChange={handleChapterChange}
                className="form-control"
                placeholder="Enter assignment question"
                rows={3}
              />
            </div>
          )}

          <div className="d-flex mt-4">
            <button type="submit" className="btn btn-success ms-auto">
              {editingIndex !== null ? "Update Chapter" : "Add Chapter"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CourseContentManager;
