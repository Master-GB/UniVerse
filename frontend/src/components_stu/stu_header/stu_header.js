import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiEdit2,
  FiLogOut,
  FiMail,
  FiUpload,
  FiUser,
  FiTrash2,
} from "react-icons/fi";
import "./stu_header.css";

const resolveProfilePictureUrl = (path, apiBaseUrl) => {
  if (!path) return null;
  if (/^https?:/i.test(path)) {
    return path;
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
};

const getUserInitials = (user) => {
  const source = user?.name || user?.username || "";
  if (!source.trim()) {
    return "UV";
  }
  const parts = source
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) {
    return source.slice(0, 2).toUpperCase();
  }
  const firstLetter = parts[0][0] || "";
  const secondLetter =
    parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || "";
  return `${firstLetter}${secondLetter}`.toUpperCase();
};

const ProfileEditModal = ({
  isOpen,
  onClose,
  formState,
  onFieldChange,
  onSubmit,
  onFileChange,
  onRemovePicture,
  isSubmitting,
  error,
}) => {
  const fileInputRef = useRef(null);

  // Fetch the authenticated student's profile so the header always reflects
  // the latest data coming from the API (instead of relying only on localStorage).
  useEffect(() => {
    if (!isOpen && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="stu-profile-modal-overlay-jcj" role="dialog" aria-modal="true">
      <div className="stu-profile-modal-jcj">
        <button
          type="button"
          className="stu-profile-modal-close-jcj"
          onClick={onClose}
          aria-label="Close profile editor"
        >
          ×
        </button>
        <h3 className="stu-profile-modal-title-jcj">Edit Profile</h3>
        {error && <p className="stu-profile-modal-error-jcj">{error}</p>}

        <form
          className="stu-profile-modal-form-jcj"
          onSubmit={onSubmit}
          noValidate
        >
          <label className="stu-profile-modal-label-jcj">
            Full Name
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={onFieldChange}
              className="stu-profile-modal-input-jcj"
              placeholder="Jane Doe"
              autoComplete="name"
              required
            />
          </label>

          <label className="stu-profile-modal-label-jcj">
            Username
            <input
              type="text"
              name="username"
              value={formState.username}
              onChange={onFieldChange}
              className="stu-profile-modal-input-jcj"
              placeholder="janedoe"
              autoComplete="username"
              required
            />
          </label>

          <label className="stu-profile-modal-label-jcj">
            Email Address
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={onFieldChange}
              className="stu-profile-modal-input-jcj"
              placeholder="jane@universe.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="stu-profile-modal-label-jcj">
            Phone Number
            <input
              type="tel"
              name="phone"
              value={formState.phone}
              onChange={onFieldChange}
              className="stu-profile-modal-input-jcj"
              placeholder="+94 77 123 4567"
              autoComplete="tel"
            />
          </label>

          <label className="stu-profile-modal-label-jcj">
            New Password
            <input
              type="password"
              name="password"
              value={formState.password}
              onChange={onFieldChange}
              className="stu-profile-modal-input-jcj"
              placeholder="Leave blank to keep current password"
              autoComplete="new-password"
            />
          </label>

          <div className="stu-profile-modal-picture-jcj">
            {formState.previewUrl ? (
              <img
                src={formState.previewUrl}
                alt="Profile preview"
                className="stu-profile-modal-picture-preview-jcj"
              />
            ) : (
              <div className="stu-profile-modal-picture-placeholder-jcj">
                <FiUser size={28} />
              </div>
            )}

            <div className="stu-profile-modal-picture-actions-jcj">
              <label className="stu-profile-modal-upload-btn-jcj">
                <FiUpload />
                <span>Upload new</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={onFileChange}
                  hidden
                />
              </label>
              {(formState.previewUrl || formState.removeProfilePicture) && (
                <button
                  type="button"
                  className="stu-profile-modal-remove-btn-jcj"
                  onClick={onRemovePicture}
                >
                  <FiTrash2 />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="stu-profile-modal-submit-jcj"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

const StuNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editProfileError, setEditProfileError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const popoverRef = useRef(null);
  const avatarButtonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Helper function to check if any of the dropdown paths are active
  const isDropdownActive = (paths) => {
    return paths.some((path) => isActive(path));
  };

  const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "http://localhost:8070").replace(
    /\/$/,
    ""
  );

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const stored = localStorage.getItem("universe_user");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn("Unable to parse stored user", error);
      return null;
    }
  });

  const [editForm, setEditForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    profilePicture: null,
    previewUrl: null,
    removeProfilePicture: false,
  });

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const togglePopover = () => {
    setIsPopoverOpen((prev) => !prev);
  };

  const closePopover = () => {
    setIsPopoverOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("universe_token");
    if (!token) {
      setIsProfileLoading(false);
      setProfileError("Authentication required");
      return;
    }

    const controller = new AbortController();

    const fetchProfile = async () => {
      setIsProfileLoading(true);
      setProfileError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          throw new Error(errorBody?.message || "Unable to load profile");
        }

        const data = await response.json();
        if (data?.user) {
          setUserProfile(data.user);
          localStorage.setItem("universe_user", JSON.stringify(data.user));
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Profile fetch failed", error);
          setProfileError(error.message || "Unable to load profile");
        }
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfile();

    return () => {
      controller.abort();
    };
  }, [API_BASE_URL]);

  useEffect(() => {
    if (!isPopoverOpen) {
      return;
    }

    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(event.target)
      ) {
        closePopover();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closePopover();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isPopoverOpen]);

  // Call the backend logout endpoint before clearing browser state so any
  // server-side tracking (last logout timestamp, audit trails) remains accurate.
  const handleSignOut = async () => {
    const token = localStorage.getItem("universe_token");

    try {
      if (token) {
        const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.message || "Failed to sign out");
        }
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("universe_token");
      localStorage.removeItem("universe_user");
      setUserProfile(null);
      closePopover();
      navigate("/landing/login");
    }
  };

  const resetEditFormState = () => {
    if (editForm.previewUrl && editForm.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(editForm.previewUrl);
    }
    setEditForm({
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      profilePicture: null,
      previewUrl: null,
      removeProfilePicture: false,
    });
  };

  const handleCloseModal = () => {
    resetEditFormState();
    setEditProfileError(null);
    setShowEditModal(false);
  };

  const handleEditProfileClick = () => {
    if (!userProfile) {
      return;
    }

    setEditProfileError(null);
    setEditForm((prev) => {
      if (prev.previewUrl && prev.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(prev.previewUrl);
      }
      return {
        name: userProfile.name || "",
        username: userProfile.username || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        password: "",
        profilePicture: null,
        previewUrl: userProfile.profilePicture
          ? resolveProfilePictureUrl(userProfile.profilePicture, API_BASE_URL)
          : null,
        removeProfilePicture: false,
      };
    });
    setShowEditModal(true);
    closePopover();
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setEditForm((prev) => {
      if (prev.previewUrl && prev.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(prev.previewUrl);
      }
      if (!file) {
        return {
          ...prev,
          profilePicture: null,
          previewUrl: null,
        };
      }
      return {
        ...prev,
        profilePicture: file,
        previewUrl: URL.createObjectURL(file),
        removeProfilePicture: false,
      };
    });
  };

  const handleRemovePicture = () => {
    setEditForm((prev) => {
      if (prev.previewUrl && prev.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(prev.previewUrl);
      }
      return {
        ...prev,
        profilePicture: null,
        previewUrl: null,
        removeProfilePicture: true,
      };
    });
  };

  // Persist profile edits through the API using FormData to support optional
  // image uploads. The backend performs validation and deduplication checks.
  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("universe_token");
    if (!token) {
      setEditProfileError("Authentication required to update profile");
      return;
    }

    setIsSavingProfile(true);
    setEditProfileError(null);

    try {
      const formData = new FormData();
      if (editForm.name) formData.append("name", editForm.name.trim());
      if (editForm.username)
        formData.append("username", editForm.username.trim());
      if (editForm.email) formData.append("email", editForm.email.trim());
      if (editForm.phone) formData.append("phone", editForm.phone.trim());
      if (editForm.password) formData.append("password", editForm.password);
      if (editForm.profilePicture) {
        formData.append("profilePicture", editForm.profilePicture);
      }
      if (editForm.removeProfilePicture) {
        formData.append("removeProfilePicture", "true");
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Profile update failed");
      }

      if (data?.user) {
        setUserProfile(data.user);
        localStorage.setItem("universe_user", JSON.stringify(data.user));
      }

      handleCloseModal();
    } catch (error) {
      console.error("Profile update failed", error);
      setEditProfileError(error.message || "Profile update failed");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const resolvedProfilePicture = resolveProfilePictureUrl(
    userProfile?.profilePicture,
    API_BASE_URL
  );

  const initials = getUserInitials(userProfile);

  return (
    <header className="stu-header">
      <div className="stu-container">
        <div className="stu-header-content">
          <div className="stu-logo">
            <Link to="/student/dashboard">
              <img
                src="/Resources/gihan_res/logo.png"
                alt="UniVerse Logo"
                className="stu-logo-img"
              />
              <span className="stu-logo-text">UniVerse</span>
            </Link>
          </div>

          <div className={`stu-nav-links ${isOpen ? "stu-active" : ""}`}>
            <Link to="/student/dashboard" className="stu-nav-link">
              Dashboard
            </Link>
            <Link to="/student/courses" className="stu-nav-link">
              Courses
            </Link>
            <div className="stu-dropdown">
              <Link to="#" className={`stu-nav-link ${isDropdownActive(['/student/academic-resources', '/student/career-resources']) ? 'active' : ''}`}>
                Resources
                <svg
                  className="stu-dropdown-icon"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <div className="stu-dropdown-content">
                <Link
                  to="/student/academic-resources"
                  className="stu-dropdown-item"
                >
                  Academic Resources
                </Link>
                <Link
                  to="/student/career-resources"
                  className="stu-dropdown-item"
                >
                  Career Resources
                </Link>
              </div>
            </div>

            <div className="stu-dropdown">
              <Link to="/student/career-skills" className="stu-nav-link">
                Career & Skills
                <svg
                  className="stu-dropdown-icon"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <div className="stu-dropdown-content">
                <Link to="/student/resume" className="stu-dropdown-item">
                  Resume Builder
                </Link>
                <Link to="/mi/landing" className={`stu-dropdown-item ${isActive('/mi') ? 'active' : ''}`}>
                  Mock Interview
                </Link>
                <Link to="/student/interview_quiz" className={`stu-dropdown-item ${isActive('/student/interview_quiz') ? 'active' : ''}`}>
                  Interview Quizzes
                </Link>
              </div>
            </div>

            <Link to="/student/exam-support" className="stu-nav-link">
              Exam Support
            </Link>
            <Link to="/student/guidance" className="stu-nav-link">
              Guidance
            </Link>
            <div className="stu-dropdown">
              <Link to="#" className={`stu-nav-link ${isDropdownActive(['/student/academic-session', '/student/career-session']) ? 'active' : ''}`}>
                Session
                <svg
                  className="stu-dropdown-icon"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <div className="stu-dropdown-content">
                <Link
                  to="/student/academic-session"
                  className="stu-dropdown-item"
                >
                  Academic Session
                </Link>
                <Link
                  to="/student/career-session"
                  className="stu-dropdown-item"
                >
                  Career Session
                </Link>
              </div>
            </div>
          </div>

          <div className="stu-user-menu">
            <button className="stu-notification-btn">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C10.9 2 10 2.9 10 4V4.29C7.12 5.14 5 7.83 5 11V17L3 19V20H21V19L19 17V11C19 7.83 16.88 5.14 14 4.29V4C14 2.9 13.1 2 12 2ZM12 6C14.76 6 17 8.24 17 11V18H7V11C7 8.24 9.24 6 12 6Z"
                  fill="currentColor"
                />
                <path
                  d="M12 23C13.1 23 14 22.1 14 21H10C10 22.1 10.9 23 12 23Z"
                  fill="currentColor"
                />
              </svg>
              <span className="stu-notification-badge">3</span>
            </button>

            <div className="stu-avatar-wrapper-jcj">
              <button
                type="button"
                ref={avatarButtonRef}
                className="stu-avatar-button-jcj"
                onClick={togglePopover}
                aria-haspopup="true"
                aria-expanded={isPopoverOpen}
              >
                {resolvedProfilePicture ? (
                  <img
                    src={resolvedProfilePicture}
                    alt={userProfile?.name || "Student avatar"}
                    className="stu-avatar-image-jcj"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.removeAttribute("src");
                    }}
                  />
                ) : (
                  <span className="stu-avatar-initials-jcj">{initials}</span>
                )}
              </button>

              {isPopoverOpen && (
                <div className="stu-profile-popover-jcj" ref={popoverRef}>
                  {isProfileLoading ? (
                    <div className="stu-profile-loading-jcj">Loading profile…</div>
                  ) : (
                    <>
                      <div className="stu-popover-header-jcj">
                        <div className="stu-popover-avatar-jcj">
                          {resolvedProfilePicture ? (
                            <img
                              src={resolvedProfilePicture}
                              alt="Profile"
                              className="stu-popover-avatar-image-jcj"
                            />
                          ) : (
                            <FiUser />
                          )}
                        </div>
                        <div className="stu-popover-details-jcj">
                          <h4 className="stu-popover-name-jcj">
                            {userProfile?.name || userProfile?.username || "Unknown"}
                          </h4>
                          <span className="stu-popover-email-jcj">
                            <FiMail />
                            <span>{userProfile?.email || "unknown"}</span>
                          </span>
                        </div>
                      </div>

                      {profileError && (
                        <p className="stu-profile-error-jcj">{profileError}</p>
                      )}

                      <div className="stu-popover-actions-jcj">
                        <button
                          type="button"
                          className="stu-profile-btn-jcj"
                          onClick={handleEditProfileClick}
                          disabled={!userProfile}
                        >
                          <FiEdit2 />
                          <span>Edit Profile</span>
                        </button>
                        <button
                          type="button"
                          className="stu-profile-btn-jcj stu-profile-signout-btn-jcj"
                          onClick={handleSignOut}
                        >
                          <FiLogOut />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="stu-hamburger" onClick={toggleMenu}>
              <span className={`stu-bar ${isOpen ? "stu-active" : ""}`}></span>
              <span className={`stu-bar ${isOpen ? "stu-active" : ""}`}></span>
              <span className={`stu-bar ${isOpen ? "stu-active" : ""}`}></span>
            </div>
          </div>
        </div>
      </div>

      <ProfileEditModal
        isOpen={showEditModal}
        onClose={handleCloseModal}
        formState={editForm}
        onFieldChange={handleFieldChange}
        onSubmit={handleProfileSubmit}
        onFileChange={handleFileChange}
        onRemovePicture={handleRemovePicture}
        isSubmitting={isSavingProfile}
        error={editProfileError}
      />
    </header>
  );
};

export default StuNavigation;