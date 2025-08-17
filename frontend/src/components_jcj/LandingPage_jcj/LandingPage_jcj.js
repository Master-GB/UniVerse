import React from "react";
import GetStarted from "./GetStarted_jcj/GetStarted";
import GScards from "./GetStartedCards/GScards";
import Nav from "../Navbargreet_jcj/Navbar_jcj";
import WhoAreWe from "./whoarewe/WhoAreWe_jcj";
import Footer from "./Footer_jcj/Footer_jcj";
import "./landingpage_jcj.css";

export default function LandingPage_jcj() {
  return (
    <div>
      {/* This file combines all components into one landing page, you change the layout here */}

      <Nav />
      <GetStarted />
      <GScards />
      <WhoAreWe />
      <Footer />
    </div>
  );
}
