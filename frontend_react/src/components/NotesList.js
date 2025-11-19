import React from "react";

// PUBLIC_INTERFACE
export default function NotesList({ notes, selectedId, onSelect, onDelete }) {
  /** Renders the list of notes with title and short content preview. */
  if (!Array.isArray(notes) || notes.length === 0) {
    return (
      <div className="empty">
        <p>No notes yet. Create your first note!</p>
      </div>
    );
  }

  return (
    <ul className="notes-list" role="list" aria-label="Notes list">
      {notes.map((n) => {
        const preview =
          (n.content || "").length > 64
            ? `${n.content.slice(0, 64)}…`
            : n.content || "";
        const isActive = selectedId === n.id;
        return (
          <li
            key={n.id}
            className={`note-row ${isActive ? "active" : ""}`}
            onClick={() => onSelect(n.id)}
            role="listitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSelect(n.id);
            }}
            aria-current={isActive ? "true" : "false"}
          >
            <div className="note-meta">
              <div className="note-title">{n.title || "Untitled"}</div>
              <div className="note-preview">{preview}</div>
            </div>
            <button
              className="btn secondary"
              aria-label={`Delete ${n.title || "note"}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(n.id);
              }}
            >
              Delete
            </button>
          </li>
        );
      })}
    </ul>
  );
}
