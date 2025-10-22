import React from "react";
import { Link } from "react-router-dom";
import "./milpcontent_jcj.css";

function MILP_Content_jcj() {
  return (
    <div className="milp-hero-container-jcj">
      {/* Background Video */}
      <video
        className="milp-background-video-jcj"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="https://cdn.pixabay.com/video/2021/03/31/69623-531621064_small.mp4"
          type="video/mp4"
        />
      </video>

      {/* Gradient Overlay */}
      <div className="milp-bg-gradient-dark-jcj"></div>

      {/* Content Container */}
      <div className="milp-hero-content-jcj">
        <div className="milp-content-wrapper-jcj">
          <h1 className="milp-hero-title-jcj">
            Your Interview Performance Center
          </h1>

          <p className="milp-hero-description-jcj">
            Build and sustain high-performing interview skills keeping your
            career prepared against real world challenges.
          </p>

          <div className="milp-button-group-jcj">
            <Link to="/MIPage/mockinterview">
              <button className="milp-btn-primary-jcj">Start Practice</button>
            </Link>
            <Link to="/MIPage/interview">
              <button className="milp-btn-secondary-jcj">Get a demo</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MILP_Content_jcj;
