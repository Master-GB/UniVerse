import React from "react";
import GSimage from "./getstartedimage.png";

const styles = {
    outer: {
        background: "#0b2b56", // dark blue
        color: "#ffffff",
        padding: "64px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        boxSizing: "border-box",
    },
    inner: {
        display: "flex",
        gap: "48px",
        width: "100%",
        maxWidth: "1100px",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
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
        // aspectRatio: "1 / 1",
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
            <div style={styles.inner}>
                <div style={styles.left}>
                    <h1 id="getstarted-heading" style={styles.title}>
                        Academic and Career Support
                    </h1>
                    <p style={styles.desc}>
                        Empower your academic and professional journey with our comprehensive tools and
                        resources
                    </p>
                    <a
                        href="#"
                        style={hover ? { ...styles.cta, ...styles.ctaHover } : styles.cta}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        aria-label="Get started"
                    >
                        Get started
                    </a>
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