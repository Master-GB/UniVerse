import "./App.css";
import { Route, Routes } from "react-router-dom";
import React from "react";

import StuNavigation from "./components_stu/stu_header/stu_header";
import StuFooter from "./components_stu/stu_footer/stu_footer";
import StuDashboard from "./components_stu/stu_dashboard/stu_dashboard";
import StuGuidance from "./components_stu/stu_guidance/stu_guidance";
import StuResources from "./components_stu/stu_resources/stu_resources";
import StuSession from "./components_stu/stu_session/stu_session";
import StuArticales from "./components_stu/stu_articale/stu_articales";
import StuFullArticle from "./components_stu/stu_articale/stu_fullArticle";

import LandingPage from "./components_jcj/LandingPage_jcj/LandingPage_jcj";
import AboutUs_jcj from "./components_jcj/Aboutus_jcj/AboutUs_jcj";
import SupportPage_jcj from "./components_jcj/SupportPage_jcj/SupportPage_jcj";
import Courses_jcj from "./components_jcj/Courses_jcj/Courses_jcj";
import LoginPageJCJ from "./components_jcj/LoginPage_jcj/LoginPageJCJ";

import MentorDashboard from "./mentor-components/mentor-dashboard/MentorDashboard";
import MentorSessionCreate from "./mentor-components/mentor-session-create/MentorSessionCreate";
import MentorshipAnnouncementForm from "./mentor-components/mentor-announcement/MentorAnnouncement";
import MentorGuidance from "./mentor-components/mentor-guidance/MentorGuidance";

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
        <Route path="/student/articales" element={<StuArticales />} />
        <Route path="/student/articales/:id" element={<StuFullArticle />} />
      </Routes>
    </main>
    <StuFooter />
  </div>
);

const MentorLayout = () => (
  <div className="App">
    <React.Fragment>
      <Routes>
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route
          path="/mentor-session-create"
          element={<MentorSessionCreate />}
        />
        <Route path="/mentor-guidance" element={<MentorGuidance />} />
        <Route
          path="/mentor-announcement"
          element={<MentorshipAnnouncementForm />}
        />
      </Routes>
    </React.Fragment>
  </div>
);

// jcj
const LandingPageLayout = () => (
  <div className="App">
    <React.Fragment>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="about" element={<AboutUs_jcj />} />
        <Route path="support" element={<SupportPage_jcj />} />
        <Route path="courses_jcj" element={<Courses_jcj />} />
        <Route path="login" element={<LoginPageJCJ />} />
      </Routes>
    </React.Fragment>
  </div>
);

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/*" element={<LandingPageLayout />} />
        <Route path="/*" element={<StudentLayout />} />
        <Route path="/0*" element={<MentorLayout />} />
      </Routes>
    </div>
  );
}

export default App;
