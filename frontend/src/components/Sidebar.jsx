
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";
import { useAuth } from "../context/AuthContext"; // adjust path if needed

function Sidebar() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const handleResumeClick = () => {
    window.open("https://your-drive-link-to-resume.com", "_blank");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      {/* Top profile section */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar" />
        <div className="sidebar-title">Blogs | Anshu Roy</div>

        <div className="sidebar-socials">
            <a
                href="https://github.com/AnshuRoy25"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
            >
                <button className="sidebar-icon-btn">GH</button>
            </a>

            <a
                href="https://www.instagram.com/anshuroy2006/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
            >
                <button className="sidebar-icon-btn">IG</button>
            </a>

            <a
                href="https://www.linkedin.com/in/anshuroy2006/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
            >
                <button className="sidebar-icon-btn">IN</button>
            </a>
        </div>

      </div>

      {/* Main navigation (common) */}
      <nav className="sidebar-nav">
        <NavLink
          to="/"
          className={({ isActive }) =>
            "sidebar-nav-btn" + (isActive ? " active" : "")
          }
        >
          <span className="sidebar-nav-icon">🏠</span>
          <span>Home</span>
        </NavLink>

        <button className="sidebar-nav-btn" onClick={handleResumeClick}>
          <span className="sidebar-nav-icon">📄</span>
          <span>Resume</span>
        </button>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            "sidebar-nav-btn" + (isActive ? " active" : "")
          }
        >
          <span className="sidebar-nav-icon">ℹ️</span>
          <span>About</span>
        </NavLink>

        {/* Extra items only when admin is logged in (case 3) */}
        {isAuthenticated && isAdmin && (
          <>
            <NavLink
              to="/admin/new"
              className={({ isActive }) =>
                "sidebar-nav-btn" + (isActive ? " active" : "")
              }
            >
              <span className="sidebar-nav-icon">➕</span>
              <span>New Blog</span>
            </NavLink>

            <NavLink
              to="/admin/drafts"
              className={({ isActive }) =>
                "sidebar-nav-btn" + (isActive ? " active" : "")
              }
            >
              <span className="sidebar-nav-icon">📁</span>
              <span>Draft</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Auth area – differs per case */}
      <div className="sidebar-auth">
        {!isAuthenticated ? (
          <>
            {/* Case 1: logged out (Login + SignUp) */}
            <button
              className="sidebar-auth-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="sidebar-auth-btn"
              onClick={() => navigate("/register")}
            >
              SignUp
            </button>
          </>
        ) : (
          /* Case 2 & 3: logged in (user/admin) */
          <button className="sidebar-auth-btn" onClick={handleLogout}>
            Log out
          </button>
        )}
      </div>

      {/* Bottom pill */}
      {!isAuthenticated ? (
        // Case 1: logged out – label "User"
        <button className="sidebar-user-btn">
          <span className="sidebar-nav-icon">👤</span>
          <span>User</span>
        </button>
      ) : (
        // Case 2: normal user -> user name
        // Case 3: admin -> "Admin"
        <button className="sidebar-user-btn">
          <span className="sidebar-nav-icon">👤</span>
          <span>{isAdmin ? "Admin" : user?.username || "User"}</span>
        </button>
      )}
    </aside>
  );
}

export default Sidebar;
