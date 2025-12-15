// src/components/CommentSection.jsx
import React, { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import CommentInputBar from "./CommentInputBar";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";

function CommentSection({ blogId, initialComments = [], onOpenLikers }) {
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

  // POST /comments → add top-level comment
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

  // PUT /comments/:id/like → toggle like
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
          prev.map((c) => {
            if (c._id === updated._id) {
              // top-level comment liked
              return { 
                ...updated, 
                replies: c.replies,
                likedBy: updated.likedBy  // Keep likedBy array
              };
            }

            // try to update inside replies
            const updatedReplies = (c.replies || []).map((r) =>
              r._id === updated._id ? { ...updated } : r
            );

            return { ...c, replies: updatedReplies };
          })
        );
      } else {
        alert(data.error || "Failed to like comment");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while liking comment");
    }
  };

  const handleDeleteReply = async (parentId, replyId) => {
    if (!isAdmin || !token) return;
    const ok = window.confirm("Delete this reply?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/comments/${replyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === parentId
              ? {
                  ...c,
                  replies: (c.replies || []).filter((r) => r._id !== replyId),
                }
              : c
          )
        );
      } else {
        alert(data.error || "Failed to delete reply");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while deleting reply");
    }
  };

  return (
    <div className="comment-section">
      <h2 className="comment-section-title">Comments</h2>

      {loading && <p className="comment-section-loading">Loading comments...</p>}
      {error && <p className="comment-section-error">{error}</p>}

      {/* Always show comment input box */}
      {!error && (
        <CommentInputBar onAddComment={handleAddComment} />
      )}

      <div className="comment-section-list">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            onDeleteComment={handleDeleteComment}
            onAddReply={handleReply}
            onDeleteReply={handleDeleteReply}
            onLikeComment={handleLikeComment}
            onOpenLikers={onOpenLikers}
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