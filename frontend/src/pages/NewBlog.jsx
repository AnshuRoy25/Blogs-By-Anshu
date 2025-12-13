// src/pages/NewBlog.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogForm from "../components/BlogForm";
import { useAuth } from "../context/AuthContext"; // adjust path if needed

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function NewBlog() {
  const navigate = useNavigate();
  const { token } = useAuth(); // assumes AuthContext exposes admin JWT/token

  const [form, setForm] = useState({
    title: "",
    description: "",
    coverImageURL: "",
    body: "",
  });

  const [loading, setLoading] = useState(false);

  const onChangeField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const createBlog = async ({ isPublished, redirectTo }) => {
    if (!form.title.trim() || !form.body.trim() || !form.coverImageURL.trim()) {
      alert("Title, Body and Cover Image URL are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/admin/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          body: form.body,
          coverImageURL: form.coverImageURL.trim(),
          isPublished,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Error: ${res.status}`);
      }

      const created = data.blog;
      const id = created?._id || created?.id;

      if (redirectTo === "drafts") {
        navigate("/admin/drafts");
      } else if (redirectTo === "detail" && id) {
        navigate(`/blogs/${id}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () =>
    createBlog({ isPublished: false, redirectTo: "drafts" });

  const handlePublish = () =>
    createBlog({ isPublished: true, redirectTo: "home" });

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <button className="page-back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>New Blog</h1>
      </div>

      {loading && <p className="page-status">Saving...</p>}

      <BlogForm
        mode="new"
        title={form.title}
        description={form.description}
        coverImageURL={form.coverImageURL}
        body={form.body}
        onChangeField={onChangeField}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onMoveToDraft={undefined}
        onSave={undefined}
      />
    </div>
  );
}

export default NewBlog;
