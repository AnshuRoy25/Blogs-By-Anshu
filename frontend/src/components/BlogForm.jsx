
import React from "react";
import "../styles/blogform.css";

function BlogForm({
  mode,              // "new" | "edit-draft" | "edit-published"
  title,
  description,
  coverImageURL,
  body,
  onChangeField,     // (field, value) => void
  onSaveDraft,       // for new / edit-draft
  onMoveToDraft,     // for edit-published
  onPublish,         // for new / edit-draft
  onSave,            // for edit-published
}) {
  return (
    <div className="blogform-container">
      <div className="blogform-fields">
        <input
          className="blogform-input"
          placeholder="Title"
          value={title}
          onChange={(e) => onChangeField("title", e.target.value)}
        />

        <input
          className="blogform-input"
          placeholder="Description"
          value={description}
          onChange={(e) => onChangeField("description", e.target.value)}
        />

        <input
          className="blogform-input"
          placeholder="Cover Page URL"
          value={coverImageURL}
          onChange={(e) => onChangeField("coverImageURL", e.target.value)}
        />

        <textarea
          className="blogform-textarea"
          placeholder="Body"
          value={body}
          onChange={(e) => onChangeField("body", e.target.value)}
        />
      </div>

      <div className="blogform-actions">
        {mode === "new" && (
          <>
            <button className="blogform-btn secondary" onClick={onSaveDraft}>
              Save Draft
            </button>
            <button className="blogform-btn primary" onClick={onPublish}>
              Publish
            </button>
          </>
        )}

        {mode === "edit-draft" && (
          <>
            <button className="blogform-btn secondary" onClick={onSaveDraft}>
              Save Draft
            </button>
            <button className="blogform-btn primary" onClick={onPublish}>
              Publish
            </button>
          </>
        )}

        {mode === "edit-published" && (
          <>
            <button className="blogform-btn secondary" onClick={onMoveToDraft}>
              Move To Draft
            </button>
            <button className="blogform-btn primary" onClick={onSave}>
              Save
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default BlogForm;
