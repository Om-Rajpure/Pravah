# PRAVAAH — Technical Architecture Specification

---

## 1. System Architecture Overview

```
                      +--------------------------------------------------+
                      |                 PRAVAAH PLATFORM                 |
                      +-------------------------+------------------------+
                                                |
                       +------------------------+------------------------+
                       |                                                 |
                       v                                                 v
           [ OPERATOR CONTROL ROOM ]                           [ VISITOR EXPERIENCE ]
           • Interactive MapLibre Centerpiece                  • Destination Search & Filters
           • Real-time Telemetry & Risk KPIs                   • Multi-Horizon Crowd Levels
           • Multi-Horizon Forecast Charts                     • Disruption-Aware Routing
           • Counterfactual Simulation Execution               • Plain-Language 'Why' Guidance
           • Glass Box Reasoning & Audit Trail                 • Privacy Center & Governance
                       |                                                 |
                       +------------------------+------------------------+
                                                |
                                                v
                                [ BACKEND INTELLIGENCE CORE ]
                                                |
                       +------------------------+------------------------+
                       |                        |                        |
                       v                        v                        v
            (1) DYNAMIC SIMULATOR     (2) NETWORK GRAPH ENGINE   (3) PREDICTION ENGINE
            • 10k synthetic agents     • 30 Nodes / 76 Edges      • Hybrid LightGBM ML
            • 5-min discrete steps     • Dijkstra Shortest Path   • 4 Horizons (30-180m)
            • DEMO_SEED: 20260908      • Versioned Edge Closure   • MAE: 1.026, RMSE: 1.274
                       |                        |                        |
                       +------------------------+------------------------+
                                                |
                                                v
            +-----------------------------------+-----------------------------------+
            |                                   |                                   |
            v                                   v                                   v
   (4) INTERVENTION ENGINE             (5) SCENARIO INJECTOR              (6) GLASS BOX & AUDIT
   • 25 candidate evaluations          • 5-stage causal cascades          • Causal trace stages
   • Counterfactual simulation         • 3-way scorecards                 • Feature driver translation
   • Multi-objective loss scoring      • Isolated counterfactuals         • Immutable audit lineage
            |                                   |                                   |
            +-----------------------------------+-----------------------------------+
                                                |
                                                v
                                      (7) PRIVACY GOVERNANCE
                                      • K-Anonymity (K=10 Suppression)
                                      • Public-Safe Quantization Serializers
                                      • Zero GPS / Zero PII Storage
                                                |
                                                v
                                      (8) STORAGE & DEPLOYMENT
                                      • In-Memory DuckDB (Sub-5ms queries)
                                      • Gunicorn WSGI + Multi-stage Nginx
```

---

## 2. Intelligence Chain Description

1. **Simulation Engine (`simulator.py`)**: Runs agent-based discrete-time state transitions at 5-minute ticks across 11 monitored zones.
2. **Network Model (`network_service.py`)**: Builds directed transit graph with travel times and capacities, computing optimal paths via NetworkX Dijkstra.
3. **Prediction Engine (`prediction_service.py`)**: Combines physics flow baselines with a trained LightGBM residual model across 4 planning horizons (+30m, +60m, +120m, +180m).
4. **Intervention Engine (`intervention_service.py`)**: Generates 25 candidate dosages, filters out constrained corridors, runs counterfactual simulations, and scores actions.
5. **Scenario Injector (`scenario_service.py`)**: Injects disruptions as graph overlays and calculates 5-stage causal cascades (`TRIGGER → NETWORK → FLOW → PRESSURE → RESPONSE`).
6. **Glass Box Engine (`explainability_service.py`)**: Explains recommendations through plain-language causal traces and records immutable decision lineage.
7. **Privacy Layer (`privacy_service.py`)**: Implements K-Anonymity ($K=10$), quantizes raw floats into visitor labels (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`), and strips operator parameters.
8. **Storage Layer (`data/db.py`)**: DuckDB in-memory database with 11 relational tables providing zero-lock sub-5ms queries.
