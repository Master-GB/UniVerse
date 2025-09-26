import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginPage_jcj.css";

function LoginPageJCJ() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const API_BASE_URL = (
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8070"
  ).replace(/\/$/, "");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Invalid email or password");
      }

      // Persist token + user for later authenticated requests. Adjust storage strategy with the team if needed.
      if (data?.token) {
        localStorage.setItem("universe_token", data.token);
      }
      if (data?.user) {
        localStorage.setItem("universe_user", JSON.stringify(data.user));
      }

      // Redirect by role. Update the paths below if the team changes layouts.
      const role = data?.user?.role;
      if (role === "mentor") {
        navigate("/mentor-dashboard"); // Mentor landing path hook
      } else {
        navigate("/student/dashboard"); // Default student landing path
      }
    } catch (error) {
      setErrorMessage(error.message || "Unable to sign you in right now");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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

            {errorMessage && (
              <p className="login-error-text-jcj" role="alert">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="continue-btn-jcj"
              disabled={isSubmitting}
            >
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
  );
}

export default LoginPageJCJ;
