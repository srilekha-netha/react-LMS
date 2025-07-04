import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [chapters, setChapters] = useState([]);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState("");
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user._id) return;

    // Load enrolled courses
    axios.get(`http://localhost:5000/api/enrollments/byUser/${user._id}`)
      .then(res => {
        const enrolled = (res.data || []).filter(e => e.course && e.course._id);
        setEnrolledCourses(enrolled);
      })
      .catch(err => console.error("❌ Enrollment load error:", err));

    // Load previous submissions
    axios.get(`http://localhost:5000/api/assignments/byUser/${user._id}`)
      .then(res => setAssignments(res.data))
      .catch(err => console.error("❌ Assignment load error:", err));
  }, [msg, user._id]);

  // When a course is selected, load its chapters
  useEffect(() => {
    if (!selectedCourseId) return;

    axios.get(`http://localhost:5000/api/courses/${selectedCourseId}`)
      .then(res => setChapters(res.data.chapters || []))
      .catch(() => setChapters([]));
  }, [selectedCourseId]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!selectedCourseId || selectedChapterIndex === "" || !file) {
      setMsg("❌ Please select a course, chapter, and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("student", user._id);
    formData.append("course", selectedCourseId);
    formData.append("chapter", selectedChapterIndex);

    try {
      // ✅ Submit the assignment
      await axios.post("http://localhost:5000/api/assignments/submit", formData);

      // ✅ Fetch course details to get teacher ID
      const courseRes = await axios.get(`http://localhost:5000/api/courses/${selectedCourseId}`);
      const course = courseRes.data;
      const teacherId = course?.instructor?._id;

      // ✅ Send notification to teacher
      if (teacherId) {
        await axios.post("http://localhost:5000/api/notifications/send", {
          user: teacherId,
          text: `📤 ${user.name} submitted an assignment for "${course.title}"`,
          icon: "bi bi-file-earmark-arrow-up"
        });
      }

      setMsg("✅ Assignment submitted!");
      setFile(null);
      setSelectedCourseId("");
      setSelectedChapterIndex("");
      setChapters([]);
    } catch (err) {
      console.error("❌ Submit error:", err);
      setMsg("❌ Failed to submit assignment.");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">📄 Student Assignments</h2>

      <div className="card p-3 mb-4">
        <h4>Upload Assignment (PDF)</h4>

        <div className="mb-3">
          <label>Select Course:</label>
          <select
            className="form-select"
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setSelectedChapterIndex("");
            }}
          >
            <option value="">-- Select Course --</option>
            {enrolledCourses.map((e, i) => (
              <option key={i} value={e.course._id}>
                {e.course.title}
              </option>
            ))}
          </select>
        </div>

        {chapters.length > 0 && (
          <div className="mb-3">
            <label>Select Chapter:</label>
            <select
              className="form-select"
              value={selectedChapterIndex}
              onChange={(e) => setSelectedChapterIndex(e.target.value)}
            >
              <option value="">-- Select Chapter --</option>
              {chapters.map((ch, idx) => (
                <option key={idx} value={idx}>
                  {`Chapter ${idx + 1}: ${ch.title}`}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-3">
          <label>Choose PDF:</label>
          <input
            type="file"
            className="form-control"
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </div>

        <button className="btn btn-success" onClick={handleSubmit}>
          Submit Assignment
        </button>

        {msg && <p className="mt-2">{msg}</p>}
      </div>

      <div>
        <h5>📋 Your Submissions</h5>
        {assignments.length === 0 ? (
          <div className="alert alert-info">No assignments found.</div>
        ) : (
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Course</th>
                <th>Chapter</th>
                <th>Status</th>
                <th>Grade</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a._id}>
                  <td>{a.course?.title}</td>
                  <td>{parseInt(a.chapter) + 1}</td>
                  <td>
                    <span className={`badge ${a.status === "Graded" ? "bg-success" : "bg-warning text-dark"}`}>
                      {a.status}
                    </span>
                  </td>
                  <td>{a.grade || "N/A"}</td>
                  <td>
                    {a.fileUrl ? (
                      <a
                        href={`http://localhost:5000${a.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    ) : (
                      "No File"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default StudentAssignments;
