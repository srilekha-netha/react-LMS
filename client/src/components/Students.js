import React, { useEffect, useState } from "react";

function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Dummy data – Replace with actual API call later
    const dummyStudents = [
      {
        id: 1,
        name: "Ananya Sharma",
        course: "React Essentials",
        progress: "80%",
        quizzes: "4/5",
      },
      {
        id: 2,
        name: "Kiran Reddy",
        course: "JavaScript Basics",
        progress: "100%",
        quizzes: "5/5",
      },
    ];
    setStudents(dummyStudents);
  }, []);

  const sendMessage = (name) => {
    alert(`Message sent to ${name} (simulated)`);
  };

  return (
    <div>
      <h2>Enrolled Students</h2>
      {students.length === 0 ? (
        <p>No students enrolled yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Progress</th>
              <th>Quizzes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.course}</td>
                <td>{s.progress}</td>
                <td>{s.quizzes}</td>
                <td>
                  <button onClick={() => sendMessage(s.name)}>Send Feedback</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Students;
