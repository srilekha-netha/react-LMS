import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function StudentCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios.get(`http://localhost:5000/api/enrollments/byUser/${user._id}`)
      .then(res => setCourses(res.data))
      .catch(() => setCourses([]));
  }, []);

  return (
    <div>
      <h2>My Courses</h2>
      <ul>
        {courses.map((enroll) => (
          <li key={enroll.course._id}>
            <Link to={`/student/coursedetails?id=${enroll.course._id}`}>{enroll.course.title}</Link>
            <span> - Progress: {enroll.progress}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default StudentCourses;
