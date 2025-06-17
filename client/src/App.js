// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";

import TeacherLayout from "./components/TeacherLayout";
import MyCourses from "./components/MyCourses";
import CreateCourse from "./components/CreateCourse";
import Assignments from "./components/Assignments";
import Students from "./components/Students";
import Messages from "./components/Messages";
import Profile from "./components/Profile";
import StudentDashboard from "./components/StudentDashboard";

import Earnings from "./components/Earnings";          // ✅ Fixed path
import Notifications from "./components/Notifications"; // ✅ Fixed path
import Logout from "./components/Logout";              // ✅ Fixed path
// ✅ Student-specific routes
import ExploreCourses from "./components/ExploreCourses";
import StudentCourses from "./components/StudentCourses";
import CourseDetails from "./components/CourseDetails";
import ProgressTracker from "./components/ProgressTracker";
import StudentAssignments from "./components/StudentAssignments";
import Quizzes from "./components/Quizzes";
import PaymentHistory from "./components/PaymentHistory";
import StudentMessages from "./components/StudentMessages";
import StudentProfile from "./components/StudentProfile";
import StudentNotifications from "./components/StudentNotifications";

// Admin Layout & Features
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./components/AdminDashboard";
import UserManagement from "./components/UserManagement";
import CourseManagement from "./components/CourseManagement";
import PaymentManagement from "./components/PaymentManagement";
import Reports from "./components/Reports";
import Coupons from "./components/Coupons";
import Settings from "./components/Settings";
import Logs from "./components/Logs";
import AdminProfile from "./components/AdminProfile";





function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/student" element={<StudentDashboard />}>
          <Route index element={<ExploreCourses />} />
          <Route path="explore" element={<ExploreCourses />} />
          <Route path="my-courses" element={<StudentCourses />} />
          <Route path="coursedetails" element={<CourseDetails />} />
          <Route path="progress" element={<ProgressTracker />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="messages" element={<StudentMessages />} />
          <Route path="payments" element={<PaymentHistory />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="logout" element={<Logout />} />
        </Route>
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="payments" element={<PaymentManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="settings" element={<Settings />} />
          <Route path="logs" element={<Logs />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="logout" element={<Logout />} />
        </Route>

        {/* Nested routes under /teacher */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route path="courses" element={<MyCourses />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="students" element={<Students />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
