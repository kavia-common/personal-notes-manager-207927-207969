# Personal Notes React App

A lightweight notes application with create, read, update, and delete functionality. Uses an Ocean Professional theme and stores notes locally for now. The code is structured to easily switch to a REST backend later.

## Features
- Notes list with title and content preview
- Create new notes; validation on empty title
- Edit and delete existing notes
- Responsive layout: list pane + editor pane (stacks on mobile)
- Theme-aligned styling with subtle shadows
- Environment-aware API scaffold (local by default)

## Environment Variables
These are optional and safely handled at runtime. If not provided, the app runs fully in local mode.

- REACT_APP_API_BASE: Base URL for a future Notes REST API.
- REACT_APP_BACKEND_URL: Alternative base URL; used if API_BASE is not set.
- REACT_APP_FEATURE_FLAGS: JSON string with feature flags, e.g. {"experimental": true}

Example .env (do not commit secrets):
```
REACT_APP_API_BASE=
REACT_APP_BACKEND_URL=
REACT_APP_FEATURE_FLAGS={}
```

## Scripts

- `npm start` - Start dev server
- `npm test` - Run tests
- `npm run build` - Production build

## Code Structure
- `src/services/apiClient.js` - API scaffold reading env vars; falls back to local storage/in-memory.
- `src/components/NotesList.js` - Notes list with preview and delete action.
- `src/components/NoteEditor.js` - Create/Edit form with validation.
- `src/theme.css` and `src/App.css` - Theme and layout styles.

## Future backend integration
Replace the placeholder logic in `apiClient.js` with real fetch calls to the configured base URL. The UI already awaits Promises to make the change trivial.
