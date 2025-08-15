import React from "react";
import "./gsCards.css"; // Assuming you have a CSS file for styling
import GSusericon from "./icons_gs/add-user.png"; // Example icon import

export default function GScards() {
  return (
    <div className="gs-cards-spacing">
      <div className="gs-cards-root">
        {/* card 1 */}
        <div className="gs-cards__container">
          <div className="gs-cards__box">
            {/* Replace with actual image or illustration */}
            <div className="gs-cards__media">
              <img src={GSusericon} alt="Resource Hub" />
            </div>

            <div className="gs-cards__footer">
              <span className="gs-cards__title">Resource Hub</span>
            </div>
          </div>
        </div>
      </div>

      <div className="gs-cards-root">
        {/* card 2 */}
        <div className="gs-cards__container">
          <div className="gs-cards__box">
            <div className="gs-cards__media">Image/illustration</div>
            <div className="gs-cards__footer">
              <span className="gs-cards__title">Career Guidance</span>
            </div>
          </div>
        </div>
      </div>

      <div className="gs-cards-root">
        {/* card 3 */}
        <div className="gs-cards__container">
          <div className="gs-cards__box">
            <div className="gs-cards__media">Image/illustration</div>
            <div className="gs-cards__footer">
              <span className="gs-cards__title">
                Academic and exam preparation
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="gs-cards-root">
        {/* card 4 */}
        <div className="gs-cards__container">
          <div className="gs-cards__box">
            <div className="gs-cards__media">Image/illustration</div>
            <div className="gs-cards__footer">
              <span className="gs-cards__title">Skill development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
