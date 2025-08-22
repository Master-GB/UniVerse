import React from "react";
import "./aboutUs_jcj.css";
import Navbar_jcj from "../Navbargreet_jcj/Navbar_jcj";
import Footer_jcj from "../LandingPage_jcj/Footer_jcj/Footer_jcj";

const AboutUs_jcj = () => {
  return (
    <div className="aboutus-container-jcj">
      {/* Navbar */}
      <Navbar_jcj />

      {/* Header */}
      <h1 className="aboutus-title-jcj">About AU</h1>
      <p className="aboutus-intro-jcj">
        Welcome to Athabasca University, Canada’s Open University. We are
        committed to removing barriers in university-level education and
        increasing opportunities for adult learners worldwide.
      </p>
      <p className="aboutus-intro-jcj">
        We help thousands of students accomplish their goals every year. Click
        below to get to know us better.
      </p>

      {/* Hero Section */}
      <div className="aboutus-hero-jcj fade-in-up-jcj">
        <div className="aboutus-hero-text-jcj">
          <h2>AU is an innovator—a disruptor—among universities</h2>
          <p>
            From our home campus in Athabasca, Alberta, AU transforms the lives
            of learners and their communities, one person at a time through
            teaching, research, and impact—in ways no other Canadian university
            does or can.
          </p>
          <a href="#" className="aboutus-btn-jcj">
            Strategic plan →
          </a>
        </div>
        <div className="aboutus-hero-img-jcj">
          <img
            src="https://images.pexels.com/photos/2943603/pexels-photo-2943603.jpeg"
            alt="AU campus"
          />
        </div>
      </div>

      {/* Cards Section */}
      <div className="aboutus-cards-jcj">
        {[
          {
            title: "At a glance",
            desc: "As a leader in open, online education, Athabasca University offers over 850 courses in various disciplines, so students of all ages and backgrounds can pursue their academic goals from anywhere in the world.",
            link: "Learn more about AU →",
          },
          {
            title: "Senior leadership team",
            desc: "Meet the minds shaping Athabasca University’s future. Our senior leadership team is dedicated to advancing online education and empowering learners.",
            link: "Meet the team →",
          },
          {
            title: "Governance",
            desc: "At AU, the Board of Governors is the senior governing body but shares academic governance with the General Faculties Council, the academic governing body.",
            link: "Explore our governance structure →",
          },
          {
            title: "History",
            desc: "Athabasca University was established on June 25, 1970, and is now one of the world’s fastest-growing online institutions, serving over 35,000 students.",
            link: "See our history →",
          },
          {
            title: "Coat of arms",
            desc: "Discover the symbolism behind Athabasca University’s Coat of Arms, granted in 2011, and the animal, flora, and fauna symbols that best represent AU.",
            link: "Learn more →",
          },
          {
            title: "Administrative offices",
            desc: "Whether you’re seeking assistance from a specific department or trying to connect with our administrative staff, we have a comprehensive list with all the information you need.",
            link: "See the list →",
          },
        ].map((card, idx) => (
          <div key={idx} className="aboutus-card-jcj fade-in-up-jcj">
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            <a href="#">{card.link}</a>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Footer_jcj />
    </div>
  );
};

export default AboutUs_jcj;
