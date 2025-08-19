import React from "react";
import "./StudentCard_jcj.css";
import GSimage from "./studentjcj.png";

export default function StudentCard_jcj() {
  return (
    <div className="studentCard_jcj">
      <div className="studentCard_imgWrapper_jcj">
        <img src={GSimage} alt="Student" className="studentCard_img_jcj" />
      </div>
      <div className="studentCard_content_jcj">
        <p className="studentCard_quote_jcj">
          “Balancing coursework and career preparation felt impossible. This
          platform was the single place that finally helped me bridge that gap,
          turning my academic achievements into a compelling professional
          profile..”
        </p>
        <h4 className="studentCard_name_jcj">Shari Braun</h4>
        <p className="studentCard_degree_jcj">Bachelor of Science 2023</p>
        <a href="#" className="studentCard_link_jcj">
          Learn more about Sharis AU experience
        </a>
      </div>
    </div>
  );
}
