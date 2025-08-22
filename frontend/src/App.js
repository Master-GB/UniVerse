// import logo from './logo.svg';
import "./App.css";
import { Route, Routes } from "react-router-dom";
import React from "react";

import LandingPage from "./components_jcj/LandingPage_jcj/LandingPage_jcj";
import MentorDashboard  from "./mentor-components/mentor-dashboard/MentorDashboard";
import MentorSessionCreate from "./mentor-components/mentor-session-create/MentorSessionCreate";
import MentorshipAnnouncementForm  from "./mentor-components/mentor-announcement/MentorAnnouncement";

const StudentLayout = () => (
  <div className="App">
    <React.Fragment>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </React.Fragment>
  </div>
);

const MentorLayout = () => (
  <div className="App">
    <React.Fragment>
      <Routes>
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route path="/mentor-session-create" element={<MentorSessionCreate />} />
        <Route path="/mentor-announcement" element={<MentorshipAnnouncementForm />} />
      </Routes>
    </React.Fragment>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/ji" element={<StudentLayout />} />
      <Route path="/*" element={<MentorLayout />} />
    </Routes>
  );
}

export default App;
