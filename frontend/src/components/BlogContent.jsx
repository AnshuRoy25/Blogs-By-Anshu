import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoHeart, IoShareSocial } from 'react-icons/io5';
import '../styles/blogcontent.css';

function BlogContent({ blog, onLike, onShare, onOpenLikers, hasLiked }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="blog-content">
      {/* Back arrow */}
      <button className="blog-back-btn" onClick={() => navigate(-1)}>
        <IoArrowBack size={24} />
      </button>

      {/* Title */}
      <h1 className="blog-title">{blog.title}</h1>

      {/* First description/intro paragraph */}
      <p className="blog-intro">{blog.description}</p>

      {/* Cover image */}
      <div className="blog-image-container">
        {/* <img src={blog.coverImageURL} alt={blog.title} className="blog-image" /> */}
      </div>

      {/* Author and date */}
      <div className="blog-meta">
        <span className="blog-author">By {blog.author || 'Anshu Roy'}</span>
        <span className="blog-date">{formatDate(blog.publishedAt)}</span>
      </div>

      {/* Full blog body */}
      <div className="blog-body">
        {blog.body}
      </div>

      {/* Like and share buttons */}
      <div className="blog-actions">
        <button 
          className={`blog-action-btn like-btn ${hasLiked ? 'liked' : ''}`}
          onClick={onLike}
        >
          <IoHeart size={22} />
        </button>

        <span
          className="blog-likes"
          onClick={() => onOpenLikers?.("blog", blog._id)}
        >
          {blog.likes ?? 0} likes
        </span>

        <button className="blog-action-btn share-btn" onClick={onShare}>
          <IoShareSocial size={22} />
        </button>
      </div>
    </div>
  );
}

export default BlogContent;