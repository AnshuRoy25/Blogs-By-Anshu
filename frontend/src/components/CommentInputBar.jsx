// src/components/CommentInputBar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoSend } from "react-icons/io5";
import "../styles/commentinputbar.css";

function CommentInputBar({ onAddComment }) {
  const { isAuthenticated } = useAuth();
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    onAddComment(text.trim());
    setText("");
  };

  return (
    <form className="comment-input-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="comment-input"
        placeholder="Write a comment"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="comment-send-btn">
        <IoSend size={20} />
      </button>
    </form>
  );
}

export default CommentInputBar;