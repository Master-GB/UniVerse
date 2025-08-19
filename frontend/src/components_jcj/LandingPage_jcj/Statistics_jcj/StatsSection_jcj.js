import React from "react";
import "./StatsSection_jcj.css";

export default function StatsSection_jcj() {
  const stats = [
    {
      number: "92%",
      text: "of users felt more confident in their career path.",
    },
    { number: "+1.5", text: "GPA average improvement for consistent users." },
    { number: "3000+", text: "students successfully mentored." },
  ];

  return (
    <div className="statsSection_jcj">
      <h2 className="statsTitle_jcj">Powerful Statistics</h2>
      <p className="statsSubtitle_jcj">"Proof in Numbers"</p>

      <div className="statsGrid_jcj">
        {stats.map((stat, index) => (
          <div className="statCard_jcj" key={index}>
            <div className="statNumber_jcj">{stat.number}</div>
            <div className="statText_jcj">{stat.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
