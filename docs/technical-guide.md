# PRAVAAH — Technical Guide

> For hackathon judges and technical reviewers.

---

## 1. What Problem Does PRAVAAH Solve?

Ganesh Chaturthi attracts 10–15 million visitors to Mumbai over 10 days.
Certain destinations (Lalbaugcha Raja, Girgaon Chowpatty) attract 1–2 million visitors on peak days.
The pressure is not uniform — it concentrates in specific corridor nodes.

**The city has capacity. The problem is distribution.**

PRAVAAH models how crowd pressure propagates across the city network and recommends flow interventions before bottlenecks become crises.

---

## 2. Simulation Engine (Phase 5)

- **10,000 synthetic visitors** initialized with behavioral profiles (Local, Outstation, Family, Young, Low Budget, High Budget).
- **Deterministic seed**: `DEMO_SEED = 20260908`. Every reset produces identical behavior.
- **5-minute discrete time steps**. At each step: visitors move between zones based on travel time, zone attractiveness, and network availability.
- **Zone pressure** = `(current_occupancy / capacity) × 100`. Capped at 100.
- Arrival and departure rates are calibrated to real Ganesh Chaturthi crowd patterns (peak 18:00–22:00).

---

## 3. Network Model (Phase 6)

- **30 nodes**: Railway stations, key locations, buffer zones.
- **76 directed edges**: Subway lines (Central, Western, Harbour), arterial roads, walking corridors.
- **NetworkX DiGraph** with edge weights representing travel time (minutes).
- **Dijkstra routing** for shortest-path recommendations.
- **Network versioning**: `network.version` increments on every `close_edge()`. Predictions reference the version they were generated against.
- **Scenario overlays**: Scenario closures are applied as an overlay on the base graph. `network.reset()` removes overlays cleanly.

---

## 4. Prediction Engine (Phase 7)

Three-component pipeline:

1. **Physics-based baseline**: Uses arrival velocity, zone capacity, and travel time to extrapolate pressure forward.
2. **Network propagation**: Dijkstra routes show which upstream/downstream zones will be affected.
3. **LightGBM residual correction**: A trained model (`pravaah-prediction-v1`, MAE: 1.026, RMSE: 1.274) corrects baseline error using features like platform saturation, historical hour-of-day patterns, and network edge load.

**Horizons**: 30m, 60m, 120m, 180m.

If the model artifact is not found, the engine falls back gracefully to the network baseline.

---

## 5. Intervention Engine (Phase 8)

1. **Candidate generation**: For each relief destination (Thane, Vashi, Bandra, Andheri, Dadar) and 6 dosage levels (5–25%), a candidate action is created.
2. **Constraint filtering**: Candidates are eliminated if the corridor is closed or the relief destination has insufficient spare capacity.
3. **Counterfactual simulation**: Each surviving candidate is simulated without mutating live state. The simulator runs forward N steps with the redirected flow and reports the resulting pressure.
4. **Multi-objective scoring**: Weighted combination of target pressure reduction, side-effect on relief zone, and corridor viability.
5. **Recommendation**: Top-scored candidate is returned as the primary recommendation.

---

## 6. Scenario Engine (Phase 9)

Three built-in scenarios:
- **Central Line Disruption**: Closes key Central Railway edges; cascade: TRIGGER → NETWORK → FLOW → PRESSURE → RESPONSE.
- **Heavy Rain**: Degrades road and walking corridors; affects coastal destinations.
- **Road Closure**: Closes arterial road edges; increases travel times.

Scenarios run as **isolated counterfactuals** via `simulate_scenario()` (no live state mutation) or applied to live state via `activate_scenario()`.

**3-way scorecard**: Baseline pressure / Disruption pressure / Disruption + Best Action.

---

## 7. Glass Box Explainability (Phase 10)

Every PRAVAAH decision produces a `DecisionExplanation`:

