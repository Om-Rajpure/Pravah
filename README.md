# PRAVAAH (प्रवाह)
## Intelligent Travel Resilience for Mega-Event Mumbai

> **The city has capacity. The problem is distribution.**

PRAVAAH is a city operations intelligence platform designed for Ganesh Chaturthi 2026 — Mumbai. It models the city as a dynamic crowd network, predicts where pressure will emerge, simulates interventions before recommending them, and explains every decision transparently.

---

## The Problem

Ganesh Chaturthi draws 10–15 million visitors to Mumbai over 10 days.
Pressure concentrates in specific corridor nodes — not because the city lacks capacity, but because flow is not distributed.
Bottlenecks cascade. By the time they are visible, they are already difficult to resolve.

---

## The Solution

PRAVAAH gives operators a complete intelligence loop:

| Stage | What it does |
|---|---|
| **SEE** | Real-time crowd pressure across 11 monitored zones |
| **PREDICT** | Multi-horizon forecasts (30m → 3h) using network-aware ML |
| **RECOMMEND** | Counterfactually tested intervention with optimal dosage |
| **SIMULATE** | "What if we redirect 18%?" — answer before committing |
| **EXPLAIN** | Glass Box reasoning chain for every decision |
| **WHAT-IF** | Inject disruptions (rain, train failure, road closure) |
| **GOVERN** | Show data is handled with aggregation and no individual tracking |
| **GUIDE** | Turn city intelligence into plain visitor travel guidance |

---

## Core Capabilities

- **Crowd Simulation**: 10,000 synthetic visitors, 5-minute discrete steps, deterministic seed
- **Network Model**: 30 nodes, 76 directed edges, Dijkstra routing, versioned edge closure
- **Prediction Engine**: LightGBM residual model (MAE: 1.026) + network propagation baseline
- **Intervention Engine**: Multi-objective scored candidates with counterfactual simulation
- **Scenario Injector**: Central Line Disruption, Heavy Rain, Road Closure — 5-stage cascade
- **Glass Box**: Plain-language trace stages, feature drivers, confidence, assumptions, audit trail
- **Privacy Layer**: K-anonymity (K=10), data minimization, public-safe serializers
- **Visitor Mode**: Mobile-first destination search, crowd forecasts, disruption-aware alternatives

---

## Architecture

```
Simulation (10k agents, 5-min steps)
       ↓
Network (30 nodes, 76 edges, Dijkstra)
       ↓
Prediction (LightGBM + network baseline, 4 horizons)
       ↓
Intervention (candidate generation → counterfactual → scoring)
       ↓
Scenario (overlay model, isolated counterfactual, 3-way scorecard)
       ↓
Explainability (trace stages, drivers, versions, audit trail)
       ↓
Privacy (aggregation, suppression, public-safe serializers)
       ↓
         ┌────────────────┐       ┌──────────────────┐
         │  OPERATOR VIEW │       │   VISITOR MODE   │
         │  Control Room  │       │  Mobile-first    │
         │  Actions       │       │  Crowd level     │
         │  Glass Box     │       │  Alternatives    │
         │  Scenarios     │       │  Privacy Center  │
         └────────────────┘       └──────────────────┘
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Lucide icons, Recharts |
| Map | MapLibre GL JS + OpenFreeMap |
| Backend | Flask (Python 3.10+), Flask-CORS |
| Database | DuckDB (in-memory) |
| Simulation | NumPy discrete-time agent engine |
| Graph | NetworkX DiGraph + Dijkstra |
| ML | LightGBM residual model |

---

## Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm.cmd install        # Windows PowerShell
npm.cmd run dev
```

Open `http://localhost:5173`.

> **Windows PowerShell**: Use `npm.cmd run dev` or run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` first.

---

## Quick Demo

1. Start backend and frontend.
2. Open `http://localhost:5173`.
3. The **Demo Mode Bar** is shown at the top of the Operator view.
4. Press **▶ Play** to start the simulation.
5. Press **⏭ Next Event** to advance through the canonical demo sequence.
6. Follow the narrative: Forecast → Recommendation → Simulation → Disruption → New Recommendation → Glass Box → Visitor Mode → Privacy.
7. Press **🔄 Reset** to return to baseline at any point.

Full demo walkthrough: [`docs/demo.md`](docs/demo.md)

---

## Demo Mode

Demo Mode is always active by default. The **same seed** (`DEMO_SEED=20260908`) produces identical outputs on every reset.

The 6 canonical demo events are:
1. **T+00** Normal Conditions
2. **T+15** Pressure Rising
3. **T+30** Forecast Warning
4. **T+50** Recommendation Ready
5. **T+60** Central Line Disruption
6. **T+80** New Recommendation (post-disruption)

---

## Privacy

- PRAVAAH does not require personal data to guide visitors.
- Zone pressure is aggregated (not individual-level).
- Groups below K=10 visitors are suppressed in public outputs.
- Approximate location is optional and session-scoped.
- Visitor API endpoints expose no PII, dosage values, or operator internals.
- Synthetic visitor movements are clearly labelled: `SIMULATED · AGGREGATED`.

Full privacy documentation: [`docs/privacy.md`](docs/privacy.md)

---

## Limitations

- All visitor data is **synthetic** (no live GPS or transit API integration).
- The network covers key corridors only (30 nodes / 76 edges — not the full Mumbai network).
- No operator authentication or access control in this prototype.
- State is in-memory; server restart resets the simulation.
- Map tiles require an internet connection.

---

## Documentation

- [`docs/api.md`](docs/api.md) — Full API reference
- [`docs/demo.md`](docs/demo.md) — Demo walkthrough and controls
- [`docs/technical-guide.md`](docs/technical-guide.md) — Architecture and system design
- [`docs/privacy.md`](docs/privacy.md) — Privacy and data governance

---

*PRAVAAH v1.0.0 · Demo Prototype · Simulated + calibrated to real Mumbai geography · DEMO_SEED=20260908*
