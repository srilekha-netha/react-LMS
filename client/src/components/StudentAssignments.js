import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios.get(`http://localhost:5000/api/assignments/byUser/${user._id}`)
      .then(res => setAssignments(res.data));
  }, [msg]);

  const handleSelect = (a) => {
    setSelected(a);
    setMsg("");
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!file) return setMsg("Choose a file!");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("student", selected.student);
    formData.append("course", selected.course._id);
    formData.append("chapter", selected.chapter);

    await axios.post("http://localhost:5000/api/assignments/submit", formData);
    setMsg("Assignment submitted!");
    setFile(null);
  };

  return (
    <div>
      <h2>Assignments</h2>
      <ul>
        {assignments.map((a, idx) => (
          <li key={a._id || idx} style={{ margin: 6 }}>
            {a.course.title} - Chapter {a.chapter} - {a.status}
            {a.status !== "Graded" && (
              <button style={{ marginLeft: 6 }} onClick={() => handleSelect(a)}>Submit/Resubmit</button>
            )}
            {a.status === "Graded" && <span> | Grade: {a.grade}</span>}
            {a.fileUrl && <a href={a.fileUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 6 }}>View File</a>}
          </li>
        ))}
      </ul>
      {selected &&
        <div>
          <h5>Submit Assignment for {selected.course.title}, Chapter {selected.chapter}</h5>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleSubmit}>Upload</button>
          <button onClick={() => setSelected(null)} style={{ marginLeft: 8 }}>Cancel</button>
          <p>{msg}</p>
        </div>
      }
    </div>
  );
}
export default StudentAssignments;
