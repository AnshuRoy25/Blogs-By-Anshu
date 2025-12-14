// src/pages/BlogDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/blogdetail.css";
import BlogContent from "../components/BlogContent";
import CommentSection from "../components/CommentSection";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";

function BlogDetail() {
  const { id } = useParams(); // blog id from URL
  const { isAuthenticated, isAdmin, user, token } = useAuth(); // ⬅ added token

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch single blog when page loads
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE_URL}/blogs/${id}`);
        const data = await res.json();

        if (res.ok) {
          setBlog(data.blog);
        } else {
          setError(data.error || "Failed to load blog");
        }
      } catch (err) {
        console.error(err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert("You must be logged in to like this blog.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/blogs/${id}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json();

      if (res.ok) {
        // assume backend returns updated blog object with new likes
        setBlog((prev) => ({
          ...prev,
          likes: data.blog?.likes ?? prev.likes,
        }));
      } else {
        alert(data.error || "Failed to like blog");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while liking blog");
    }
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
    } catch (e) {
      console.error("Failed to copy link", e);
    }
  };

  if (loading) return <div className="blogdetail-loading">Loading...</div>;
  if (error) return <div className="blogdetail-error">{error}</div>;
  if (!blog) return <div className="blogdetail-error">Blog not found</div>;

  return (
    <div className="blogdetail-container">
      <BlogContent blog={blog} onLike={handleLike} onShare={handleShare} />

      <div className="blogdetail-comments">
        <CommentSection
          blogId={id}
          isLoggedIn={isAuthenticated}
          userName={user?.username || "User"}
          isAdmin={isAdmin}
          initialComments={blog.comments || []}
        />
      </div>
    </div>
  );
}

export default BlogDetail;
