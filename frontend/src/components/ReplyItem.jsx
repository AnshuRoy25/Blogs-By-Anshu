// src/components/ReplyItem.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/replyitem.css";

function ReplyItem({ reply, onDeleteReply }) {
  const { isAdmin } = useAuth();

  return (
    <div className="reply-item">
      <div className="reply-header">
        <div className="reply-avatar">👤</div>
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
    </div>
  );
}

export default ReplyItem;
