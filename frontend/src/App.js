// import logo from './logo.svg';
import "./App.css";
import { Route, Routes } from "react-router-dom";
import React from "react";

import StuCourses from "./components/stu_/course/stu_courses/stu_courses";
import AllCourses from "./components/stu_/course/stu_AllCourses/stu_AllCourses";
import CourseDetails from "./components/stu_/course/stu_CourseDetails/stu_CourseDetails";
import ManageCourses from "./components/stu_/course/stu_ManageCourses/stu_ManageCourses";
import CourseContent from "./components/stu_/course/stu_CourseContent/stu_CourseContent";
import CourseQuiz from "./components/stu_/course/stu_CourseQuiz/stu_CourseQuiz";
import AddQuestions from "./components/stu_/course/stu_AddQuestions/stu_AddQuestions";
import MentorInterviewQuiz from "./components/stu_/interview/MentorInterviewQuiz/MentorInterviewQuiz";
import StudentInterviewQuiz from "./components/stu_/interview/StudentInterviewQuiz/StudentInterviewQuiz";


const CourceLayout = () => (
  <div className="App">
    <React.Fragment>
      <Routes>
        <Route path="/" element={<StuCourses />} />
        <Route path="/courses" element={<StuCourses />} />
        <Route path="/all-courses" element={<AllCourses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/manage-courses" element={<ManageCourses />} />
        <Route path="/courses/:id/content" element={<CourseContent />} />
        <Route path="/courses/:id/quiz" element={<CourseQuiz />} />
        <Route path="/courses/:id/add-questions" element={<AddQuestions />} />
        <Route path="/interview-quiz" element={<MentorInterviewQuiz />} />
        <Route path="/student-interview-quiz" element={<StudentInterviewQuiz />} />
        
      </Routes>
    </React.Fragment>
  </div>
);


function App() {
  return (
    <Routes>
      <Route path="/*" element={<CourceLayout />} />
      
    </Routes>
  );
}

export default App;
