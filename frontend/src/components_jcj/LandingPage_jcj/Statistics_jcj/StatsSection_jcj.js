import React, { useEffect, useRef, useState } from "react";
import "./StatsSection_jcj.css";

export default function StatsSection_jcj() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    {
      number: "92%",
      text: "of users felt more confident in their career path.",
    },
    { number: "+1.5", text: "GPA average improvement for consistent users." },
    { number: "3000+", text: "students successfully mentored." },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // trigger only once
        }
      },
      { threshold: 0.2 } // 20% visible before triggering
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
    <div
      className={`statsSection_jcj ${isVisible ? "visible_jcj" : ""}`}
      ref={sectionRef}
    >
      <h2 className="statsTitle_jcj">Powerful Statistics</h2>
      <p className="statsSubtitle_jcj">"Proof in Numbers"</p>

      <div className="statsGrid_jcj">
        {stats.map((stat, index) => (
          <div
            className={`statCard_jcj ${isVisible ? "show_jcj" : ""}`}
            key={index}
            style={{ transitionDelay: `${index * 0.3}s` }}
          >
            <div className="statNumber_jcj">{stat.number}</div>
            <div className="statText_jcj">{stat.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
