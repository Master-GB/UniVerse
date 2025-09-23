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
import StuCareerSession from "./components_stu/stu_career_session/stu_career_session";
import StuCourses from "./components_stu/stu_course/stu_courses/stu_courses";

import LandingPage from "./components_jcj/LandingPage_jcj/LandingPage_jcj";
import AboutUs_jcj from "./components_jcj/Aboutus_jcj/AboutUs_jcj";
import SupportPage_jcj from "./components_jcj/SupportPage_jcj/SupportPage_jcj";
import Courses_jcj from "./components_jcj/Courses_jcj/Courses_jcj";
import LoginPageJCJ from "./components_jcj/LoginPage_jcj/LoginPageJCJ";
import MIPage from "./components_jcj/mockInterviewPage_jcj/MI_LandingPage_jcj/MI_LandingPage_jcj";
import MIDash from "./components_jcj/mockInterviewPage_jcj/MI_LandingPage_jcj/MI_Dashboard_jcj/MockInterview";

import MentorDashboard from "./mentor-components/mentor-dashboard/MentorDashboard";
import MentorSessionCreate from "./mentor-components/mentor-session-create/MentorSessionCreate";
import MentorshipAnnouncementForm from "./mentor-components/mentor-announcement/MentorAnnouncement";
import MentorGuidance from "./mentor-components/mentor-guidance/MentorGuidance";
import MentorResourcehub from "./mentor-components/mentor-resourcehub/MentorResourcehub";
import MentorManageResourses from "./mentor-components/mentor-resourcehub/MentorResourceManage";
import MentorArticle from "./mentor-components/mentor-article/MentorArticle";
import MentorCareerSession from "./mentor-components/mentor-career-session/MentorCareerSession"

const StudentLayout = () => (
  <div className="app-layout">
    <StuNavigation />
    <main className="main-content">
      <Routes>
        <Route path="/" element={<StuDashboard />} />
        <Route path="/student/dashboard" element={<StuDashboard />} />
        <Route path="/student/guidance" element={<StuGuidance />} />
        <Route path="/student/academic-resources" element={<StuResources />} />
        <Route path="/student/academic-session" element={<StuSession />} />
        <Route path="/student/career-session" element={<StuCareerSession />} />
        <Route path="/student/articales" element={<StuArticales />} />
        <Route path="/student/articales/:id" element={<StuFullArticle />} />
        <Route path="/student/courses" element={<StuCourses />} />
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
         <Route path="/mentor-session-create" element={<MentorSessionCreate />} />
         <Route path="/mentor-guidance" element={<MentorGuidance />} />
         <Route path="/mentor-announcement" element={<MentorshipAnnouncementForm />} />
         <Route path="/mentor-resourcehub" element={<MentorResourcehub />} />
         <Route path="/mentor-manage-resources" element={<MentorManageResourses />} />
         <Route path="/mentor-article" element={<MentorArticle />} />
         <Route path="/mentor-career-session" element={<MentorCareerSession/>} />
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

// Mock interview page layout
const MIPageLayout = () => (
  <div className="App">
    <React.Fragment>
      <Routes>
        <Route path="/" element={<MIPage />} />
        <Route path="milanding" element={<MIPage />} />
        <Route path="mockinterview" element={<MIDash />} />
      </Routes>
    </React.Fragment>
  </div>
);

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/l*" element={<LandingPageLayout />} />
        <Route path="/*" element={<StudentLayout />} />
        <Route path="/h*" element={<MentorLayout />} />
        <Route path="/h*" element={<MIPageLayout />} />
      </Routes>
    </div>
  );
}

export default App;
