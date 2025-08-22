import React, { useEffect, useRef } from "react";
import "./whoarewe_jcj.css";

export default function LandingBG() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver( // create an IntersectionObserver to handle animations
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className="jcj-landing-container">
      <div className="jcj-content-section" ref={sectionRef}>
        <h2 className="jcj-section-heading">Welcome to UniVerse</h2>

        <p className="jcj-section-text">
          Your gateway to academic and career success. Explore our resources and
          tools designed to empower your journey. UniVerse is dedicated to
          providing comprehensive support for students and professionals. Our
          platform offers study materials, career guidance, and expert advice to
          help you achieve your goals.
        </p>

        <p className="jcj-section-text">
          Join our community of learners and professionals. Whether you're a
          student seeking academic excellence or a professional looking to
          advance your career, UniVerse is here to support you every step of the
          way. Explore our resources, connect with experts, and unlock your full
          potential.
        </p>
      </div>
    </div>
  );
}
