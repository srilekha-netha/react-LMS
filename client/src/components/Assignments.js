import React, { useEffect, useState } from "react";
import axios from "axios";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?._id) return;

    axios.get(`http://localhost:5000/api/assignments/byTeacher/${user._id}`)
      .then(res => setAssignments(res.data || []))
      .catch(err => console.error("❌ Fetch error", err));
  }, [user]);

  const handleGrade = async (id, grade = "A") => {
    try {
      await axios.post(`http://localhost:5000/api/assignments/grade/${id}`, { grade });

      setAssignments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status: "Graded", grade } : a
        )
      );
      alert("✅ Graded successfully");
    } catch (err) {
      console.error("❌ Grade error", err);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">📥 Submitted Assignments</h2>

      {assignments.length === 0 ? (
        <div className="alert alert-info">No assignments yet.</div>
      ) : (
        <div className="row">
          {assignments.map((a, i) => (
            <div key={i} className="col-md-6">
              <div className="card mb-3 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{a.course?.title}</h5>
                  <p><strong>👤 Student:</strong> {a.student?.name}</p>
                  <p><strong>📘 Chapter:</strong> {a.chapter}</p>
                  <p><strong>📄 File:</strong> 
                    <a
                      href={`http://localhost:5000${a.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ms-1"
                    >
                      View PDF
                    </a>
                  </p>
                  <p><strong>Status:</strong>{" "}
                    <span className={`badge ${a.status === "Graded" ? "bg-success" : "bg-warning text-dark"}`}>
                      {a.status}
                    </span>
                  </p>
                  <p><strong>Grade:</strong> {a.grade || "N/A"}</p>
                  {a.status !== "Graded" ? (
                    <button className="btn btn-primary btn-sm" onClick={() => handleGrade(a._id, "A")}>
                      ✅ Mark as Graded (A)
                    </button>
                  ) : (
                    <button className="btn btn-secondary btn-sm" disabled>
                      Graded
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Assignments;
