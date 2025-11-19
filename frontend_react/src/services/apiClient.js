//
// PUBLIC_INTERFACE
/**
 * Minimal API client scaffold for Notes app.
 * - Reads REACT_APP_API_BASE or REACT_APP_BACKEND_URL from env.
 * - If no backend URL is provided, falls back to local storage/in-memory operations.
 * - All methods are Promise-based to keep the future switch to REST trivial.
 */
const ENV = {
  API_BASE:
    (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE) ||
    (typeof process !== "undefined" && process.env && process.env.REACT_APP_BACKEND_URL) ||
    "",
  FEATURE_FLAGS:
    (typeof process !== "undefined" && process.env && process.env.REACT_APP_FEATURE_FLAGS) || "",
};

const hasBackend = !!ENV.API_BASE;

// Local storage keys
const LS_KEYS = {
  NOTES: "notes_app__notes",
};

/**
 * Internal helper to read notes from localStorage safely.
 */
function readLocalNotes() {
  try {
    const raw = window.localStorage.getItem(LS_KEYS.NOTES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

/**
 * Internal helper to write notes to localStorage safely.
 */
function writeLocalNotes(notes) {
  try {
    window.localStorage.setItem(LS_KEYS.NOTES, JSON.stringify(notes));
  } catch {
    // Fallback no-op; app should still function in-memory if storage is blocked
  }
}

let inMemoryNotes = [];

/**
 * Ensure we have a local notes cache initialized from localStorage.
 */
function ensureLocalCache() {
  if (inMemoryNotes.length === 0) {
    inMemoryNotes = readLocalNotes();
  }
}

// PUBLIC_INTERFACE
export function getApiBase() {
  /** Returns the resolved API base URL or empty string if none is configured. */
  return ENV.API_BASE || "";
}

// PUBLIC_INTERFACE
export async function listNotes() {
  /**
   * Returns the list of notes.
   * If a backend is configured, this will be adapted later to fetch from REST.
   * For now, this uses local storage/in-memory.
   */
  if (hasBackend) {
    // Placeholder for future REST integration:
    // const resp = await fetch(`${ENV.API_BASE}/notes`);
    // return resp.json();
  }
  ensureLocalCache();
  return Promise.resolve([...inMemoryNotes]);
}

// PUBLIC_INTERFACE
export async function createNote(note) {
  /**
   * Creates a new note.
   * Note: expects { id, title, content, updatedAt }
   */
  if (hasBackend) {
    // Placeholder for future REST integration:
    // const resp = await fetch(`${ENV.API_BASE}/notes`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(note) });
    // return resp.json();
  }
  ensureLocalCache();
  inMemoryNotes.unshift(note);
  writeLocalNotes(inMemoryNotes);
  return Promise.resolve(note);
}

// PUBLIC_INTERFACE
export async function updateNote(note) {
  /**
   * Updates an existing note by id.
   */
  if (hasBackend) {
    // Placeholder for future REST integration:
    // const resp = await fetch(`${ENV.API_BASE}/notes/${note.id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(note) });
    // return resp.json();
  }
  ensureLocalCache();
  const idx = inMemoryNotes.findIndex((n) => n.id === note.id);
  if (idx >= 0) {
    inMemoryNotes[idx] = { ...note };
  } else {
    inMemoryNotes.unshift(note);
  }
  writeLocalNotes(inMemoryNotes);
  return Promise.resolve(note);
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /**
   * Deletes a note by id.
   */
  if (hasBackend) {
    // Placeholder for future REST integration:
    // await fetch(`${ENV.API_BASE}/notes/${id}`, { method: 'DELETE' });
  }
  ensureLocalCache();
  inMemoryNotes = inMemoryNotes.filter((n) => n.id !== id);
  writeLocalNotes(inMemoryNotes);
  return Promise.resolve({ id });
}
