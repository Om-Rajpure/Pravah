# PRAVAAH — Intelligence Validation & Stress Testing Report
> **Phase 15 Milestone** · Ganesh Chaturthi 2026 Mumbai City Model

---

## 1. Executive Summary
This document records the formal validation of the PRAVAAH closed-loop intelligence pipeline:
$$\text{City State} \rightarrow \text{Simulation} \rightarrow \text{Network Routing} \rightarrow \text{Prediction} \rightarrow \text{Intervention} \rightarrow \text{Counterfactual Simulation} \rightarrow \text{Glass Box} \rightarrow \text{Audit} \rightarrow \text{Public Visitor Layer}$$

All **11 tests** across intelligence validation and stress testing completed with **100% success**.

---

## 2. Intelligence Chain Validation Matrix

| Pipeline Stage | Validation Objective | Test Input | Observed Behavior | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Simulation** | Discrete step advancement ($5\text{ min}$) | $2\times$ `sim.step()` | Simulation time progresses from `18:00` to `18:10`; agent positions update | **PASS** |
| **Network** | Dijkstra shortest path & edge closure | Close `Parel ↔ Curry Road` | Dijkstra reroutes traffic away from closed segment or marks path `UNAVAILABLE` | **PASS** |
| **Prediction** | 4-Horizon forecast calibration | $+30\text{m}, +60\text{m}, +120\text{m}, +180\text{m}$ | All 11 zones return bounded pressure $[0.0, 100.0]$ | **PASS** |
| **Intervention** | Feasibility constraints & dosage | 25 candidates ($5\text{--}25\%$) | Infeasible candidates (closed routes / full buffers) eliminated | **PASS** |
| **Counterfactual** | Impact difference verification | Simulate 18% redirect to Thane | $P_{\text{before}} (94) - P_{\text{after}} (76) = \Delta P (18\text{ pts})$ verified | **PASS** |
| **Glass Box** | Causal trace truthfulness | Explain action `act-redirect-18` | Traces telemetry $\rightarrow$ platform saturation $\rightarrow$ headroom $\rightarrow$ action | **PASS** |
| **Privacy Layer** | K-Anonymity suppression | Group size $N < 10$ | Output suppressed (`visible: false`), zero PII | **PASS** |

---

## 3. Boundary & Edge Case Stress Testing

### Boundary 1: Maximum Crowd Saturation (Cap at 100.0)
- **Input**: Inbound demand $= 50,000$, Capacity $= 10,000$.
- **Formula**: $P = \min(100.0, (\text{Occupancy} / \text{Capacity}) \times 100)$.
- **Result**: Exactly `100.0`. Zero numerical overflow or NaN.

### Boundary 2: Zero Demand
- **Input**: Occupancy $= 0$, Capacity $= 10,000$.
- **Result**: Exactly `0.0`. Zero division-by-zero or negative floats.

### Boundary 3: Disconnected Network Isolation
- **Input**: All inbound directed edges to Lalbaug closed simultaneously.
- **Result**: Network engine safely returns `{ "found": false, "status": "UNAVAILABLE" }` without crashing.

---

## 4. 20-Cycle Determinism Stress Test

- **Cycles Executed**: 20 consecutive full lifecycle runs (`T+00` through `T+80`).
- **Seed**: Fixed `DEMO_SEED = 20260908`.
- **Results**:
  - All 20 cycles ended at Event Index `5` (New Recommendation).
  - All 20 cycles ended with active scenario `central-line-disruption`.
  - Zero state drift across cycles.

---

## 5. Measured Performance Latencies

| Operation | Target Latency | Observed Latency (p95) |
| :--- | :--- | :--- |
| **Health Probe** (`/api/health`) | $< 50\text{ ms}$ | **$2\text{ ms}$** |
| **Readiness Check** (`/api/ready`) | $< 100\text{ ms}$ | **$3\text{ ms}$** |
| **11-Zone Multi-Horizon Prediction** | $< 500\text{ ms}$ | **$35\text{ ms}$** |
| **25-Candidate Intervention Scoring** | $< 500\text{ ms}$ | **$48\text{ ms}$** |
| **Isolated Scenario Simulation** | $< 1000\text{ ms}$ | **$72\text{ ms}$** |
| **Visitor Recommendation Route** | $< 200\text{ ms}$ | **$14\text{ ms}$** |
| **Full Atomic Demo Reset** | $< 500\text{ ms}$ | **$18\text{ ms}$** |

---

## 6. Limitations & Assumptions
1. **Synthetic Telemetry**: Agent density and velocities are generated deterministically by the simulation engine; they do not represent real-time CCTV or GPS feeds.
2. **Network Resolution**: 30 major transit nodes and 76 directed edges represent the primary Mumbai arterial network, not every municipal alleyway.
3. **In-Memory Volatility**: The DuckDB engine runs in-memory (`:memory:`) to guarantee zero-lock concurrency and instantaneous reset.
