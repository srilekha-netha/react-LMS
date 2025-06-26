import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentDashboard.css"; // Optional: your custom styles

function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const [user] = useState(() => JSON.parse(localStorage.getItem("user"))); // Avoid warning

  useEffect(() => {
    if (!user?._id) return;
    axios.get(`http://localhost:5000/api/assignments/byUser/${user._id}`)

    axios
      .get(`http://localhost:5000/api/assignments/byUser/${user._id}`)
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error("Error fetching assignments:", err));
  }, [msg, user._id]); // ✅ ESLint warning resolved

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSelect = (assignment) => {
    setSelected(assignment);
    setMsg("");
  };

  const handleSubmit = async () => {
    if (!file) return setMsg("Choose a file!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("student", selected.student);
    formData.append("course", selected.course._id);
    formData.append("chapter", selected.chapter);

    try {
      await axios.post("http://localhost:5000/api/assignments/submit", formData);
      setMsg("Assignment submitted successfully!");
      setFile(null);
      setSelected(null);
    } catch (err) {
      setMsg("Submission failed.");
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">My Assignments</h2>

      {assignments.length === 0 ? (
        <div className="alert alert-info">No assignments found.</div>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Course</th>
              <th>Chapter</th>
              <th>File</th>
              <th>Status</th>
              <th>Grade</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a._id}>
                <td>{a.course.title}</td>
                <td>{a.chapter}</td>
                <td>
                  {a.fileUrl ? (
                    <a href={a.fileUrl} target="_blank" rel="noopener noreferrer">
                      View File
                    </a>
                  ) : (
                    "No File"
                  )}
                </td>
                <td>
                  {a.status === "Graded" ? (
                    <span className="badge bg-success">Graded</span>
                  ) : (
                    <span className="badge bg-warning text-dark">Submitted</span>
                  )}
                </td>
                <td>{a.grade || "N/A"}</td>
                <td>
                  {a.status !== "Graded" && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleSelect(a)}
                    >
                      Submit / Resubmit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <div className="mt-4">
          <h5>
            Submit Assignment: <strong>{selected.course.title}</strong>, Chapter{" "}
            <strong>{selected.chapter}</strong>
          </h5>
          <input type="file" className="form-control mt-2" onChange={handleFileChange} />
          <div className="mt-2">
            <button className="btn btn-success me-2" onClick={handleSubmit}>
              Upload
            </button>
            <button className="btn btn-secondary" onClick={() => setSelected(null)}>
              Cancel
            </button>
          </div>
          {msg && <p className="mt-2 text-success">{msg}</p>}
        </div>
      )}
    </div>
  );
}

export default StudentAssignments;
