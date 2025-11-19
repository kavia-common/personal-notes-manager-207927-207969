import React, { useEffect, useState } from "react";

// PUBLIC_INTERFACE
export default function NoteEditor({ note, onSave, onCreateNew }) {
  /** Renders a simple form for creating/editing a note. Validates empty title. */
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setError("");
  }, [note?.id]);

  const handleSave = () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    const now = new Date().toISOString();
    const payload = {
      id: note?.id || cryptoRandomId(),
      title: title.trim(),
      content,
      updatedAt: now,
    };
    onSave(payload);
  };

  return (
    <div className="editor card">
      <div className="editor-header">
        <div className="badge" title="Notes are stored locally for now">Local Mode</div>
        <div className="editor-actions">
          <button className="btn" onClick={onCreateNew} aria-label="Create new note">
            New Note
          </button>
          <button className="btn" onClick={handleSave} aria-label="Save note">
            Save
          </button>
        </div>
      </div>
      <div className="form">
        <label className="label" htmlFor="note-title">
          Title
        </label>
        <input
          id="note-title"
          className="input"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="label" htmlFor="note-content">
          Content
        </label>
        <textarea
          id="note-content"
          className="textarea"
          placeholder="Write your note content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

function cryptoRandomId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `id_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}
