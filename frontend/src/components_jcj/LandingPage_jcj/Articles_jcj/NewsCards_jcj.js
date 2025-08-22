import React from "react";
import "./NewsCards_jcj.css";

const NewsCardsJCJ = () => {
  const cards = [
    {
      title: "Find out more courses.",
      desc: "Explore our vast catalog of the world's most popular materials.",
      link: "#",
      img: "https://images.pexels.com/photos/1472841/pexels-photo-1472841.jpeg",
    },
    {
      title: "Latest Tech News",
      desc: "Stay updated with the latest trends in software engineering.",
      link: "#",
      img: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg",
    },
    {
      title: "Ace your next interview",
      desc: "Master common interview questions and practice with mock sessions to build confidence.",
      link: "#",
      img: "https://images.pexels.com/photos/5439148/pexels-photo-5439148.jpeg",
    },
    {
      title: "Build In-Demand Skills",
      desc: "Supplement your degree with courses in Python, Data Analysis, UX Design, and more..",
      link: "#",
      img: "https://images.pexels.com/photos/5921786/pexels-photo-5921786.jpeg",
    },
  ];

  return (
    <div className="news-section-jcj">
      <h2 className="news-cards-heading-jcj">Select Your Path</h2>
      <div className="news-wrapper-jcj">
        {cards.map((card, index) => (
          <div key={index} className="card-news-jcj">
            <img
              src={card.img}
              alt={card.title}
              className="image-news-jcj"
              loading="lazy"
            />
            <div className="content-news-jcj">
              <a href={card.link}>
                <span className="title-news-jcj">{card.title}</span>
              </a>
              <p className="desc-news-jcj">{card.desc}</p>
              <a className="action-news-jcj" href={card.link}>
                Find out more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsCardsJCJ;
