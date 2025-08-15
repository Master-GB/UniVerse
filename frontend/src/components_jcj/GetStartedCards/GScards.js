import React from 'react'
import './gsCards.css' // Assuming you have a CSS file for styling

export default function GScards() {
  return (
    <div className="gs-cards-root">
        {/* card 1 */}
        <div className="gs-cards__container">
            <div className="gs-cards__box">
                <span className="gs-cards__title">Academic and exam prep</span>
                <div>
                <strong>JOE WATSON SBF</strong>
                <p>0000 000 000 0000</p>
                <span>VALID</span> <span>01/28</span>
                </div>
            </div>
        </div>
    </div>
  )
}
