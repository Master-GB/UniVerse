import React from "react";
import Navbar from "../Navbargreet_jcj/Navbar_jcj";
import Footer from "../LandingPage_jcj/Footer_jcj/Footer_jcj";
import SPhero from "./SupportPageHero_jcj/SPHero_jcj";
import SP_content_jcj from "./SP_content/SP_content_jcj";

import "./supportPage_jcj.css";

function SupportPage_jcj() {
  return (
    <div>
      <div className="support-page-navabar-bgcolor">
        <Navbar />
      </div>

      {/* Hero section */}
      <SPhero />

      {/* Support page content */}
      <SP_content_jcj />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default SupportPage_jcj;
