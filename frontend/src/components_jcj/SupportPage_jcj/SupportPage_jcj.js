import React from "react";
import Navbar from "../Navbargreet_jcj/Navbar_jcj";
import Footer from "../LandingPage_jcj/Footer_jcj/Footer_jcj";
import SPhero from "./SupportPageHero_jcj/SPHero_jcj";

import "./supportPage_jcj.css";

function SupportPage_jcj() {
  return (
    <div>
      <div className="support-page-navabar-bgcolor">
        <Navbar />
      </div>

      <div className="hero-bg-image">
        <div className="support-page-hero-section-backGradient">
          <SPhero />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SupportPage_jcj;
