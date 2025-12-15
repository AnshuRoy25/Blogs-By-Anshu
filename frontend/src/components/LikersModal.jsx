import React from "react";
import "../styles/likersmodal.css";

function LikersModal({ open, onClose, users = [] }) {
  if (!open) return null;

  return (
    <div className="likers-backdrop">
      <div className="likers-modal">
        <div className="likers-header">
          <span>Liked By</span>
          <button className="likers-back-btn" onClick={onClose}>
            Back
          </button>
        </div>

        <div className="likers-body">
          {users.length === 0 ? (
            <p>No likes yet.</p>
          ) : (
            <ul className="likers-list">
              {users.map((u) => (
                <li key={u._id} className="liker-row">
                  <span className="liker-icon">👤</span>
                  <span className="liker-name">{u.username}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default LikersModal;
