// src/components/CommentSection.jsx
import React, { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import CommentInputBar from "./CommentInputBar";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";

function CommentSection({ blogId, initialComments = [] }) {
  const { isAuthenticated, isAdmin, token } = useAuth();

  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState(!initialComments.length);
  const [error, setError] = useState("");

  // Load comments if not already provided
  useEffect(() => {
    if (!blogId) return;
    if (initialComments.length) {
      setLoading(false);
      return;
    }

    const fetchComments = async () => {
      try {
        setLoading(true);
        setError("");

        // GET /comments/:blogId (public)
        const res = await fetch(`${API_BASE_URL}/comments/${blogId}`);
        const data = await res.json();

        if (res.ok) {
          setComments(data.comments || []);
        } else {
          setError(data.error || "Failed to load comments");
        }
      } catch (err) {
        console.error(err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [blogId, initialComments.length]);

  // POST /comments  → add top-level comment
  const handleAddComment = async (text) => {
    if (!text.trim()) return;
    if (!isAuthenticated || !token) {
      alert("Please log in to comment.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text, blogId }),
      });

      const data = await res.json();

      if (res.ok) {
        setComments((prev) => [data.comment, ...prev]);
      } else {
        alert(data.error || "Failed to post comment");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while posting comment");
    }
  };

  // DELETE /admin/comments/:id
  const handleDeleteComment = async (commentId) => {
    if (!isAdmin || !token) return;
    const ok = window.confirm("Delete this comment?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      } else {
        alert(data.error || "Failed to delete comment");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while deleting comment");
    }
  };

  // POST /admin/comments/:commentId/reply
  const handleReply = async (parentId, text) => {
    if (!text.trim()) return;
    if (!isAdmin || !token) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/comments/${parentId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: text }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        const newReply = data.reply;
        setComments((prev) =>
          prev.map((c) =>
            c._id === parentId
              ? { ...c, replies: [...(c.replies || []), newReply] }
              : c
          )
        );
      } else {
        alert(data.error || "Failed to reply");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while replying");
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!isAuthenticated || !token) {
      alert("Please log in to like comments.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        const updated = data.comment;
        setComments((prev) =>
          prev.map((c) => (c._id === updated._id ? updated : c))
        );
      } else {
        alert(data.error || "Failed to like comment");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while liking comment");
    }
  };

  return (
    <div className="comment-section">
      <h2 className="comment-section-title">Comments</h2>

      {loading && <p className="comment-section-loading">Loading comments...</p>}
      {error && <p className="comment-section-error">{error}</p>}

      {isAuthenticated && !error && (
        <CommentInputBar onAddComment={handleAddComment} />
      )}

      {!isAuthenticated && !error && (
        <p className="comment-section-login-hint">
          Log in to write a comment.
        </p>
      )}

      <div className="comment-section-list">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            onDeleteComment={handleDeleteComment}
            onAddReply={handleReply}
            onDeleteReply={handleDeleteComment} // replies are comments too
            onLikeComment={handleLikeComment}
          />
        ))}

        {!loading && !error && comments.length === 0 && (
          <p className="comment-section-empty">No comments yet.</p>
        )}
      </div>
    </div>
  );
}

export default CommentSection;
