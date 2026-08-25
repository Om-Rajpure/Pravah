# PRAVAAH — Demo Guide

## Quick Start

```bash
# Terminal 1 — Backend
cd backend
python app.py

# Terminal 2 — Frontend
cd frontend
npm.cmd run dev
```

Open `http://localhost:5173` in a browser.

---

## Entering Demo Mode

Demo Mode is always active by default (`PRAVAAH_DEMO_MODE=true` in `.env`).

The **Demo Mode Bar** appears at the top of every Operator (Control Room) page — dark background with:
- Current event name and description
- PLAY / SKIP / RESET controls
- Active scenario badge (when a disruption is active)
- Simulation clock

---

## Demo Controls

| Button | Action |
|---|---|
| ▶ Play | Starts the simulation auto-stepping (5-min steps every 3s) |
| ⏸ Pause | Pauses auto-stepping |
| ⏭ Next Event | Jumps to the next canonical demo event (applies sim steps + scenario) |
| 🔄 Reset | Full atomic reset — restores simulation, network, scenario, prediction, audit, and demo index |

---

## Demo Event Sequence

PRAVAAH ships with 6 canonical demo events:

| Event | Description |
|---|---|
| **T+00 Normal** | City at baseline — 18:00, all systems nominal |
| **T+15 Pressure Rising** | Curry Road pressure begins climbing |
| **T+30 Forecast Warning** | Prediction engine issues HIGH forecast for Curry Road |
| **T+50 Recommendation** | PRAVAAH recommends: Redirect 18% → Thane/Vashi |
| **T+60 Disruption** | Central Line Disruption scenario activated |
| **T+80 Recovery** | Network updated, new forecast + recommendation generated |

Press **Next Event** to advance through the sequence.
Press **Reset** to return to T+00 from any point.

---

## Complete Demo Walkthrough

### STEP 1 — Open the App
Navigate to `http://localhost:5173`.
You are redirected to `/control-room/overview`.
The Demo Mode Bar shows: **EVENT 1/6 · Normal Conditions**.

### STEP 2 — Show the Map
The Mumbai map is the visual centerpiece.
Current pressure indicators are shown as colored zone markers.
Point to the **Curry Road** zone — note the HIGH/MODERATE current pressure.

### STEP 3 — Click Next Event × 2 (T+15, T+30)
Pressure begins rising. Navigate to **Predictions** in the sidebar.
Show: Curry Road forecast `72 → 94` over the next 2 hours.

### STEP 4 — Click Next Event (T+50 — Recommendation)
Navigate to **Actions** in the sidebar.
Show: PRAVAAH recommends **Redirect 18% → Thane**.
Key numbers: `94 → 76` pressure, critical zones `3 → 1`.
Click **Why?** in the Glass Box panel to show the reasoning chain.

### STEP 5 — Click Simulate (on Overview or Actions page)
The in-page simulation result appears:
*"Curry Road 94 → 76 (-18 pts) · Critical zones: 3 → 1"*
Label: *SIMULATION — not applied to live state.*

### STEP 6 — Click Next Event (T+60 — Disruption)
The Demo Mode Bar shows: **⚡ CENTRAL LINE DISRUPTION**.
Navigate to **Scenarios**.
Select `central-line-disruption` → click **Simulate What-If**.
Show the 3-way scorecard: Baseline → Disruption → + Action.
Show the cascade: TRIGGER → NETWORK → FLOW → PRESSURE → RESPONSE.

### STEP 7 — New Recommendation
Navigate back to **Actions**.
The recommendation may have updated based on new network state.
Navigate to **Glass Box** in the sidebar.
Show: Decision Audit Timeline — old forecast, network change event, new recommendation.

### STEP 8 — Switch to Visitor Mode
The header shows **PRAVAAH** with a link to Control Room.
Click the mode switch (top-right header link / nav) to go to `/visitor`.
The Visitor Mode loads on mobile-friendly layout.

### STEP 9 — Visitor Destination
The Visitor Home shows popular destinations with live crowd dots.
Search **Gateway of India** — shown as **HIGH / Busy**.
Select preference: **Less Crowded**.
Click **Find the Best Option**.
Destination detail loads: forecast grid, best-time suggestion, recommendation card.
The recommendation card shows: *Marine Drive — MODERATE — Lower predicted crowd, route operational.*

### STEP 10 — Privacy Center
Click **Privacy** in the visitor bottom nav.
Show: What PRAVAAH uses / doesn't use.
Toggle Location — default is OFF.
Expand the **Data Governance Catalog** — shows all data types with purpose and retention.

### STEP 11 — Reset Demo
Click the 🔄 **Reset** button in the Demo Mode Bar.
All services return to T+00 baseline.
Confirm: Demo Mode Bar shows **EVENT 1/6 · Normal Conditions**.

---

## API Testing the Demo

```bash
# Check health + demo status
curl http://localhost:5000/api/health

# Get current demo status
curl http://localhost:5000/api/demo/status

# Advance one event
curl -X POST http://localhost:5000/api/demo/next-event

# Full reset
curl -X POST http://localhost:5000/api/demo/reset
```

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Map tiles not loading | Map visualization uses OpenFreeMap (public). Check internet connection. |
| Backend not reachable | Confirm `python app.py` is running on port 5000. |
| Frontend blank | Confirm `npm.cmd run dev` is running on port 5173. Check browser console. |
| Demo event not advancing | Click Reset first to ensure consistent baseline state. |
| Scenario not reverting | Use `POST /api/scenarios/reset` or click Reset in Demo Mode Bar. |

---

## Demo Recovery

If any visualization fails during a live demo:
1. The Demo Mode Bar and core simulation continue independently.
2. Navigate to a different page — each page fetches fresh data.
3. If a component shows "Component Unavailable" — click **Retry**.
4. If everything breaks — press 🔄 Reset in the Demo Mode Bar.

The deterministic seed (`DEMO_SEED=20260908`) guarantees identical results after every reset.
