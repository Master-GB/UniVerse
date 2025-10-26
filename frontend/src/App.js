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
import StuResume from "./components_stu/stu_resume/StuResume";
import StuCourses from "./components_stu/stu_course/stu_courses/stu_courses";
import Stu_AllCourses from "./components_stu/stu_course/stu_AllCourses/stu_AllCourses";
import Stu_CourseDetails from "./components_stu/stu_course/stu_CourseDetails/stu_CourseDetails";
import Stu_CourseContent from "./components_stu/stu_course/stu_CourseContent/stu_CourseContent";
import Stu_CourseQuiz from "./components_stu/stu_course/stu_CourseQuiz/stu_CourseQuiz";
import StudentInterviewQuiz from "./components_jcj/QuizInterview_jcj/QuizInterview";
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
import InterviewStu from "./components_jcj/Interview_jcj/interviewDashboard/InterviewStu_jcj";
import ScheduleInterview from "./components_jcj/Interview_jcj/ScheduleInterview/ScheduleInterview";

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
      <Routes>
        <Route path="/" element={<StuDashboard />} />
        <Route path="/student/dashboard" element={<StuDashboard />} />
        <Route path="/student/guidance" element={<StuGuidance />} />
        <Route path="/student/academic-resources" element={<StuResources />} />
        <Route path="/student/academic-session" element={<StuSession />} />
        <Route path="/student/career-session" element={<StuCareerSession />} />
        <Route path="/student/articales" element={<StuArticales />} />
        <Route path="/student/articales/:id" element={<StuFullArticle />} />
        <Route path="/student/resume/" element={<StuResume />} />
        <Route path="/student/courses" element={<StuCourses />} />
        <Route path="/all-courses" element={<Stu_AllCourses />} />
        <Route path="/courses/:id" element={<Stu_CourseDetails />} />
        <Route path="/courses/:id/content" element={<Stu_CourseContent />} />
        <Route path="/courses/:id/quiz" element={<Stu_CourseQuiz />} />

        <Route path="/student/interview_quiz" element={<StudentInterviewQuiz />} />
        <Route path="/student/career-resources" element={<CareerResourceHub />} />
        <Route path="/student/exam-support" element={<ExamPrepOverview />} />
        <Route path="/student/exam/strategies" element={<ExamStrategies />} />
        <Route path="/student/exam/past-papers" element={<StuExamPastPaper/>} />
        <Route path="/student/exam/practice-tests" element={<PracticeTestsOverview/>} />
        <Route path="/student/exam/practice-tests/quiz/:quizId" element={<StuExamQuiz/>} />
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
         <Route path="/mentor-career-resourcehub" element={<MentorCareerResourcehub />} />
         <Route path="/mentor-add-passpaper" element={<MentorPasspaper />} />
         <Route path="/mentor-add-quiz" element={<MentorQuizAdd />} />

      </Routes>
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
          <Route path="about" element={<AboutUs_jcj />} />
          <Route path="support" element={<SupportPage_jcj />} />
          <Route path="courses_jcj" element={<Courses_jcj />} />
          <Route path="login" element={<LoginPageJCJ />} />
          <Route path="signup" element={<SignUp />} />
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
      <React.Fragment>
        <Routes>
          <Route path="/*" element={<MIPage />} />
          <Route path="mockinterview" element={<MIDash />} />
          <Route path="interview" element={<InterviewStu />} />
          <Route path="schedule" element={<ScheduleInterview />} />
        </Routes>
      </React.Fragment>
    </div>
    <StuFooter />
  </div>
);

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/*" element={<LandingPageLayout />} />
        <Route path="/s*" element={<StudentLayout />} />
        <Route path="/m*" element={<MentorLayout />} />
        <Route path="/MIPage*" element={<MIPageLayout />} />
      </Routes>
    </div>
  );
}

export default App;