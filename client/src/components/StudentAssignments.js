import React, { useState } from "react";
import "./StudentDashboard.css";

const assignmentsData = [
  {
    id: 1,
    chapter: "Introduction to Node.js",
    question: "Explain the architecture of Node.js with diagrams.",
    deadline: "2025-06-25",
    status: "Not Submitted",
  },
  {
    id: 2,
    chapter: "Express Framework",
    question: "Create a basic Express server with routing and middleware.",
    deadline: "2025-06-28",
    status: "Submitted",
  },
  {
    id: 3,
    chapter: "REST APIs",
    question: "Build a RESTful API for a todo app with CRUD operations.",
    deadline: "2025-07-01",
    status: "Graded",
  },
];

function StudentAssignments() {
  const [submissions, setSubmissions] = useState({});

  const handleFileChange = (event, id) => {
    setSubmissions({
      ...submissions,
      [id]: event.target.files[0],
    });
  };

  const handleSubmit = (id) => {
    alert(`Assignment ${id} submitted successfully!`);
  };

  return (
    <div className="assignment-container">
      <h2 className="heading">📄 Assignments</h2>
      <div className="assignment-list">
        {assignmentsData.map((assignment) => (
          <div className="assignment-card" key={assignment.id}>
            <h5>{assignment.chapter}</h5>
            <p><strong>Question:</strong> {assignment.question}</p>
            <p><strong>Deadline:</strong> {assignment.deadline}</p>
            <p><strong>Status:</strong> {assignment.status}</p>

            {assignment.status === "Not Submitted" && (
              <>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, assignment.id)}
                />
                <button
                  className="submit-btn"
                  onClick={() => handleSubmit(assignment.id)}
                  disabled={!submissions[assignment.id]}
                >
                  Submit Assignment
                </button>
              </>
            )}

            {assignment.status === "Submitted" && (
              <p className="submitted-text">✅ Your assignment has been submitted.</p>
            )}

            {assignment.status === "Graded" && (
              <p className="graded-text">📊 Assignment graded. Check feedback.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentAssignments;

