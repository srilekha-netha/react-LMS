import React, { useEffect, useState } from "react";

function Assignments() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const dummyAssignments = [
      { id: 1, student: "Asha R.", course: "React", file: "assignment1.pdf", status: "Submitted" },
      { id: 2, student: "Raj M.", course: "JS Basics", file: "assignment2.pdf", status: "Graded" },
    ];
    setAssignments(dummyAssignments);
  }, []);

  const handleGrade = (id) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "Graded" } : a
      )
    );
    alert(`Assignment ${id} marked as graded.`);
  };

  return (
    <div className="container-fluid">
      <h2 className="my-4">Submitted Assignments</h2>

      {assignments.length === 0 ? (
        <div className="alert alert-info">No assignments submitted yet.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>File</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id}>
                  <td>{a.student}</td>
                  <td>{a.course}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      onClick={(e) => {
                        e.preventDefault();
                        // TODO: handle actual file download or preview
                      }}
                    >
                      {a.file}
                    </button>
                  </td>
                  <td>
                    <span
                      className={
                        a.status === "Graded"
                          ? "badge bg-success"
                          : "badge bg-warning text-dark"
                      }
                    >
                      {a.status}
                    </span>
                  </td>
                  <td>
                    {a.status !== "Graded" ? (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleGrade(a.id)}
                      >
                        Mark as Graded
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-secondary" disabled>
                        Graded
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Assignments;
