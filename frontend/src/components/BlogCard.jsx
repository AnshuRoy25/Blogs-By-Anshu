// src/components/BlogCard.jsx
import React from "react";
import "../styles/blogcard.css";

function BlogCard({
  title,
  description,
  date,
  coverImageURL,
  onClick,
  isAdmin = false,
  onEdit,
  onDelete,
}) {
  return (
    <div className="blogcard" onClick={onClick}>
      <div className="blogcard-left">
        <h2 className="blogcard-title">{title}</h2>
        <p className="blogcard-desc">{description}</p>
        <p className="blogcard-date">{date}</p>

        {isAdmin && (
          <div className="blogcard-admin-actions">
            <button
              className="blogcard-btn"
              onClick={(e) => {
                e.stopPropagation(); // don’t open blog when clicking Edit
                onEdit?.();
              }}
            >
              Edit
            </button>
            <button
              className="blogcard-btn danger"
              onClick={(e) => {
                e.stopPropagation(); // don’t open blog when clicking Delete
                onDelete?.();
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="blogcard-right">
        {/* When you’re ready to show images, uncomment this: */}
        {/* <img src={coverImageURL} alt={title} className="blogcard-image" /> */}
      </div>
    </div>
  );
}

export default BlogCard;
