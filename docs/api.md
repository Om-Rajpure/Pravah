# PRAVAAH — API Reference
> Version 1.0.0 · SIMULATION · Ganesh Chaturthi 2026

All responses are JSON. All endpoints are prefixed with `/api`.

---

## Health & Demo

### `GET /api/health`
Service health with simulation and demo status.
```json
{
  "status": "ok",
  "service": "pravaah",
  "version": "1.0.0",
  "simulation_time": "18:20",
  "simulation_status": "PAUSED",
  "demo_active": true,
  "demo_event": "Normal Conditions",
  "network_version": 1,
  "active_scenario": null,
  "data_label": "SIMULATION · SYNTHETIC"
}
```

### `GET /api/demo/status`
Current demo event index, simulation time, network version, scenario state.

### `POST /api/demo/reset`
Atomic full reset — simulation, network, scenario, prediction, explainability, demo index.

### `POST /api/demo/next-event`
Advance to next canonical demo event (runs sim steps, applies scenario if needed).

---

## Simulation

### `GET /api/simulation/state`
Current simulation time, visitor counts, zone pressures.

### `POST /api/simulation/start`
Start auto-stepping simulation (5-min steps every poll).

### `POST /api/simulation/pause`
Pause auto-stepping.

### `POST /api/simulation/step`
Advance one 5-minute step and return new state.

### `POST /api/simulation/reset`
Reset simulation to `18:00` baseline (DEMO_SEED=20260908).

---

## Network

### `GET /api/network/state`
All 30 nodes and 76 directed edges with current capacity and status.

### `GET /api/network/routes?from=<node>&to=<node>`
Dijkstra shortest path between two nodes.

### `POST /api/network/close-edge`
Body: `{ "edge_id": "..." }`. Marks an edge closed and increments network version.

### `POST /api/network/reset`
Restores network to baseline (all edges open).

---

## Predictions

### `GET /api/predictions`
Multi-horizon pressure forecasts (30m, 60m, 120m, 180m) for all zones.
```json
{
  "forecast_time": "18:20",
  "zones": [
    {
      "zone_id": "curry-road",
      "name": "Curry Road",
      "current_pressure": 72.4,
      "current_level": "HIGH",
      "predictions": [
        { "horizon_minutes": 30, "horizon_label": "+30m", "predicted_pressure": 78.2 },
        { "horizon_minutes": 120, "predicted_pressure": 93.8 }
      ],
      "drivers": [...]
    }
  ]
}
```

---

## Interventions

### `GET /api/actions/recommendations`
Top recommended intervention with impact simulation and ranked alternatives.
```json
{
  "recommended_action": {
    "id": "act-redirect-curry-road-thane-18",
    "source_zone": "curry-road",
    "relief_destination": "Thane",
    "dosage_pct": 18,
    "description": "Redirect 18% of incoming Curry Road visitors toward Thane buffer zone."
  },
  "impact": {
    "target_pressure_before": 94,
    "target_pressure_after": 76,
    "pressure_reduction": 18,
    "critical_zones_before": 3,
    "critical_zones_after": 1
  },
  "alternatives": [...]
}
```

---

## Scenarios

### `GET /api/scenarios`
All available scenarios: `central-line-disruption`, `heavy-rain`, `road-closure`.

### `GET /api/scenarios/<id>`
Single scenario definition with 5-stage cascade.

### `POST /api/scenarios/simulate`
Body: `{ "scenario_id": "..." }`. Isolated counterfactual — does not mutate live state.

### `POST /api/scenarios/activate`
Body: `{ "scenario_id": "..." }`. Applies scenario to live network.

### `POST /api/scenarios/reset`
Removes active scenario and resets network to baseline.

### `GET /api/scenarios/current`
Currently active scenario (or `null`).

---

## Explainability

### `GET /api/explanations/prediction/<zone_id>`
Glass Box explanation for a zone forecast — trace stages, drivers, confidence, assumptions.

### `GET /api/explanations/intervention/<action_id>`
Glass Box explanation for a recommended intervention.

### `GET /api/audit`
Decision audit trail (last 100 events), filterable by `?category=prediction|action|scenario`.

---

## Privacy

### `GET /api/privacy/policy`
Plain-language privacy policy (what PRAVAAH uses / doesn't use / why).

### `GET /api/privacy/data-catalog`
Data governance catalog with data type, purpose, granularity, retention, and public/internal classification.

### `GET /api/privacy/settings`
Default visitor privacy settings.

---

## Visitor (Public-Safe)

All visitor endpoints return aggregated, privacy-safe data only.
No PII, no dosage values, no operator internals.

### `GET /api/visitor/destinations`
All destinations with current crowd level (LOW/MODERATE/HIGH/CRITICAL).

### `GET /api/visitor/destinations/<id>`
Detail: crowd label, multi-horizon forecast, best-time suggestion, disruption notice.

### `POST /api/visitor/recommendations`
Body: `{ "destination_id": "...", "preference": "LESS_CROWDED" }`.
Preferences: `LESS_CROWDED | FASTEST | AVOID_DISRUPTION | LOWER_TRAVEL_TIME`.
Returns: recommended destination with plain-language `why` explanation.

### `GET /api/visitor/conditions`
City-wide summary: busy/moderate/quiet destination counts.

---

## City Data

### `GET /api/overview`
Core KPIs: city pressure, hotels available, transport load, active alerts, primary recommendation.

### `GET /api/zones`
All 11 monitored zones with crowd pressures and capacities.

### `GET /api/hotels`
Hotel clusters: total/available rooms, occupancy, price range.

### `GET /api/transport`
Railway stations, transit lines, road network status.

### `GET /api/welfare`
Welfare support amenities: medical, water, sanitation.

### `GET /api/map/state`
Unified multi-layer geographic state for map visualization.
