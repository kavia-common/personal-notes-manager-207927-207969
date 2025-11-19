import React, { useEffect, useMemo, useState } from "react";
import "./theme.css";
import "./App.css";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";
import { createNote, deleteNote, listNotes, updateNote, getApiBase } from "./services/apiClient";

// PUBLIC_INTERFACE
function App() {
  /**
   * Personal Notes UI
   * - Displays list of notes with title and preview
   * - Create, edit, delete notes
   * - Local storage/in-memory persistence for now
   * - Prepared to switch to REST later via apiClient
   */
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);

  // Basic feature flag parsing (safe on empty/missing)
  const featureFlags = useMemo(() => {
    try {
      const raw =
        (typeof process !== "undefined" && process.env && process.env.REACT_APP_FEATURE_FLAGS) || "";
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, []);

  const apiBase = getApiBase();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    listNotes().then((data) => {
      if (!mounted) return;
      setNotes(data);
      if (data[0]?.id) setSelectedId(data[0].id);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId),
    [notes, selectedId]
  );

  const handleCreateNew = () => {
    setSelectedId("");
  };

  const handleSave = async (payload) => {
    const exists = notes.some((n) => n.id === payload.id);
    if (exists) {
      await updateNote(payload);
      setNotes((prev) => prev.map((n) => (n.id === payload.id ? payload : n)));
    } else {
      await createNote(payload);
      setNotes((prev) => [payload, ...prev]);
    }
    setSelectedId(payload.id);
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setSelectedId((prevId) => (prevId === id ? "" : prevId));
  };

  return (
    <div className="app">
      <header className="header header-bar">
        <div className="brand">
          <div className="logo" aria-hidden="true" />
          <div className="title">Personal Notes</div>
          <div className="badge" style={{ marginLeft: 8 }}>
            {apiBase ? "API Ready" : "Local Mode"}
          </div>
        </div>
        <div className="controls">
          <a
            className="btn secondary"
            href="https://reactjs.org"
            target="_blank"
            rel="noreferrer"
          >
            Learn React
          </a>
        </div>
      </header>

      <main className="main">
        <aside className="sidebar">
          <div className="panel card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Your Notes</h3>
              <button className="btn" onClick={handleCreateNew} aria-label="Create new note">
                New
              </button>
            </div>
          </div>
          <div className="panel card" style={{ paddingTop: 0 }}>
            {loading ? (
              <div className="empty">Loading…</div>
            ) : (
              <NotesList
                notes={notes}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onDelete={handleDelete}
              />
            )}
          </div>
        </aside>

        <section>
          <NoteEditor note={selectedNote} onSave={handleSave} onCreateNew={handleCreateNew} />
        </section>
      </main>

      <footer className="footer">
        <span>
          Ocean Professional theme • {featureFlags.experimental ? "Experimental" : "Stable"} mode
        </span>
      </footer>
    </div>
  );
}

export default App;
