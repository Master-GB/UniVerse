import React from "react";
import "./milanding_jcj.css";
import MILP_Content_jcj from "./MI_LP_content_jcj/MILP_Content_jcj";
import LogoLoop from "../MI_LandingPage_jcj/LogoLoop/LogoLoop";

import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si";

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  {
    node: <SiTypescript />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiTailwindcss />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
];

function MI_LandingPage_jcj() {
  return (
    <div className="black-bg-jcj">
      {/* This is the main welcoming page of the mock interview module, this page is built by combining other components */}
      <MILP_Content_jcj />

      <div
        style={{ height: "200px", position: "relative", overflow: "hidden" }}
      >
        <LogoLoop
          logos={techLogos}
          speed={120}
          direction="left"
          logoHeight={70}
          gap={40}
          pauseOnHover
          scaleOnHover
          fadeOut
          // bg color behind this component is in milanding_jcj.css .black-bg-jcj
          fadeOutColor="#01012b"
          ariaLabel="Technology partners"
        />
      </div>
    </div>
  );
}

export default MI_LandingPage_jcj;
