import React from "react";
import "./milanding_jcj.css";
import MILP_Content_jcj from "./MI_LP_content_jcj/MILP_Content_jcj";
import LogoLoop from "./MI_LogoLoop/LogoLoop";

function MI_LandingPage_jcj() {
  return (
    <div className="black-bg-jcj">
      {/* This is the main welcoming page of the mock interview module, this page is built by combining other components */}
      <MILP_Content_jcj />
      <LogoLoop />
    </div>
  );
}

export default MI_LandingPage_jcj;
