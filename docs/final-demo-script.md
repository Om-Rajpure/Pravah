# PRAVAAH — Final Demo Script & Presenter Guide
> **Version**: 1.0.0 (Hackathon Final Submission)  
> **Duration**: ~5–6 minutes  
> **Presenter Roles**: Operator Control Room & Public Citizen Experience

---

## 🎬 Minute-by-Minute Presentation Script

### 0:00 – 0:45 | 1. The Real Mumbai Problem & Geographic Intelligence
- **Action**: Open `http://localhost:5173`. Click **Judge Tour** or inspect Overview map.
- **Presenter Dialogue**:
  > "During Ganesh Chaturthi in Mumbai, 10 to 15 million visitors converge on pandals like Lalbaugcha Raja over 10 days. By the time crowds overwhelm transit bottlenecks like Curry Road station, it's too late for reactive policing.
  > 
  > But look at our live map: while South Mumbai and Lalbaug are at 72/100 pressure, eastern buffer zones like Thane and Vashi have over 45% spare capacity. **The city doesn't lack capacity — it lacks distribution.**"
- **Screen Verification**: Overview map displays 11 zones with color-coded pressure tags.

---

### 0:45 – 1:30 | 2. Network-Aware Forecasting (PREDICT)
- **Action**: Click sidebar **Predictions**.
- **Presenter Dialogue**:
  > "PRAVAAH doesn't just show current pressure. Our LightGBM residual model combines physical arrival velocities and platform saturation to predict the future.
  > 
  > Notice Curry Road: currently at 72, but forecast to surge to **94 (CRITICAL)** within 2 hours as evening suburban train arrivals peak."
- **Screen Verification**: Forecast table displays +30m, +60m, +120m, +180m horizons. Curry Road peaks at 94.

---

### 1:30 – 2:30 | 3. Counterfactual Intervention & Impact (RECOMMEND & SIMULATE)
- **Action**: Click sidebar **Actions** $\rightarrow$ Click **Simulate**.
- **Presenter Dialogue**:
  > "How do we stop a disaster before it occurs? PRAVAAH evaluates 25 candidate interventions and calculates the mathematically optimal dosage: **Redirect 18% of inbound Curry Road visitors toward Thane.**
  > 
  > Let's simulate this action. Notice the result: Curry Road pressure drops from **94 down to 76 (-18 pts)**, and critical bottlenecks citywide drop from **3 down to 1**, all without exceeding Thane's buffer threshold."
- **Screen Verification**: In-page impact banner shows simulated net reduction of 18 pts.

---

### 2:30 – 3:30 | 4. Transparent Glass Box Explainability (EXPLAIN)
- **Action**: Scroll down on Actions page or click **Glass Box**.
- **Presenter Dialogue**:
  > "Civic operators cannot trust black-box AI. That is why PRAVAAH is a Glass Box.
  > 
  > The reasoning chain explains every step: Observed Telemetry $\rightarrow$ Ingress Velocity $\rightarrow$ Platform Saturation $\rightarrow$ Network Headroom $\rightarrow$ Optimal Dosage. Every event is recorded in an immutable audit timeline."
- **Screen Verification**: Glass Box panel displays trace stages, model confidence (87%), and decision audit timeline.

---

### 3:30 – 4:30 | 5. What-If Scenario Disruption (SCENARIO)
- **Action**: Click sidebar **Scenarios** $\rightarrow$ Select `central-line-disruption` $\rightarrow$ Click **Simulate What-If**.
- **Presenter Dialogue**:
  > "What if a major crisis strikes? We inject a Central Line track failure.
  > 
  > PRAVAAH immediately closes affected transit edges, triggers a 5-stage causal cascade, marks the old recommendation STALE, and calculates a new disruption-aware alternative."
- **Screen Verification**: 3-Way Scorecard renders Baseline vs. Disruption vs. Disruption + Action.

---

### 4:30 – 5:30 | 6. Citizen Guidance & Strict Privacy (GUIDE & GOVERN)
- **Action**: Switch to **Visitor View** (`/visitor`) $\rightarrow$ Search *Gateway of India* $\rightarrow$ Open **Privacy**.
- **Presenter Dialogue**:
  > "Finally, how does this reach the public? In our mobile-first Visitor View, a traveler heading to Gateway of India (HIGH) is offered Marine Drive (MODERATE) with clear, plain-language reasoning.
  > 
  > And in the Privacy Center, notice: **Zero GPS tracking, zero individual profiling, and K=10 group suppression**. PRAVAAH doesn't need to know who you are to guide you safely through the city."
- **Screen Verification**: Visitor recommendation card renders with plain-language 'Why' bullets; Privacy Center displays data catalog.

---

### 5:30 – 6:00 | 7. Conclusion & Reset
- **Action**: Click **Reset Demo** in the top bar.
- **Presenter Dialogue**:
  > "Most systems only tell you what is happening. PRAVAAH helps cities understand what happens next — and what they can do about it. Thank you."
- **Screen Verification**: Demo resets atomically to clean baseline (Event 1/6).
