# PRAVAAH — Deployment & Production Guide

## Environments Supported

| Environment | Purpose | Configuration |
| :--- | :--- | :--- |
| **development** | Local development with Vite HMR | `PRAVAAH_ENV=development`, `FLASK_DEBUG=true`, CORS enabled for local ports |
| **demo** | Deterministic Hackathon judging & demo | `PRAVAAH_ENV=demo`, `PRAVAAH_DEMO_MODE=true`, `DEMO_SEED=20260908` |
| **production** | Production WSGI / Nginx containerized | `PRAVAAH_ENV=production`, `FLASK_DEBUG=false`, Gunicorn multi-worker, strict CORS |

---

## 1. Local Run (Development & Demo)

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs on `http://localhost:5000` with DuckDB in-memory.

### Frontend
```bash
cd frontend
npm.cmd install
npm.cmd run dev
```
Frontend runs on `http://localhost:5173`.

---

## 2. Docker & Containerized Deployment

PRAVAAH includes production Dockerfiles and a `docker-compose.yml` for single-command deployment.

### Single Command Launch
```bash
docker-compose up --build
```

- **Frontend Container (`pravaah-frontend`)**: Nginx 1.25 Alpine serving minified static bundle with SPA routing & reverse proxy for `/api/`. Exposed on port `80`.
- **Backend Container (`pravaah-backend`)**: Python 3.11 Slim running Gunicorn production WSGI server (2 workers, 4 threads, timeout 60s). Exposed on port `5000`.

### Health & Readiness Probes
```bash
# Health probe (simulation & demo metadata)
curl -f http://localhost:5000/api/health

# Readiness probe (DuckDB query & simulator initialization check)
curl -f http://localhost:5000/api/ready
```

---

## 3. Production Environment Variables

### Backend (`.env` or container env)
- `PRAVAAH_ENV`: `production` (disables debug mode)
- `PRAVAAH_DEMO_MODE`: `true` (enables deterministic demo controls)
- `DEMO_SEED`: `20260908` (central seed for identical simulation runs)
- `FLASK_HOST`: `0.0.0.0`
- `FLASK_PORT`: `5000`
- `CORS_ORIGINS`: Comma-separated list of allowed frontend domains
- `PRAVAAH_DB_PATH`: `:memory:` (or file path for persistence)
- `MAP_TILE_URL`: `https://tiles.openfreemap.org/styles/positron`

### Frontend (`.env.production` or build env)
- `VITE_API_BASE_URL`: `/api` (or fully qualified backend API URL)
- `VITE_MAP_STYLE_URL`: `https://tiles.openfreemap.org/styles/positron`
- `VITE_DEMO_MODE`: `true`

---

## 4. Security & Hardening Safeguards

1. **Security Headers**: All responses carry `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Content-Security-Policy`.
2. **Input Sanitization**:
   - Intervention dosage bounded between `0%` and `100%`.
   - Scenario IDs checked against registered whitelist (`central-line-disruption`, `heavy-rain`, `road-closure`).
   - Visitor preference sanitized (`LESS_CROWDED`, `FASTEST`, `AVOID_DISRUPTION`, `LOWER_TRAVEL_TIME`).
3. **Public / Operator Separation**: Visitor endpoints (`/api/visitor/*`) never expose internal model features, edge IDs, dosage percentages, or operator audit records.
4. **Standardized Error Responses**:
   ```json
   {
     "error": {
       "code": "ERROR_CODE",
       "message": "Human-readable description."
     }
   }
   ```
5. **K-Anonymity (K=10)**: Groups below 10 individuals are suppressed from public outputs.
6. **No Stored PII**: No GPS coordinates, device IDs, or user trajectories are captured or persisted.

---

## 5. Production Build Verification

```bash
cd frontend
npm.cmd run build
```
Generates clean distribution files in `frontend/dist/`.
