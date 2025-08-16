import React from "react";
import GetStarted from "../GetStarted_jcj/GetStarted";
import GScards from "../GetStartedCards/GScards";
import Nav from "../Navbargreet_jcj/Navbar_jcj";
import WhoAreWe from "./whoarewe/WhoAreWe_jcj";
import "./landingpage_jcj.css";

export default function LandingPage_jcj() {
  return (
    <div>
      <Nav />
      <GetStarted />
      <GScards />
      <WhoAreWe />
    </div>
  );
}
