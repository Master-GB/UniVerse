import React, { useState } from "react";
import "./loginPage_jcj.css";

function LoginPageJCJ() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", formData);
    // Add your login logic here
  };

  return (
    <div className="login-container-jcj">
      <div className="login-wrapper-jcj">
        {/* Left side with background image */}
        <div className="login-left-side-jcj">
          <div className="login-overlay-jcj">
            <div className="login-logo-jcj">
              <div className="logo-circles-jcj">
                <div className="logo-circle-1-jcj"></div>
                <div className="logo-circle-2-jcj"></div>
              </div>
              <span className="logo-text-jcj">LOGO</span>
            </div>
            <h1 className="welcome-title-jcj">Welcome Page</h1>
            <p className="welcome-subtitle-jcj">
              Sign in to
              <br />
              continue access
            </p>
            <div className="website-url-jcj">www.yoursite.com</div>
          </div>
        </div>

        {/* Right side with login form */}
        <div className="login-right-side-jcj">
          <div className="login-form-container-jcj">
            <h2 className="login-title-jcj">Sign In</h2>

            <form onSubmit={handleSubmit} className="login-form-jcj">
              <div className="input-group-jcj">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="login-input-jcj"
                  required
                />
              </div>

              <div className="input-group-jcj">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="login-input-jcj"
                  required
                />
              </div>

              <button type="submit" className="continue-btn-jcj">
                CONTINUE
                <span className="btn-arrow-jcj">→</span>
              </button>
            </form>

            <div className="social-divider-jcj">
              <span className="divider-text-jcj">
                or Connect with Social Media
              </span>
            </div>

            <div className="social-buttons-jcj">
              <button className="social-btn-jcj twitter-btn-jcj">
                <span className="social-icon-jcj">🐦</span>
                Sign In With Twitter
              </button>

              <button className="social-btn-jcj facebook-btn-jcj">
                <span className="social-icon-jcj">f</span>
                Sign In With Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPageJCJ;
