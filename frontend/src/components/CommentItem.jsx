// src/components/CommentItem.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/commentitem.css";
import ReplyItem from "./ReplyItem";

function CommentItem({
  comment,
  onDeleteComment,
  onAddReply,
  onDeleteReply,
  onLikeComment,
  onOpenLikers,
}) {
  const { isAuthenticated, isAdmin } = useAuth();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const navigate = useNavigate();

  const handleLikeComment = () => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }
    onLikeComment?.(comment._id);
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    const text = replyText.trim();
    if (!text) return;

    onAddReply(comment._id, text);
    setReplyText("");
    setShowReplyBox(false);
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <div className="comment-avatar">👤</div>
        <span className="comment-author">
          {comment.userId?.username || "Anonymous"}
        </span>

        {isAdmin && (
          <button
            className="comment-delete-btn"
            onClick={() => onDeleteComment(comment._id)}
          >
            Delete
          </button>
        )}
      </div>

      <div className="comment-text">{comment.content}</div>

      <div className="comment-actions">
        {isAdmin && (
          <button
            className="comment-reply-btn"
            onClick={() => setShowReplyBox((p) => !p)}
          >
            Reply
          </button>
        )}

        <button className="comment-like-btn" onClick={handleLikeComment}>
          ❤️
        </button>

        <span
          className="comment-like-count"
          onClick={() => onOpenLikers?.("comment", comment._id)}
        >
          {comment.likes ?? 0} likes
        </span>
      </div>

      {isAdmin && showReplyBox && (
        <form className="reply-form" onSubmit={handleReplySubmit}>
          <input
            type="text"
            className="reply-input"
            placeholder="Write a reply"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            autoFocus
          />
          <button type="submit" className="reply-send-btn">
            Send
          </button>
        </form>
      )}

      {comment.replies?.length > 0 && (
        <div className="replies-container">
          {comment.replies.map((reply) => (
            <ReplyItem
              key={reply._id}
              reply={reply}
              onDeleteReply={() => onDeleteReply?.(comment._id, reply._id)}
              onLikeReply={onLikeComment}
              onOpenLikers={onOpenLikers}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentItem;
