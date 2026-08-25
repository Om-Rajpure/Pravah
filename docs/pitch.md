# PRAVAAH — Hackathon Pitch & Presentation Script

> **Product**: PRAVAAH (प्रवाह)  
> **Tagline**: Calm Intelligence Controlling a Complex City.  
> **Context**: Mega-Event Hospitality & Transit Orchestration (Ganesh Chaturthi 2026 — Mumbai)  
> **Core Insight**: *The city has capacity. The problem is distribution.*

---

## ⏱️ Part 1: The 2-Minute Elevator Pitch

### Hook (0:00 – 0:30)
"During Ganesh Chaturthi, 10 to 15 million people move through Mumbai over 10 days. On peak immersion days, iconic transit stations like Curry Road and Parel become paralyzed.

Why? Because traditional city management is reactive. By the time cameras see a crowd crush, or social media reports a bottleneck, the transit cascade has already spread.

Yet, just 25 minutes away in Thane and Vashi, hotels and transit corridors sit with 45% spare capacity. **The city doesn’t lack capacity — it lacks distribution.**"

### Solution (0:30 – 1:15)
"That is why we built **PRAVAAH**.

PRAVAAH models the entire city of Mumbai as a dynamic, connected transit network with 30 nodes and 76 directed multimodal edges.

1. **SEE**: We observe real-time crowd pressure across 11 monitored zones.
2. **PREDICT**: Our LightGBM prediction model forecasts pressure spikes up to 3 hours ahead with an MAE of 1.026.
3. **RECOMMEND**: When Curry Road is predicted to hit 94% critical saturation, PRAVAAH counterfactually evaluates 25 intervention candidates and recommends the exact mathematical dosage: *Redirect 18% of incoming flow toward Thane.*
4. **SIMULATE**: Before taking any real-world action, operators run an in-page counterfactual simulation — proving pressure drops from 94 down to 76, and critical bottlenecks drop from 3 to 1."

### Impact & Trust (1:15 – 2:00)
"Crucially, PRAVAAH is a **Glass Box**. Every recommendation provides an audited causal trace, feature drivers, and explicit confidence scores.

And for citizens, PRAVAAH turns this intelligence into a privacy-first mobile guide: no GPS tracking, no biometric surveillance, and K-anonymity suppression.

PRAVAAH isn't a chatbot or a static dashboard — it is closed-loop civic resilience."

---

## 🎬 Part 2: The 5-Minute Live Demo Script

| Time | Stage | Action on Screen | Speaker Script |
| :--- | :--- | :--- | :--- |
| **0:00** | **Intro** | Open `http://localhost:5173` | *"Welcome to PRAVAAH. We are looking at the live Operator Control Room for Day 9 of Ganesh Chaturthi in Mumbai."* |
| **0:45** | **1. SEE** | Overview Map | *"Here on our MapLibre canvas, you see real Mumbai geography. Lalbaug and Curry Road are in the Warning band (72/100), while eastern buffers in Thane and Vashi are underutilized."* |
| **1:30** | **2. PREDICT** | Predictions Page | *"Let’s look ahead. Our network-aware prediction engine forecasts that within 2 hours, inbound arrivals will overwhelm Curry Road platform capacity, driving pressure to 94/100 (CRITICAL)."* |
| **2:15** | **3. RECOMMEND** | Actions Page | *"Instead of waiting for a bottleneck, PRAVAAH calculates an intervention: Redirect 18% of incoming flow to Thane/Vashi. Let's click 'Simulate'. In real-time, we see Curry Road drops from 94 to 76 (-18 pts), eliminating 2 citywide bottlenecks."* |
| **3:00** | **4. EXPLAIN** | Glass Box Page | *"Why 18%? Why Thane? The Glass Box panel explains: platform saturation exceeded 80%, while Eastern Freeway transit edges had 52% spare headroom. We have a complete decision audit trail."* |
| **3:45** | **5. WHAT-IF** | Scenarios Page | *"Now let's test city resilience. What if a heavy rainstorm or track failure hits the Central Railway? We inject the 'Central Line Disruption'. The transit graph closes key edges, previous recommendations become STALE, and PRAVAAH dynamically recomputes new safe alternatives."* |
| **4:30** | **6. GUIDE & PRIVACY** | Visitor View (`/visitor`) | *"Finally, how does the public benefit? A visitor heading to Gateway of India sees high crowd alerts and receives a calm, alternative route to Marine Drive. In the Privacy Center, notice: zero GPS tracking, K=10 group suppression, and strict purpose limitation."* |
| **5:00** | **Close** | Reset Demo | *"PRAVAAH proves that with network-aware prediction, counterfactual simulation, and privacy-by-design, cities can turn crowd chaos into fluid movement. Thank you."* |

---

## 🏆 Key Takeaways for Judges

1. **Deterministic & Verifiable**: Every demo run is 100% reproducible with `DEMO_SEED=20260908`.
2. **True Counterfactual Simulation**: Interventions are mathematically tested through discrete-time agent simulations before recommendation.
3. **No Black-Box Hallucination**: Every decision is supported by LightGBM model weights, Dijkstra network paths, and DuckDB tabular state.
4. **Privacy-by-Design**: Operates strictly on aggregated zone telemetry — proves that civic resilience does NOT require individual surveillance.
