// src/pages/BlogDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/blogdetail.css";
import BlogContent from "../components/BlogContent";
import CommentSection from "../components/CommentSection";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";
import LikersModal from "../components/LikersModal";

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, token, user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);  // Track if current user liked
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likersOpen, setLikersOpen] = useState(false);
  const [likersUsers, setLikersUsers] = useState([]);
  const [likersLoading, setLikersLoading] = useState(false);

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
          
          // Check if current user has liked this blog
          if (isAuthenticated && user && data.blog.likedBy) {
            const userHasLiked = data.blog.likedBy.includes(user.id);
            setHasLiked(userHasLiked);
          }
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
  }, [id, isAuthenticated, user]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate("/register");
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
        // Update blog with new like count and likedBy array
        setBlog((prev) => ({
          ...prev,
          likes: data.blog?.likes ?? prev.likes,
          likedBy: data.blog?.likedBy ?? prev.likedBy,
        }));
        
        // Toggle hasLiked state
        setHasLiked((prev) => !prev);
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

  const handleOpenLikers = async (type, targetId) => {
    setLikersOpen(true);
    setLikersLoading(true);
    setLikersUsers([]);

    let url;
    if (type === "blog") url = `${API_BASE_URL}/blogs/likes/blogs/${targetId}`;
    if (type === "comment" || type === "reply")
      url = `${API_BASE_URL}/comments/likes/comments/${targetId}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setLikersUsers(data.users || []);
      } else {
        alert(data.error || "Failed to load likes");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while loading likes");
    } finally {
      setLikersLoading(false);
    }
  };

  if (loading) return (
    <div className="blogdetail-container">
      <div className="blogdetail-wrapper">
        <LoadingSpinner />
      </div>
    </div>
  );
  if (error) return <div className="blogdetail-error">{error}</div>;
  if (!blog) return <div className="blogdetail-error">Blog not found</div>;

  return (
    <div className="blogdetail-container">
      <div className="blogdetail-wrapper">
        <BlogContent
          blog={blog}
          onLike={handleLike}
          onShare={handleShare}
          onOpenLikers={handleOpenLikers}
          hasLiked={hasLiked}  // Pass hasLiked state
        />

        <div className="blogdetail-comments">
          <CommentSection
            blogId={id}
            initialComments={[]}
            onOpenLikers={handleOpenLikers}
          />
        </div>
      </div>

      <LikersModal
        open={likersOpen}
        onClose={() => setLikersOpen(false)}
        users={likersLoading ? [] : likersUsers}
      />
    </div>
  );
}

export default BlogDetail;