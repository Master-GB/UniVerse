import "./App.css";
import { Route, Routes } from "react-router-dom";
import React from "react";

import StuNavigation from "./components_stu/stu_header/stu_header";
import StuFooter from "./components_stu/stu_footer/stu_footer";
import StuDashboard from "./components_stu/stu_dashboard/stu_dashboard";
import StuGuidance from "./components_stu/stu_guidance/stu_guidance";
import StuResources from "./components_stu/stu_resources/stu_resources";
import StuSession from "./components_stu/stu_session/stu_session";
import LandingPage from "./components_jcj/LandingPage_jcj/LandingPage_jcj";
import MentorDashboard  from "./mentor-components/mentor-dashboard/MentorDashboard";
import MentorSessionCreate from "./mentor-components/mentor-session-create/MentorSessionCreate";

const StudentLayout = () => (
  <div className="app-layout">
    <StuNavigation />
    <main className="main-content">
      <Routes>
        <Route path="/" element={<StuDashboard />} />
        <Route path="/student/dashboard" element={<StuDashboard />} />
        <Route path="/student/guidance" element={<StuGuidance />} />
        <Route path="/student/resources" element={<StuResources />} />
        <Route path="/student/session" element={<StuSession />} />
      </Routes>
    </main>
    <StuFooter />
  </div>
);

const MentorLayout = () => (
  <div className="App">
    <React.Fragment>
      <Routes></Routes>
    </React.Fragment>
  </div>
);

const HomeLayout = () => (
  <div className="App">
    <React.Fragment>
      <Routes>
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route path="/mentor-session-create" element={<MentorSessionCreate />} />
      </Routes>
    </React.Fragment>
  </div>
);

function App() {
  return (
    <div className="app-container">
      <Routes>
         <Route path="/*" element={<StudentLayout />} />
         <Route path="/hj*" element={<HomeLayout />} />
         <Route path="/jj*" element={<MentorLayout />} />
      </Routes>
    </div>
  );
}

export default App;
