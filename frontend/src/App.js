// import logo from './logo.svg';
import "./App.css";
import { Route, Routes } from "react-router-dom";
import React from "react";

import LandingPage from "./components_jcj/LandingPage_jcj/LandingPage_jcj";

const StudentLayout = () => (
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
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </React.Fragment>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/jj" element={<StudentLayout />} />
      <Route path="/*" element={<HomeLayout />} />
    </Routes>
  );
}

export default App;
