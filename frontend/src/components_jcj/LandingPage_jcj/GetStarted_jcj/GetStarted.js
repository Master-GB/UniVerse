import React from "react";
import "./getstarted_jcj.css"; // <-- button styles (unique)
import GSimage from "./getstartedimage.png";

const styles = {
  outer: {
    // background: "#0b2b56", // removed background color for a cleaner look
    color: "#ffffff",
    padding: "64px 24px 20px 24px",
    display: "flex",
    flexDirection: "column", // column layout for section
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  inner: {
    display: "flex",
    gap: "48px",
    width: "100%",
    maxWidth: "1152px",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: "40px", // space before cards
  },
  left: {
    flex: "1 1 420px",
    minWidth: 0,
  },
  title: {
    margin: 0,
    fontSize: "clamp(60px, 5vw, 48px)",
    lineHeight: 1.05,
    letterSpacing: "-0.02em",
    fontWeight: 700,
  },
  desc: {
    marginTop: "16px",
    marginBottom: "24px",
    color: "rgba(255,255,255,0.9)",
    fontSize: "16px",
    lineHeight: 1.5,
    maxWidth: "48rem",
  },
  cta: {
    display: "inline-block",
    padding: "12px 20px",
    borderRadius: "999px",
    border: "2px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 600,
    transition: "transform .15s ease, background .15s ease",
    textDecoration: "none",
  },
  ctaHover: {
    transform: "translateY(-2px)",
    background: "rgba(255,255,255,0.12)",
  },
  right: {
    flex: "0 0 420px",
    minWidth: "260px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255,255,255,0.25)",
    fontSize: "14px",
    userSelect: "none",
  },
};

export default function GetStarted() {
  const [hover, setHover] = React.useState(false);

  return (
    <section style={styles.outer} aria-labelledby="getstarted-heading">
      {/* Top Row: Heading + Image */}
      <div style={styles.inner}>
        <div style={styles.left}>
          <h1 id="getstarted-heading" style={styles.title}>
            Your Path to Success
          </h1>
          <p style={styles.desc}>
            Unlock your potential with tailored resources, expert guidance, and
            innovative tools built to support your academic growth and career
            success
          </p>

          {/* Replaced original anchor CTA with your Uiverse button (class names suffixed with -jcj). */}
          <button
            className="button-jcj"
            // set CSS var --clr using React style object; use bracket notation for custom property
            style={{ ["--clr"]: "#7808d0" }}
            aria-label="Get Started"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            // If you want to handle click navigation, replace preventDefault with your routing logic.
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <span className="button__icon-wrapper-jcj">
              <svg
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="button__icon-svg-jcj"
                width="10"
              >
                <path
                  d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                  fill="currentColor"
                ></path>
              </svg>

              <svg
                viewBox="0 0 14 15"
                fill="none"
                width="10"
                xmlns="http://www.w3.org/2000/svg"
                className="button__icon-svg-jcj button__icon-svg--copy-jcj"
              >
                <path
                  d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
            Get Started
          </button>
        </div>

        <div style={styles.right}>
          <div style={styles.placeholder}>
            <img
              src={GSimage}
              alt="Get Started"
              style={{ width: "100%", height: "100%", borderRadius: "12px" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
