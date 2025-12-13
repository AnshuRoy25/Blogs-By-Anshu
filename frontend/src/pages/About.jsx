// src/pages/About.jsx
import React, { useEffect, useState } from "react";
import "../styles/about.css";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


function About() {
  const { isAdmin } = useAuth();
  const [aboutContent, setAboutContent] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // 1) Load about text (same for everyone)
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/about`);
        const data = await res.json();

        if (res.ok) {
          setAboutContent(data.about.content);
          setDraftContent(data.about.content);
        } else {
          setError(data.error || "Failed to load about content");
        }
      } catch (err) {
        console.error(err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  // 2) Admin: start editing
  const handleEdit = () => {
    setDraftContent(aboutContent);
    setIsEditing(true);
    setError("");
  };

  // 3) Admin: cancel editing (Back button)
  const handleBack = () => {
    setDraftContent(aboutContent); // reset changes
    setIsEditing(false);
    setError("");
  };

  // 4) Admin: save edited text → PUT /admin/about
  const handleSave = async () => {
    const text = draftContent.trim();
    if (!text) {
      setError("Content cannot be empty");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in as admin.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/admin/about`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // adminAuth middleware
        },
        body: JSON.stringify({ content: text }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update UI with saved content
        setAboutContent(data.about.content);
        setDraftContent(data.about.content);
        setIsEditing(false);
      } else {
        setError(data.error || "Failed to save content");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="about-container">
      <div className="about-header-row">
        <h1 className="about-title">About</h1>

        {isAdmin && !loading && (
          <div className="about-header-buttons">
            {isEditing ? (
              <>
                <button className="about-btn secondary" onClick={handleBack} disabled={saving}>
                  Back
                </button>
                <button className="about-btn primary" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <button className="about-btn primary" onClick={handleEdit}>
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      {loading && <p className="about-loading">Loading...</p>}

      {error && <p className="about-error">{error}</p>}

      {!loading && !error && (
        <div className="about-card">
          {isAdmin && isEditing ? (
            <textarea
              className="about-textarea"
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
            />
          ) : (
            <p className="about-content">{aboutContent}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default About;
