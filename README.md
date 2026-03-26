Prompt Conversation - [https://claude.ai/share/780b5f3c-f39c-45d0-a7fa-7ed00dd8a8d5] 

# Tofler Company Search

A minimal full-stack app to search for companies by name.

**Stack:** Python (Flask) · React (Vite) · Nginx

---

## Project Structure

```
tofler-search/
├── backend/
│   ├── app.py               # Flask API
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── App.css          # Styles
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js       # Dev proxy: /api → localhost:5000
└── nginx/
    └── nginx.conf
```

---

## Running the Backend

```bash
cd backend

# Create and activate virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

The API runs at **http://localhost:5000**.

**Test it:**
```bash
curl "http://localhost:5000/api/search?q=tata"
# → [{"id": 3, "name": "Tata Consultancy Services Ltd"}]
```

---

## Running the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (proxies /api to localhost:5000)
npm run dev
```

Open **http://localhost:5173** in your browser.

> The Vite dev server automatically proxies `/api/*` requests to the Flask backend — no CORS issues during development.

---

## Building for Production

```bash
cd frontend
npm run build
# Output in frontend/dist/
```

---

## Nginx Setup

Nginx serves the React build as static files and reverse-proxies `/api/*` to Flask.

### Steps

1. **Build the frontend:**
   ```bash
   cd frontend && npm run build
   ```

2. **Copy static files to Nginx root:**
   ```bash
   sudo cp -r frontend/dist/* /usr/share/nginx/html/
   ```

3. **Apply the Nginx config:**
   ```bash
   sudo cp nginx/nginx.conf /etc/nginx/conf.d/tofler.conf
   sudo nginx -t          # validate
   sudo systemctl reload nginx
   ```

4. **Ensure Flask is running** (see backend steps above).

5. Visit **http://localhost** — Nginx serves the app and proxies API calls.

### Without Nginx (dev mode)

Run both servers simultaneously:

```bash
# Terminal 1 — Backend
cd backend && python app.py

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open **http://localhost:5173**. Vite's dev proxy handles `/api` routing.

---

## API Reference

### `GET /api/search?q=<query>`

Returns companies whose names contain `q` (case-insensitive).

| Parameter | Type   | Description            |
|-----------|--------|------------------------|
| `q`       | string | Search term (required) |

**Example:**
```
GET /api/search?q=tech

[
  { "id": 8, "name": "HCL Technologies Ltd" },
  { "id": 9, "name": "Tech Mahindra Pvt Ltd" }
]
```

Returns `[]` for empty or non-matching queries.

---

## Design Decisions

- **Debounced search** (300ms) — avoids excessive API calls as the user types
- **flask-cors** — enables CORS for the dev workflow (Nginx handles it in prod)
- **No database** — hardcoded dataset as required; easy to swap for a DB later
