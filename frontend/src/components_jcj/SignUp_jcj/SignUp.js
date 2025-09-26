import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./images/logohorizontal.png";
import "./signUp.css";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const API_BASE_URL = (
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8070"
  ).replace(/\/$/, "");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.role) {
      setErrorMessage(
        "Please select whether you're registering as a student or a mentor."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter them.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          username: formData.username.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to create your account right now."
        );
      }

      setSuccessMessage(
        "Account created successfully! Redirecting you to the login page..."
      );

      // Optionally store token here if auto-login is desired: localStorage.setItem("token", data.token)
      setTimeout(() => {
        navigate("/landing/login");
      }, 1800);

      setFormData({
        name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
    } catch (error) {
      setErrorMessage(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-container-jcj">
      {/* Left Side - Image */}
      <div className="image-section-jcj"></div>

      {/* Right Side - Form */}
      <div className="form-section-jcj">
        <div className="form-container-jcj">
          {/* Logo */}
          <div className="logo-container-jcj">
            <div className="logo-placeholder-jcj">
              <img src={logo} alt="UniVerse" className="logo-image-jcj" />
            </div>
          </div>

          <div className="form-header-jcj">
            <h1 className="form-title-jcj">Welcome to UniVerse!</h1>
            <p className="form-subtitle-jcj">
              Create your account to get started
            </p>
          </div>

          <form className="signup-form-jcj" onSubmit={handleSubmit}>
            <div className="form-row-jcj">
              <div className="input-group-jcj">
                <label className="input-label-jcj">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input-jcj"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="input-group-jcj">
                <label className="input-label-jcj">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-input-jcj"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>

            <div className="form-row-jcj">
              <div className="input-group-jcj">
                <label className="input-label-jcj">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input-jcj"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="input-group-jcj">
                <label className="input-label-jcj">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input-jcj"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div className="input-group-jcj full-width-jcj">
              <label className="input-label-jcj">Role</label>
              <div className="role-selection-jcj">
                <label className="role-option-jcj">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === "student"}
                    onChange={handleInputChange}
                    className="role-radio-jcj"
                  />
                  <div className="role-card-jcj">
                    <div className="role-icon-jcj">🎓</div>
                    <span className="role-text-jcj">Student</span>
                    <span className="role-desc-jcj">Learn and grow</span>
                  </div>
                </label>
                <label className="role-option-jcj">
                  <input
                    type="radio"
                    name="role"
                    value="mentor"
                    checked={formData.role === "mentor"}
                    onChange={handleInputChange}
                    className="role-radio-jcj"
                  />
                  <div className="role-card-jcj">
                    <div className="role-icon-jcj">👨‍🏫</div>
                    <span className="role-text-jcj">Mentor</span>
                    <span className="role-desc-jcj">Share knowledge</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="form-row-jcj">
              <div className="input-group-jcj">
                <label className="input-label-jcj">Password</label>
                <div className="password-input-container-jcj">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input-jcj password-input-jcj"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-jcj"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
              <div className="input-group-jcj">
                <label className="input-label-jcj">Confirm Password</label>
                <div className="password-input-container-jcj">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="form-input-jcj password-input-jcj"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-jcj"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
            </div>

            <div className="checkbox-group-jcj">
              <label className="checkbox-label-jcj">
                <input
                  type="checkbox"
                  className="checkbox-input-jcj"
                  required
                />
                <span className="checkbox-checkmark-jcj"></span>
                <span className="checkbox-text-jcj">
                  I agree to the{" "}
                  <a href="#" className="terms-link-jcj">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="terms-link-jcj">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="submit-button-jcj"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
            {errorMessage && (
              <p className="form-error-text-jcj" role="alert">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="form-success-text-jcj" role="status">
                {successMessage}
              </p>
            )}
          </form>

          <div className="signin-link-jcj">
            <p>
              Already have an account?{" "}
              <a href="#" className="signin-anchor-jcj">
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
