// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import BlogCard from "../components/BlogCard";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";

function Home() {
  const { isAdmin, token } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Debounce search input (wait 300ms after user stops typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch blogs whenever debounced search term changes
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();
        if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

        const res = await fetch(`${API_BASE_URL}/blogs?${params.toString()}`);
        const data = await res.json();

        if (res.ok) {
          setBlogs(data.blogs || []);
        } else {
          setError(data.error || "Failed to load blogs");
        }
      } catch (err) {
        console.error(err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [debouncedSearch]);

  const handleOpenBlog = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  const handleEditBlog = (blogId) => {
    navigate(`/admin/blogs/${blogId}`);
  };

  const handleDeleteBlog = async (blogId) => {
    const ok = window.confirm("Delete this blog?");
    if (!ok) return;

    if (!token) {
      alert("You are not logged in as admin.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/admin/blogs/${blogId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b._id !== blogId));
      } else {
        alert(data.error || "Failed to delete blog");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while deleting blog");
    }
  };

  return (
    <div className="home-container">
      <div className="home-search-bar">
        <SearchBar 
          onSearch={setSearch}  // Pass setSearch directly
          searchTerm={search}    // Pass current search value
        />
      </div>

      <div className="home-blog-list">
        {loading && <LoadingSpinner />}
        {error && <p className="home-error">{error}</p>}

        {!loading && !error && blogs.map((blog) => (
          <BlogCard
            key={blog._id}
            title={blog.title}
            description={blog.description}
            date={formatDate(blog.createdAt)}
            coverImageURL={blog.coverImageURL}
            onClick={() => handleOpenBlog(blog._id)}
            isAdmin={isAdmin}
            onEdit={() => handleEditBlog(blog._id)}
            onDelete={() => handleDeleteBlog(blog._id)}
          />
        ))}

        {!loading && !error && blogs.length === 0 && (
          <p className="home-empty">No blogs found.</p>
        )}
      </div>
    </div>
  );
}

export default Home;