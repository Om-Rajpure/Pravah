# PRAVAAH — Final Presentation Deck Content

---

## Slide 1: Title Slide
- **Title**: PRAVAAH (प्रवाह)
- **Subtitle**: Intelligent Travel Resilience & Civic Orchestration for Mega-Events
- **Context**: Ganesh Chaturthi 2026 — Mumbai
- **Theme**: *Calm Intelligence Controlling a Complex City.*

---

## Slide 2: The Core Problem
- **Headline**: The Crisis of Urban Bottlenecks
- **Key Points**:
  - 10–15M visitors traverse Mumbai over 10 days of Ganesh Chaturthi.
  - Crowds overwhelm specific transit bottlenecks (Curry Road, Parel, Lalbaug).
  - Traditional policing is reactive: intervention begins only after crushing occurs.
- **The Core Insight**: *The city has capacity. The problem is distribution.*

---

## Slide 3: The PRAVAAH Solution
- **Headline**: Closed-Loop Intelligent Orchestration
- **Key Workflow**:
  - **SEE**: Real-time crowd pressure across 11 monitored zones.
  - **PREDICT**: Network-aware forecasts up to 3 hours ahead.
  - **RECOMMEND**: Counterfactually tested flow redirection dosages.
  - **SIMULATE**: In-page proof before real-world operational execution.
  - **EXPLAIN**: Transparent Glass Box causal reasoning and audit lineage.
  - **GUIDE**: Privacy-safe, mobile-first public guidance.

---

## Slide 4: Real Mumbai Geographic Intelligence
- **Headline**: Mumbai as a Connected Transit Graph
- **Architecture**:
  - 30 nodes (suburban stations, buffer zones, pandals).
  - 76 directed edges (Suburban rail, arterial roads, walking corridors).
  - Dijkstra shortest-path calculation with capacity constraints.
  - OpenFreeMap & MapLibre GL JS integration.

---

## Slide 5: Network-Aware Forecasting Engine
- **Headline**: From "What Is Happening?" to "What Happens Next?"
- **Model Design**:
  - Physics-based platform clearance baseline + Dijkstra graph propagation.
  - LightGBM gradient-boosted residual model (`pravaah-prediction-v1`).
  - Accuracy: **MAE: 1.026, RMSE: 1.274**.
  - Multi-Horizon planning: +30m, +60m, +120m, +180m.

---

## Slide 6: Counterfactual Intervention Engine
- **Headline**: Testing Interventions Before Taking Action
- **Optimization**:
  - Evaluates 25 candidate dosages across 5 relief destinations (Thane, Vashi, etc.).
  - Simulates flow transfer without modifying live state.
  - **Demonstrated Result**: Curry Road pressure drops **94 $\rightarrow$ 76 (-18 pts)**; citywide critical zones reduce from **3 $\rightarrow$ 1**.

---

## Slide 7: What-If Scenario Injector
- **Headline**: Resilience Under Transit Failures & Weather
- **Scenarios**:
  - Central Line Rail Disruption, Heavy Coastal Rain, Major Road Closure.
  - 5-stage causal cascade: `TRIGGER → NETWORK → FLOW → PRESSURE → RESPONSE`.
  - Dynamic rerouting and automatic stale-recommendation invalidation.

---

## Slide 8: Glass Box Trust & Explainability
- **Headline**: Verifiable, Causal AI for Civic Operators
- **Features**:
  - Step-by-step causal trace stages.
  - Plain-language ML feature drivers (e.g. "Platform saturation exceeding 80%").
  - Model confidence scoring and explicit operational assumptions.
  - Immutable decision audit trail.

---

## Slide 9: Citizen Guidance & Privacy-by-Design
- **Headline**: Guidance Without Surveillance
- **Privacy Protections**:
  - **Zero GPS Tracking**: No device IDs, personal trajectories, or biometric data.
  - **K-Anonymity ($K=10$)**: Groups below 10 individuals are suppressed.
  - **Public-Safe Serialization**: Strips operator parameters, dosage percentages, and raw model features.
  - Alternative suggestions (Gateway of India $\rightarrow$ Marine Drive).

---

## Slide 10: Summary & Impact
- **Headline**: Scalable Civic Resilience
- **Key Metrics**:
  - 100% Deterministic Reproducibility (`DEMO_SEED=20260908`).
  - Sub-second latency: <45ms prediction, <80ms simulation.
  - Zero-lock DuckDB in-memory engine.
- **Closing Statement**:
  > *"Most systems tell you what is happening. PRAVAAH helps cities understand what happens next — and what they can do about it."*