- **Trace stages**: Current State → Signals → Network Effect → Capacity → Forecast → Recommendation.
- **Plain-language drivers**: Each LightGBM feature contribution is translated to a human-readable driver (e.g. "Platform approaching saturation" not "platform_load_pct = 0.87").
- **Confidence**: Model MAE/RMSE used to calculate a confidence label (HIGH/MODERATE/LOW).
- **Assumptions**: Explicitly stated (e.g. "Current corridor availability assumed unchanged").
- **Versions**: Every explanation references `simulation_version`, `network_version`, `scenario_version`.

**Audit trail**: Immutable chronological log of all decisions. Each event has a `parent_decision_id` for lineage tracing.

---

## 8. Privacy Layer (Phase 11)

**K-Anonymity**: Groups below K=10 visitors are suppressed.

**Public-Safe Serializers**: Internal pressure float `73.82` → public label `"HIGH"`. Internal edge status `"CLOSED"` → public label `"DISRUPTED"`. No raw model features, edge IDs, or visitor IDs in public responses.

**Visitor/Operator boundary**: Separate API namespaces (`/api/visitor/*` vs `/api/actions/*`). Visitor components never call operator endpoints.

**Optional Location**: Toggled OFF by default. Neighbourhood-level only. Session-scoped, not persisted.

**Data types**: Zone pressure (aggregated), network status (translated), synthetic movements (NOT public), visitor location (NOT persisted).

---

## 9. State Versioning

| Service | Version Field |
|---|---|
| Simulation | `sim_state['step']` |
| Network | `network.version` (increments on edge close) |
| Prediction | References `network_version` at generation time |
| Scenario | `scenario_engine.get_current_scenario()['active_since']` |
| Explainability | `versions` dict on every `DecisionExplanation` |

When network version changes: prediction cache is cleared so next request regenerates fresh.

---

## 10. Determinism

`DEMO_SEED = 20260908` is used as the NumPy random seed for:
- Visitor behavioral profile assignment
- Initial zone distribution
- Arrival rate jitter

Every `simulation.reset()` call restores the NumPy RNG to this seed. Any sequence of steps from the same initial state produces identical outputs.

This makes the demo reliably reproducible.

---

## 11. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router v6 |
| Icons | Lucide React |
| Charts | Recharts |
| Map | MapLibre GL JS + OpenFreeMap tiles |
| HTTP client | Axios |
| Backend | Flask (Python 3.10+) |
| CORS | Flask-CORS |
| Database | DuckDB (in-memory) |
| Graph | NetworkX (DiGraph, Dijkstra) |
| Simulation | Custom discrete-time agent sim (NumPy) |
| ML Model | LightGBM (residual correction) |
| Serialization | JSON (Python dataclasses + dict) |

---

## 12. Why Not Just Use an LLM?

PRAVAAH requires:
1. **Deterministic simulation**: An LLM cannot simulate 10,000 agents through a network graph deterministically.
2. **Measurable counterfactual**: Impact must be a number (`94 → 76`), not a prediction.
3. **Verifiable reasoning**: Glass Box traces must reference actual model outputs, not generated text.
4. **Privacy-safe aggregation**: k-anonymity and public-safe serialization are engineering decisions, not language generation.
5. **Network-aware routing**: Dijkstra over a real edge graph cannot be replaced by language inference.

LLM-generated text could be added for richer explanations in future work — but the intelligence must be grounded in the simulation and network state, not hallucinated.

---

## 13. Known Limitations

1. **Synthetic data only**: No live sensor integration (GPS, railway APIs, CCTV). All visitor movements are modelled.
2. **30 nodes / 76 edges**: Represents key corridors only, not the full Mumbai network.
3. **No authentication**: The prototype does not implement operator login or access control.
4. **Single-process**: DuckDB in-memory means state is lost on server restart.
5. **Map tiles require internet**: MapLibre uses OpenFreeMap public tiles. Offline map cache not implemented.
6. **Frontend chunk size**: The production bundle is ~2.4MB uncompressed (589KB gzip). Code-splitting would reduce initial load.
7. **Not production-hardened**: Rate limiting, persistent logging, and HA clustering are not implemented.
