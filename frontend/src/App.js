import "./App.css";
import { Route, Routes, Outlet } from "react-router-dom";
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
import StuResume from "./components_stu/stu_resume/StuResume";
import StuCourses from "./components_stu/stu_course/stu_courses/stu_courses";
import Stu_AllCourses from "./components_stu/stu_course/stu_AllCourses/stu_AllCourses";
import Stu_CourseDetails from "./components_stu/stu_course/stu_CourseDetails/stu_CourseDetails";
import Stu_CourseContent from "./components_stu/stu_course/stu_CourseContent/stu_CourseContent";
import Stu_CourseQuiz from "./components_stu/stu_course/stu_CourseQuiz/stu_CourseQuiz";
import StudentInterviewQuiz from "./components_stu/stu_interview/stu_StudentInterviewQuiz/stu_StudentInterviewQuiz";
import CareerResourceHub from "./components_stu/stu_trainingContent/stu_trainingContent";
import ExamPrepOverview from "./components_stu/stu_examPrep/stu_examPrepOverview/stu_examPrepOverview";
import ExamStrategies from "./components_stu/stu_examPrep/stu_examStrategies/stu_examStrategies";
import StuExamPastPaper from "./components_stu/stu_examPrep/stu_examPastPaper/stu_examPastPaper";
import PracticeTestsOverview from "./components_stu/stu_examPrep/stu_examQuiz/PracticeTestsOverview";
import StuExamQuiz from "./components_stu/stu_examPrep/stu_examQuiz/stu_examQuiz";


import LandingPage from "./components_jcj/LandingPage_jcj/LandingPage_jcj";
import AboutUs_jcj from "./components_jcj/Aboutus_jcj/AboutUs_jcj";
import SupportPage_jcj from "./components_jcj/SupportPage_jcj/SupportPage_jcj";
import Courses_jcj from "./components_jcj/Courses_jcj/Courses_jcj";
import LoginPageJCJ from "./components_jcj/LoginPage_jcj/LoginPageJCJ";
import MIPage from "./components_jcj/mockInterviewPage_jcj/MI_LandingPage_jcj/MI_LandingPage_jcj";
import MIDash from "./components_jcj/mockInterviewPage_jcj/MI_LandingPage_jcj/MI_Dashboard_jcj/MockInterview";
import SignUp from "./components_jcj/SignUp_jcj/SignUp";

import MentorDashboard from "./mentor-components/mentor-dashboard/MentorDashboard";
import MentorSessionCreate from "./mentor-components/mentor-session-create/MentorSessionCreate";
import MentorshipAnnouncementForm from "./mentor-components/mentor-announcement/MentorAnnouncement";
import MentorGuidance from "./mentor-components/mentor-guidance/MentorGuidance";
import MentorResourcehub from "./mentor-components/mentor-resourcehub/MentorResourcehub";
import MentorManageResourses from "./mentor-components/mentor-resourcehub/MentorResourceManage";
import MentorArticle from "./mentor-components/mentor-article/MentorArticle";
import MentorCareerSession from "./mentor-components/mentor-career-session/MentorCareerSession";
import MentorCareerResourcehub from "./mentor-components/mentot-career-resourcehub/MentorCareerResourcehub";
import MentorPasspaper from "./mentor-components/mentor-passpaper/MentorPasspaper";
import MentorQuizAdd from "./mentor-components/mentor_quiz_add/MentorQuizAdd";





const StudentLayout = () => (
  <div className="app-layout">
    <StuNavigation />
    <main className="main-content">
      <Outlet />
    </main>
    <StuFooter />
  </div>
);

const MentorLayout = () => (
  <div className="App">
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  </div>
);

// jcj
const LandingPageLayout = () => (
  <div className="App">
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="landing/about" element={<AboutUs_jcj />} />
          <Route path="landing/support" element={<SupportPage_jcj />} />
          <Route path="landing/courses_jcj" element={<Courses_jcj />} />
          <Route path="landing/login" element={<LoginPageJCJ />} />
          <Route path="landing/signup" element={<SignUp />} />
        </Routes>
      </React.Fragment>
    </div>
  </div>
);

// Mock interview page layout
const MIPageLayout = () => (
  <div className="App">
    <StuNavigation />
    <div>
      <Outlet />
    </div>
    <StuFooter />
  </div>
);

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* Public Routes */}
        <Route path="/*" element={<LandingPageLayout />} />
        
        {/* Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StuDashboard />} />
          <Route path="dashboard" element={<StuDashboard />} />
          <Route path="guidance" element={<StuGuidance />} />
          <Route path="academic-resources" element={<StuResources />} />
          <Route path="academic-session" element={<StuSession />} />
          <Route path="career-session" element={<StuCareerSession />} />
          <Route path="articales" element={<StuArticales />} />
          <Route path="articales/:id" element={<StuFullArticle />} />
          <Route path="resume" element={<StuResume />} />
          <Route path="courses" element={<StuCourses />} />
          <Route path="all-courses" element={<Stu_AllCourses />} />
          <Route path="courses/:id" element={<Stu_CourseDetails />} />
          <Route path="courses/:id/content" element={<Stu_CourseContent />} />
          <Route path="courses/:id/quiz" element={<Stu_CourseQuiz />} />
          <Route path="interview_quiz" element={<StudentInterviewQuiz />} />
          <Route path="career-resources" element={<CareerResourceHub />} />
          <Route path="exam-support" element={<ExamPrepOverview />} />
          <Route path="exam/strategies" element={<ExamStrategies />} />
          <Route path="exam/past-papers" element={<StuExamPastPaper/>} />
          <Route path="exam/practice-tests" element={<PracticeTestsOverview/>} />
          <Route path="exam/practice-tests/quiz/:quizId" element={<StuExamQuiz/>} />
        </Route>
        
        {/* Mentor Routes */}
        <Route path="/mentor" element={<MentorLayout />}>
          <Route index element={<MentorDashboard />} />
          <Route path="dashboard" element={<MentorDashboard />} />
          <Route path="session-create" element={<MentorSessionCreate />} />
          <Route path="guidance" element={<MentorGuidance />} />
          <Route path="announcement" element={<MentorshipAnnouncementForm />} />
          <Route path="resourcehub" element={<MentorResourcehub />} />
          <Route path="manage-resources" element={<MentorManageResourses />} />
          <Route path="article" element={<MentorArticle />} />
          <Route path="career-session" element={<MentorCareerSession/>} />
          <Route path="career-resourcehub" element={<MentorCareerResourcehub />} />
          <Route path="add-passpaper" element={<MentorPasspaper />} />
          <Route path="add-quiz" element={<MentorQuizAdd />} />
        </Route>
        
        {/* Mock Interview Page */}
        <Route path="/mi" element={<MIPageLayout />}>
          <Route index element={<MIPage />} />
          <Route path="landing" element={<MIPage />} />
          <Route path="mockinterview" element={<MIDash />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
