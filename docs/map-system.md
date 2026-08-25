# PRAVAAH — Live Crowd Flow & Saturation Map Architecture

**Date**: 2026-08-25  
**Version**: MapLibre GL JS + Carto Positron Raster Integration

---

## 1. Root Cause Analysis of Previous Rendering Issue

1. **React Lifecycle Dependency Loop**: In the previous implementation, `initializeMap` was listed as a dependency in the mount `useEffect`. Because `initializeMap` depended on `setupLayersAndAnimation`, which in turn depended on `mapData`, any asynchronous update to `mapData` from `Overview.jsx` generated a new function reference. This triggered the mount cleanup effect to execute `mapInstance.remove()`, wiping the WebGL canvas, layers, and DOM markers from the DOM.
2. **Solution**:
   - The MapLibre map instance is now created **strictly once** on component mount (`useEffect(..., [])`).
   - A dedicated `useEffect(..., [mapReady, mapData, activeMode, forecastHorizon, whatIfView])` synchronizes layer data via `map.getSource(...).setData(...)` without ever touching or tearing down the map instance.
   - 60 FPS directional flow animation runs continuously via `requestAnimationFrame` on WebGL line-dashoffset.

---

## 2. Visual Architecture & Hierarchy

| Layer | Visual Representation | Data Source |
|-------|-----------------------|-------------|
| **1. Base Map** | Light, low-contrast Carto Positron raster tiles | In-memory style object (`config/map.js`) |
| **2. Saturation Halos** | Radial heat gradients around zone centroids (Teal &lt;50, Yellow 50–69, Orange 70–84, Crimson &ge;85) | `map_service.py` &rarr; `zones` |
| **3. Monitored Network** | Background transit railway lines & arterial roads | `network_service.py` (30 nodes, 76 edges) |
| **4. Crowd Flow Streams** | Directional animated marching dashes (Blue Normal, Orange Heavy, Red Bottleneck, Teal Action) | Synthetic Simulator agent movement vectors |
| **5. Hotspot Badges** | Interactive HTML markers with live pressure & pulsing beacon rings | Top ranked saturation zones |
| **6. Active Bottlenecks** | Callout highlighting converging flow corridors with load percentage (e.g. Curry Road Ingress: 94%) | Simulator accumulation ($\Delta = \text{Inflow} - \text{Outflow}$) |
| **7. Multi-Horizon Forecast** | Translucent prediction halos (+30m, +60m, +120m, +180m) with delta tags ($+18$ pts) | LightGBM ML residual predictor |
| **8. Intervention Stream** | Action Blue/Teal redirection flow from Curry Road &rarr; Dadar &rarr; Thane | Intervention Engine solver |
