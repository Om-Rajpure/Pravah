# PRAVAAH (प्रवाह)
## Intelligent Travel Resilience & Civic Orchestration for Mega-Events

> **The city has capacity. The problem is distribution.**  
> Built for Ganesh Chaturthi 2026 — Mumbai.

---

## 🏛️ Executive Summary

**PRAVAAH** is a predictive, closed-loop city resilience platform designed for municipal authorities, event control rooms, transit operators, and citizens. By modeling Greater Mumbai as a connected transit network, PRAVAAH spots upcoming crowd bottlenecks hours before they form, tests counterfactual interventions in real-time simulations, explains decisions with causal glass-box transparency, and guides citizens toward less crowded routes without individual tracking.

---

## 🚀 Quick Start (Local Demo)

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*Backend runs on `http://localhost:5000` with DuckDB in-memory.*

### 2. Frontend Setup
```bash
cd frontend
npm.cmd install        # On Windows PowerShell
npm.cmd run dev
```
*Open `http://localhost:5173` in your browser.*

### 3. Containerized Run (Docker)
```bash
docker-compose up --build
```

---

## 🎬 5-Minute Hackathon Demo

1. **Launch**: Open `http://localhost:5173`. Click **Judge Tour** in the top bar.
2. **SEE**: View live pressure on the MapLibre Mumbai map. Note Curry Road (72/100) vs. Thane buffer (45% headroom).
3. **PREDICT**: Open **Predictions**. Observe Curry Road forecast surging to **94 (CRITICAL)** in 2 hours.
4. **RECOMMEND & SIMULATE**: Open **Actions**. Click **Simulate** on the recommended 18% redirection $\rightarrow$ watch pressure drop from **94 to 76 (-18 pts)**.
5. **EXPLAIN**: Open **Glass Box** to inspect causal trace stages, confidence (87%), and the decision audit timeline.
6. **WHAT-IF**: Open **Scenarios** $\rightarrow$ Simulate **Central Line Disruption** to see the 5-stage cascade.
7. **GUIDE & GOVERN**: Switch to **Visitor View** (`/visitor`) for alternative pandal guidance and review the zero-PII Privacy Center.
8. **RESET**: Click **Reset Demo** in the top bar to return to baseline for the next presentation.

---

## 🧠 Core Capabilities & Architecture

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
 ┌────────────────────────┐         ┌────────────────────────┐
 │ OPERATOR CONTROL ROOM  │         │   VISITOR EXPERIENCE   │
 │ • Real-time Mumbai Map │         │ • Destination Search   │
 │ • Risk KPIs & Alerts   │         │ • Crowd Forecasts      │
 │ • Counterfactual Sim   │         │ • Disruption Routing   │
 │ • Glass Box & Audit    │         │ • Privacy Center (K=10)│
 └────────────────────────┘         └────────────────────────┘
```

---

## 🛡️ Privacy & Data Governance

- **Zero GPS Tracking**: No personal trajectories, device IDs, cookies, or login required.
- **K-Anonymity ($K=10$)**: Groups below 10 individuals are suppressed (`visible: false`).
- **Data Minimization**: Public visitor endpoints expose only quantized crowd levels (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
- **Synthetic Data Label**: Every screen and API response explicitly carries `SIMULATED · SYNTHETIC`.

---

## 🧪 Quality Assurance & Test Matrix

- **Unit & Integration Suite**: **46 / 46 Tests Passing (100% Green)**.
- **20-Cycle Determinism**: Verified 20 consecutive full simulation/reset cycles ending in identical state.
- **Security Headers**: Enforced CSP, X-Frame-Options, X-Content-Type-Options.
- **Sub-Second Performance**: <45ms prediction inference, <80ms counterfactual simulation.

---

## 📚 Complete Documentation Index

| Document | Purpose |
| :--- | :--- |
| [`docs/final-demo-script.md`](docs/final-demo-script.md) | Minute-by-minute live presentation runbook |
| [`docs/final-presentation.md`](docs/final-presentation.md) | 10-slide presentation deck content |
| [`docs/final-technical-faq.md`](docs/final-technical-faq.md) | Deep technical defense for judges & engineers |
| [`docs/final-non-technical-faq.md`](docs/final-non-technical-faq.md) | General audience & citizen overview |
| [`docs/intelligence-validation.md`](docs/intelligence-validation.md) | Mathematical validation & edge-case stress report |
| [`docs/final-test-report.md`](docs/final-test-report.md) | Full 46-test QA matrix & failure recovery table |
| [`docs/architecture.md`](docs/architecture.md) | Complete architectural system specification |
| [`docs/deployment.md`](docs/deployment.md) | Multi-environment deployment & Docker guide |
| [`docs/api.md`](docs/api.md) | Complete REST API endpoint reference |
| [`docs/privacy.md`](docs/privacy.md) | Data governance catalog & privacy principles |
| [`ATTRIBUTION.md`](ATTRIBUTION.md) | Open-source licenses & geographic data credits |

---

## ⚠️ Prototype Limitations

1. **Synthetic Telemetry**: Uses deterministic agent simulation (`DEMO_SEED=20260908`); not connected to live railway/GPS sensor feeds.
2. **Network Coverage**: Covers 30 primary Mumbai corridor nodes and 76 directed edges.
3. **In-Memory Store**: DuckDB runs in-memory (`:memory:`) for instantaneous zero-lock reset.
4. **Map Tiles**: MapLibre map tiles require internet connectivity to OpenFreeMap public tile servers.

---

## 📄 License

Distributed under the [MIT License](LICENSE).
