// src/pages/EditBlog.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogForm from "../components/BlogForm";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function EditBlog() {
  const navigate = useNavigate();
  const { id } = useParams();          // blog id from /admin/blogs/:id
  const { token } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    coverImageURL: "",
    body: "",
  });
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);   // loading initial fetch
  const [saving, setSaving] = useState(false);    // loading updates
  const [error, setError] = useState("");

  const mode = isPublished ? "edit-published" : "edit-draft";

  const onChangeField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Fetch current blog by id (admin-only)
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE_URL}/blogs/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || `Error: ${res.status}`);
        }

        const blog = data.blog || data; // depending on your public GET shape

        setForm({
          title: blog.title || "",
          description: blog.description || "",
          coverImageURL: blog.coverImageURL || "",
          body: blog.body || "",
        });
        setIsPublished(Boolean(blog.isPublished));
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  // Helper to call PUT /admin/blogs/:id
  const updateBlog = async ({ nextIsPublished, redirectTo }) => {
    if (!form.title.trim() || !form.body.trim() || !form.coverImageURL.trim()) {
      alert("Title, Body and Cover Image URL are required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/admin/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          body: form.body,
          coverImageURL: form.coverImageURL.trim(),
          isPublished: nextIsPublished,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Error: ${res.status}`);
      }

      const updated = data.blog;
      setIsPublished(Boolean(updated.isPublished));

      if (redirectTo === "drafts") {
        navigate("/admin/drafts");
      } else if (redirectTo === "home") {
        navigate("/");
      } else if (redirectTo === "detail" && updated?._id) {
        navigate(`/blogs/${updated._id}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update blog");
      alert(err.message || "Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  // Button handlers mapped to backend semantics
  const handleSaveDraft = () =>
    updateBlog({ nextIsPublished: false, redirectTo: "drafts" });

  const handlePublish = () =>
    updateBlog({ nextIsPublished: true, redirectTo: "home" });

  const handleMoveToDraft = () =>
    updateBlog({ nextIsPublished: false, redirectTo: "drafts" });

  const handleSavePublished = () =>
    updateBlog({ nextIsPublished: true, redirectTo: "home" });

  if (loading) {
    return (
      <div className="page-wrapper">
        <p>Loading blog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate(-1)}>Go back</button>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <button className="page-back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>
          {isPublished ? "Edit Blog" : "Edit Draft"} / {form.title || ""}
        </h1>
      </div>

      {saving && <p className="page-status">Saving...</p>}

      <BlogForm
        mode={mode}
        title={form.title}
        description={form.description}
        coverImageURL={form.coverImageURL}
        body={form.body}
        onChangeField={onChangeField}
        // used when currently a draft
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        // used when currently published
        onMoveToDraft={handleMoveToDraft}
        onSave={handleSavePublished}
      />
    </div>
  );
}

export default EditBlog;
