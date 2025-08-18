// import logo from './logo.svg';
import "./App.css";
import { Route, Routes } from "react-router-dom";
import React from "react";

import LandingPage from "./components_jcj/LandingPage_jcj/LandingPage_jcj";

const StudentLayout = () => (
  <div className="App">
    <React.Fragment>
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
