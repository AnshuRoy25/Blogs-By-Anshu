import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "../styles/sidebar.css";
import { useAuth } from "../context/AuthContext";
// Import icons from react-icons
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import { IoDocument } from "react-icons/io5";
import { IoInformationCircle } from "react-icons/io5";
import { IoAddCircle } from "react-icons/io5";
import { IoFolderOpen } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
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
            <button className="sidebar-icon-btn">
              <FaGithub size={20} />
            </button>
          </a>

          <a
            href="https://www.instagram.com/anshuroy2006/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <button className="sidebar-icon-btn">
              <FaInstagram size={20} />
            </button>
          </a>

          <a
            href="https://www.linkedin.com/in/anshuroy2006/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <button className="sidebar-icon-btn">
              <FaLinkedin size={20} />
            </button>
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
          <span className="sidebar-nav-icon">
            <HiHome size={20} />
          </span>
          <span>Home</span>
        </NavLink>

        <button className="sidebar-nav-btn" onClick={handleResumeClick}>
          <span className="sidebar-nav-icon">
            <IoDocument size={20} />
          </span>
          <span>Resume</span>
        </button>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            "sidebar-nav-btn" + (isActive ? " active" : "")
          }
        >
          <span className="sidebar-nav-icon">
            <IoInformationCircle size={20} />
          </span>
          <span>About</span>
        </NavLink>

        {/* Extra items only when admin is logged in */}
        {isAuthenticated && isAdmin && (
          <>
            <NavLink
              to="/admin/new"
              className={({ isActive }) =>
                "sidebar-nav-btn" + (isActive ? " active" : "")
              }
            >
              <span className="sidebar-nav-icon">
                <IoAddCircle size={20} />
              </span>
              <span>New Blog</span>
            </NavLink>

            <NavLink
              to="/admin/drafts"
              className={({ isActive }) =>
                "sidebar-nav-btn" + (isActive ? " active" : "")
              }
            >
              <span className="sidebar-nav-icon">
                <IoFolderOpen size={20} />
              </span>
              <span>Draft</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Auth area */}
      <div className="sidebar-auth">
        {!isAuthenticated ? (
          <>
            <button
              className={`sidebar-auth-btn ${location.pathname === '/login' ? 'active' : ''}`}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className={`sidebar-auth-btn ${location.pathname === '/register' ? 'active' : ''}`}
              onClick={() => navigate("/register")}
            >
              SignUp
            </button>
          </>
        ) : (
          <button className="sidebar-auth-btn" onClick={handleLogout}>
            Log out
          </button>
        )}
      </div>

      {/* Bottom pill */}
      {!isAuthenticated ? (
        <button className="sidebar-user-btn">
          <span className="sidebar-nav-icon">
            <IoPerson size={20} />
          </span>
          <span>User</span>
        </button>
      ) : (
        <button className="sidebar-user-btn">
          <span className="sidebar-nav-icon">
            <IoPerson size={20} />
          </span>
          <span>{isAdmin ? "Admin" : user?.username || "User"}</span>
        </button>
      )}
    </aside>
  );
}

export default Sidebar;