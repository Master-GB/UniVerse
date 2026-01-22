import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaCircleArrowRight } from "react-icons/fa6";
import logoimage from "../SignUp_jcj/images/logohorizontal.png";
import rightlogo from "../SignUp_jcj/images/newlogo.png";
import DecryptedText from "./DecryptedText/DecryptedText";
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
        navigate("/mentor/dashboard"); // Mentor landing path hook
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
            <img
              src={logoimage}
              alt="Logo"
              style={{ width: "100px", height: "auto" }}
            />
            <div>
              <h1 className="welcome-title-jcj-login">Log in to UniVerse</h1>
              {/* error ekak awa div ekkin cover kram fix wuna */}
              <div>
                <DecryptedText text="your gateway to academic and career success" />
              </div>
            </div>
          </div>

          <div className="website-url-jcj">www.UniVerse.com</div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="login-right-side-jcj">
        <div>
          <img
            src={rightlogo}
            alt="Right Logo"
            className="right-logo-login-jcj"
          />
        </div>

        <div className="login-form-container-jcj">
          <h2 className="login-title-jcj">Sign In</h2>

          <form onSubmit={handleSubmit} className="login-form-jcj">
            <div className="input-group-login-jcj">
              <input
                type="email"
                name="email"
                id="login-email-input-jcj"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field-login-jcj"
                autoComplete="email"
                placeholder=" "
                required
              />
              <label
                htmlFor="login-email-input-jcj"
                className="input-label-login-jcj"
              >
                Email Address
              </label>
            </div>

            <div className="input-group-login-jcj">
              <input
                type="password"
                name="password"
                id="login-password-input-jcj"
                value={formData.password}
                onChange={handleInputChange}
                className="input-field-login-jcj"
                autoComplete="current-password"
                placeholder=" "
                required
              />
              <label
                htmlFor="login-password-input-jcj"
                className="input-label-login-jcj"
              >
                Password
              </label>
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
              <span className="btn-arrow-jcj">
                <FaCircleArrowRight />
              </span>
            </button>
          </form>

          <div className="social-divider-jcj">
            <span className="divider-text-jcj">
              or Connect with Social Media
            </span>
          </div>

          <div className="social-buttons-jcj">
            <button className="social-btn-jcj google-btn-jcj">
              <FcGoogle className="social-icon-jcj" />
              Sign In With Google
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
