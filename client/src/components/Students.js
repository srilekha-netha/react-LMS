import React, { useEffect, useState } from "react";
import axios from "axios";

function Students() {
  const [students, setStudents] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || !user._id) return;

    axios
      .get(`http://localhost:5000/api/enrollments/byTeacher/${user._id}`)
      .then((res) => {
        const formatted = res.data.map((enr, index) => ({
          id: index + 1,
          name: enr.student?.name || "Unknown",
          course: enr.course?.title || "Unknown",
          progress: `${enr.chaptersUnlocked || 0} / ${enr.course?.chapters?.length || 0}`,
          quizzes: "-", // Placeholder if quiz data is not available
        }));
        setStudents(formatted);
      })
      .catch((err) => {
        console.error("Failed to fetch enrolled students", err);
      });
  }, [user]);

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Enrolled Students</h2>
      {students.length === 0 ? (
        <div className="alert alert-info">No students enrolled yet.</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Course</th>
              <th>Progress</th>
              <th>Quizzes</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.course}</td>
                <td>{s.progress}</td>
                <td>{s.quizzes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Students;
