// src/pages/Drafts.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";

function Drafts() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // Fetch all drafts from /admin/drafts
  const fetchDrafts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/admin/drafts`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Error: ${res.status}`);
      }

      setDrafts(data.drafts || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load drafts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Delete a draft via DELETE /admin/blogs/:id
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this draft permanently?");
    if (!ok) return;

    try {
      setDeletingId(id);
      setError("");

      const res = await fetch(`${API_BASE_URL}/admin/blogs/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Error: ${res.status}`);
      }

      // Remove from local list
      setDrafts((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete draft");
      alert(err.message || "Failed to delete draft");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/blogs/${id}`);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <button className="page-back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>Drafts</h1>
      </div>

      {loading && <p>Loading drafts...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && drafts.length === 0 && !error && (
        <p>No drafts yet. Create one from “New Blog”.</p>
      )}

      <div className="drafts-list">
        {drafts.map((draft) => (
          <BlogCard
            key={draft._id}
            title={draft.title}
            description={draft.description}
            date={
              draft.updatedAt
                ? new Date(draft.updatedAt).toLocaleDateString()
                : new Date(draft.createdAt).toLocaleDateString()
            }
            coverImageURL={draft.coverImageURL}
            isAdmin={true}
            onClick={() => handleEdit(draft._id)}
            onEdit={() => handleEdit(draft._id)}
            onDelete={() => handleDelete(draft._id)}
          />
        ))}
      </div>

      {deletingId && <p className="page-status">Deleting draft...</p>}
    </div>
  );
}

export default Drafts;
