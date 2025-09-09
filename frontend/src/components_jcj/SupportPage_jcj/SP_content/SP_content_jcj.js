import React, { useState, useEffect } from "react";
import "./sp_content.css";

const SP_content_jcj = () => {
  const [visibleSections, setVisibleSections] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".support-card-jcj");
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setVisibleSections((prev) => {
            if (!prev.includes(index)) {
              return [...prev, index];
            }
            return prev;
          });
        }
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const supportServices = [
    {
      id: 1,
      icon: "📚",
      title: "Academic support",
      description:
        "Excel in online and distance learning with the help of AU tutors and academic experts. They provide guidance and advice to overcome challenges and succeed in your studies.",
      buttonText: "Explore our academic support options",
      image:
        "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&h=400&fit=crop",
      imageAlt: "Student studying with headphones",
    },
    {
      id: 2,
      icon: "🧠",
      title: "Mental health and wellness",
      description:
        "Take the first step to prioritizing your well-being. Explore a wide range of options to discover the wellness resources that best suit your needs.",
      buttonText: "Access mental health and wellness support",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop",
      imageAlt: "Person relaxing with coffee",
      reverse: true,
    },
    {
      id: 3,
      icon: "♿",
      title: "Accessibility services",
      description:
        "We strive to reduce barriers in your educational journey. Discover our accessibility services, including assistive technology, advocacy, and personalized exam accommodations.",
      buttonText: "Learn more about AU accessibility support",
      image:
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&h=400&fit=crop",
      imageAlt: "Hands using braille reader",
    },
    {
      id: 4,
      icon: "🪶",
      title: "Indigenous student support",
      description:
        "At Nukskahtowin (Meeting Place), we are committed to providing student support rooted in Indigenous knowledge. Join us in a welcoming environment honouring Indigenous wisdom that fosters respect, responsiveness, reflection, and reciprocity.",
      buttonText: "Discover how we support Indigenous students' experience",
      image:
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop",
      imageAlt: "Indigenous family smiling together",
      reverse: true,
    },
  ];

  return (
    <div className="academic-support-container-jcj">
      <div className="header-section-jcj">
        <h1 className="main-title-jcj">Student Support Services</h1>
        <p className="main-subtitle-jcj">
          Empowering your academic journey and preparing you for corporate
          success
        </p>
      </div>

      <div className="support-cards-wrapper-jcj">
        {supportServices.map((service, index) => (
          <div
            key={service.id}
            className={`support-card-jcj ${
              service.reverse ? "reverse-jcj" : ""
            } ${visibleSections.includes(index) ? "visible-jcj" : ""}`}
          >
            <div className="card-content-jcj">
              <div className="icon-wrapper-jcj">
                <span className="service-icon-jcj">{service.icon}</span>
              </div>
              <h2 className="card-title-jcj">{service.title}</h2>
              <p className="card-description-jcj">{service.description}</p>
              <button className="cta-button-jcj">
                <span className="button-icon-jcj">→</span>
                <span className="button-text-jcj">{service.buttonText}</span>
              </button>
            </div>
            <div className="card-image-wrapper-jcj">
              <img
                src={service.image}
                alt={service.imageAlt}
                className="card-image-jcj"
              />
              {index === 1 && (
                <div className="back-to-top-jcj">
                  <button
                    className="back-to-top-button-jcj"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    ↑ Back to Top
                  </button>
                </div>
              )}
              {index === 0 && (
                <div className="ask-au-bubble-jcj">
                  <span>Ask AU</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="footer-section-jcj">
        <p className="footer-text-jcj">
          Your success is our priority. We're here to support you every step of
          the way.
        </p>
      </div>
    </div>
  );
};

export default SP_content_jcj;
