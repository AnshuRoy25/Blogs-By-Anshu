// src/components/ReplyItem.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoPerson, IoHeart } from "react-icons/io5";
import "../styles/replyitem.css";

function ReplyItem({ reply, onDeleteReply, onLikeReply, onOpenLikers }) {
  const { isAdmin, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Check if current user has liked this reply
  const hasLiked = user && reply.likedBy?.includes(user.id);

  const handleLike = () => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }
    onLikeReply?.(reply._id);
  };

  return (
    <div className="reply-item">
      <div className="reply-header">
        <div className="reply-avatar">
          <IoPerson size={18} />
        </div>
        <span className="reply-author">
          {reply.userId?.username || "Admin"}
        </span>

        {isAdmin && (
          <button
            className="reply-delete-btn"
            onClick={() => onDeleteReply(reply._id)}
          >
            Delete
          </button>
        )}
      </div>

      <div className="reply-text">{reply.content}</div>

      <div className="reply-actions">
        <button 
          className={`reply-like-btn ${hasLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <IoHeart size={16} />
        </button>
        <span
          className="reply-like-count"
          onClick={() => onOpenLikers?.("reply", reply._id)}
        >
          {reply.likes ?? 0} likes
        </span>
      </div>
    </div>
  );
}

export default ReplyItem;