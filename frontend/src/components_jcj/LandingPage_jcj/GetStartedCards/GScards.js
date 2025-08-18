import React from "react";
import "./gsCards.css";
import GSusericon from "./icons_gs/add-user.png"; // Example icon import
import GSresourceicon from "./icons_gs/global.png"; // Example icon import
import GScareericon from "./icons_gs/luggage.png"; // Example icon import
import bookicon from "./icons_gs/open-book.png"; // Example icon import

export default function GScards() {
  return (
    <div className="gs-cards-spacing">
      <div className="gs-cards-root">
        {/* card 1 */}
        <div className="gs-cards__container">
          <div className="gs-cards__box">
            {/* Replace with actual image or illustration */}
            <div className="gs-cards__media">
              <img src={GSresourceicon} alt="Resource Hub" />
            </div>

            <div className="gs-cards__footer">
              <span className="gs-cards__title">
                Over 1000+ resources available worldwide
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="gs-cards-root">
        {/* card 2 */}
        <div className="gs-cards__container">
          <div className="gs-cards__box">
            <div className="gs-cards__media">
              <img src={GSusericon} alt="User icon" />
            </div>
            <div className="gs-cards__footer">
              <span className="gs-cards__title">
                Expert guidance to shape your future
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="gs-cards-root">
        {/* card 3 */}
        <div className="gs-cards__container">
          <div className="gs-cards__box">
            <div className="gs-cards__media">
              <img src={bookicon} alt="exam prep" />
            </div>
            <div className="gs-cards__footer">
              <span className="gs-cards__title">
                Ace your exams with proven strategies
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="gs-cards-root">
        {/* card 4 */}
        <div className="gs-cards__container">
          <div className="gs-cards__box">
            <div className="gs-cards__media">
              <img src={GScareericon} alt="Resource Hub" />
            </div>
            <div className="gs-cards__footer">
              <span className="gs-cards__title">
                Master in-demand skills for tomorrow
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
