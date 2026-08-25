# PRAVAAH — Final Technical FAQ (Judges & Engineers)

### 1. How is the prediction model trained and structured?
PRAVAAH uses a hybrid residual forecasting architecture:
- **Baseline Physics Layer**: Calculates arrival rates vs. platform clearance rates per zone based on network connectivity and time-of-day arrival curves.
- **Graph Propagation Layer**: Propagates flows over our 30-node, 76-edge NetworkX graph using Dijkstra routing.
- **LightGBM Residual Model**: Corrects non-linear residuals using platform saturation ratios, adjacent edge loads, and hour-of-day peak windows.
- **Performance**: MAE = 1.026, RMSE = 1.274. Inference latency < 45ms.

### 2. How are counterfactual interventions evaluated without side effects?
- When evaluating interventions, the engine generates an isolated copy of the current agent population and network graph.
- It applies the candidate dosage (e.g. 18% redirection to Thane) and simulates forward $N$ discrete steps.
- The resulting zone pressure $P_{\text{simulated}}$ is calculated and scored against a multi-objective loss function.
- The live simulator state is untouched until an operator explicitly approves the intervention.

### 3. How does PRAVAAH guarantee deterministic reproducibility?
- The platform uses a central random seed: `DEMO_SEED = 20260908`.
- NumPy RNG, agent behavioral distribution, and initial zone allocations are seeded deterministically.
- `POST /api/demo/reset` clears all scenario overlays, resets the network to version 1, and restores the simulation clock to 18:00.

### 4. What is the database architecture?
- In-memory **DuckDB** relational database with 11 core tables (`zones`, `stations`, `lines`, `hotels`, `welfare_amenities`, etc.).
- Offers sub-5ms query response times, zero file-locking overhead, and instantaneous atomic reset capabilities.

### 5. How are privacy and K-Anonymity enforced in code?
- The `privacy_service.py` applies a minimum threshold ($K=10$). If any aggregate group has $<10$ individuals, `{ "visible": false }` is returned.
- Public serializers (`to_public_destination_state`, `to_public_recommendation`) enforce a strict data boundary by stripping all operator-only parameters (`dosage_pct`, `edge_id`, model weights, and audit IDs).

### 6. Why not use an LLM for crowd control?
- LLMs are probabilistic language models that cannot guarantee deterministic physics simulations, enforce graph capacity constraints, or evaluate exact mathematical deltas.
- PRAVAAH uses structured graph algorithms and gradient-boosted decision trees to ensure that every metric is mathematically verifiable.
