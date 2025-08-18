import React from "react";
import GetStarted from "./GetStarted_jcj/GetStarted";
import GScards from "./GetStartedCards/GScards";
import Nav from "../Navbargreet_jcj/Navbar_jcj";
import WhoAreWe from "./whoarewe/WhoAreWe_jcj";
import Footer from "./Footer_jcj/Footer_jcj";
import "./landingpage_jcj.css";

export default function LandingPage_jcj() {
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    // Parallax factor < 1 means background moves slower than page content.
    // If CSS has fixed background-attachment we should not move it from JS.
    const prefersFixed = true; // we changed CSS to use background-attachment: fixed
    const parallaxFactor = prefersFixed ? 0 : 0.5;
    let latestScrollY = 0;
    let ticking = false;

    function onScroll() {
      latestScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current && parallaxFactor !== 0) {
            const y = Math.round(latestScrollY * parallaxFactor);
            sectionRef.current.style.backgroundPosition = `center ${-y}px`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      {/* This file combines all components into one landing page, you change the layout here */}

      <div className="section-1-landingpage" ref={sectionRef}>
        <Nav />
        <GetStarted />
        <GScards />
      </div>

      <div className="wrw-section-bg">
        <WhoAreWe />
      </div>

      <Footer />
    </div>
  );
}
