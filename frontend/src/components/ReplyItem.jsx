// src/components/ReplyItem.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { IoPerson, IoHeart } from "react-icons/io5";
import "../styles/replyitem.css";

function ReplyItem({ reply, onDeleteReply, onLikeReply, onOpenLikers }) {
  const { isAdmin, isAuthenticated } = useAuth();

  const handleLike = () => {
    if (!isAuthenticated) {
      alert("Please log in to like replies.");
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
        <button className="reply-like-btn" onClick={handleLike}>
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