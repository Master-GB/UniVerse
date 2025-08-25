// import logo from './logo.svg';
import "./App.css";
import { Route, Routes } from "react-router-dom";
import React from "react";

import LandingPage from "./components_jcj/LandingPage_jcj/LandingPage_jcj";
import StuCourses from "./components/stu_/stu_courses";
import AllCourses from "./components/stu_/stu_AllCourses";
import CourseDetails from "./components/stu_/stu_CourseDetails";


const StudentLayout = () => (
  <div className="App">
    <React.Fragment>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<StuCourses />} />
        <Route path="/all-courses" element={<AllCourses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
      </Routes>
    </React.Fragment>
  </div>
);




function App() {
  return (
    <Routes>
      <Route path="/*" element={<StudentLayout />} />
      
    </Routes>
  );
}

export default App;
