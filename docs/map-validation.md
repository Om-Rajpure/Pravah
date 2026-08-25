# PRAVAAH — Map Validation & QA Report

**Date**: 2026-08-25  
**Component**: Live Spatial Intelligence Canvas (`MumbaiMap.jsx`)

---

## 1. Test Matrix & Results

| Test ID | Test Scenario | Expected Outcome | Actual Result | Status |
|---------|---------------|------------------|---------------|--------|
| **MAP-01** | Sub-second Canvas Initialization | Map loads canvas in &lt; 2 seconds without hanging spinner | Initialized in &lt; 300ms using inline raster style | **PASS** |
| **MAP-02** | Current Pressure Mode | Displays 11 calibrated zone polygons with numeric values and status colors | Correctly colored (Teal, Amber, Orange, Red) | **PASS** |
| **MAP-03** | Multi-Horizon Forecast Mode | Temporal slider (+30m, +60m, +120m, +180m) updates predicted pressure deltas | Dynamic delta labels and hotspot halos rendered | **PASS** |
| **MAP-04** | Infrastructure Network Mode | Renders Central, Western, and Harbour transit lines + stations | Accurate NetworkX graph topology displayed | **PASS** |
| **MAP-05** | Disruption Mode Overlay | `central-line-disruption` displays bold red dashed line and warning badge | Disrupted rail segment highlighted with capacity notice | **PASS** |
| **MAP-06** | Intervention Action Mode | Displays recommended Curry Road &rarr; Thane redirection flow | Orange dashed flow corridor with 18% dosage callout | **PASS** |
| **MAP-07** | Counterfactual What-If Mode | Before vs After toggle compares baseline (94) vs relief (76) | Before/After toggle transitions pressure values instantly | **PASS** |
| **MAP-08** | Interactive Zone Inspection | Clicking zone opens details popup with live metrics and CTA | Responsive popup displayed at clicked feature | **PASS** |
| **MAP-09** | Demo Mode Sync | Demo events advance active map modes and camera focus | Synchronized with 6-event timeline | **PASS** |
| **MAP-10** | Mobile Viewports (320px–430px) | Controls wrap cleanly, touch zoom/pan responsive | Zero overflow, compact segmented buttons | **PASS** |
| **MAP-11** | Error & Teardown Recovery | Network disconnect shows graceful retry modal | Clean teardown without memory leaks | **PASS** |
