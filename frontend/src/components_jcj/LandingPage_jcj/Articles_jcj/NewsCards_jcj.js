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
      title: "Community Events",
      desc: "Join upcoming developer meetups and tech events near you.",
      link: "#",
      img: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg",
    },
    {
      title: "Community Events",
      desc: "Join upcoming developer meetups and tech events near you.",
      link: "#",
      img: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg",
    },
  ];

  return (
    <div className="news-wrapper-jcj">
      {cards.map((card, index) => (
        <div key={index} className="card-news-jcj">
          <div
            className="image-news-jcj"
            style={{ backgroundImage: `url(${card.img})` }}
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
  );
};

export default NewsCardsJCJ;
