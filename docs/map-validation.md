# PRAVAAH — Map Validation Report

**Phase 18 · Map Reliability Fix**  
Generated: 2026-08-25

---

## Root Cause Analysis — Original P0 Failure

| # | Root Cause | Evidence | Fix Applied |
|---|------------|----------|-------------|
| 1 | **Map container had no explicit height** | `div ref={mapContainerRef} className="w-full h-full"` — `h-full` resolves to 0 when no explicit height is set on the parent chain | Container now uses `absolute inset-0` to fill the positioned parent |
| 2 | **Unreliable tile provider** | OpenFreeMap `tiles.openfreemap.org` is community-hosted and may be unavailable during a demo | Switched primary to **Carto Positron** (`basemaps.cartocdn.com`) — no API key, industry-grade CDN |
| 3 | **`onMapReady` in `useCallback` deps** | If the parent component doesn't memoize `onMapReady`, the callback reference changes on each render, causing `useEffect` to re-run and the map to be destroyed/re-created in a loop | `onMapReady` moved to a `useRef` — no longer a `useCallback` dependency |
| 4 | **Error handler triggering on non-fatal tile notices** | MapLibre fires `'error'` events for tile 404s, CORS warnings, and network timeouts — not just initialization failures | Error state now only activates on HTTP 401 (auth failure); all other notices are logged silently |

---

## Fix Summary

### `MumbaiMap.jsx` Changes
```
BEFORE: <div ref={mapContainerRef} className="w-full h-full" />
AFTER:  <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
```
The outer wrapper uses `relative` positioning with `minHeight: '380px'`, so `absolute inset-0` gives the canvas container real pixel dimensions.

### `config/map.js` — Tile Provider
```
BEFORE: PRIMARY = tiles.openfreemap.org/styles/positron
AFTER:  PRIMARY = basemaps.cartocdn.com/gl/positron-gl-style/style.json
```
Carto Positron is the same clean, light basemap style used by major production apps (Grab, Citymapper, etc.). No registration required.

---

## Map States

| State | Trigger | Visual |
|-------|---------|--------|
| `loading` | Initialization started | Navy overlay + spinner + "Loading Mumbai Map" |
| `ready` | `map.on('load')` fires | Canvas visible, MapControls rendered |
| `error` | HTTP 401 / init exception | Error card + Retry button |

---

## Map Overlay Validation

| Overlay | Page | Status |
|---------|------|--------|
| Pressure heatmap | Live City | ✅ Renders via `addSource` + `fill` layer |
| Transport network | Mobility | ✅ Renders via `line` + `circle` layers |
| Scenario impact | Scenarios | ✅ Renders via choropleth `fill` |
| Intervention markers | Actions | ✅ Renders via `symbol` + `circle` layers |

---

## Verified Survival Tests

| Test | Result |
|------|--------|
| Page navigation away and back | ✅ Map re-mounts cleanly |
| Sidebar collapse → layout shift | ✅ ResizeObserver triggers `map.resize()` |
| Demo reset | ✅ Map survives (not destroyed on `demoKey` change since MumbaiMap isn't a child of `<Outlet>`) |
| Mobile viewport (390px) | ✅ `absolute inset-0` fills correctly |
| `interactive=false` prop | ✅ Passed through to MapLibre |

---

## CSP Verification

Backend CSP header:
```
connect-src 'self' http: https: ws: wss:;
img-src 'self' data: https: blob:;
```

Carto tile/style requests go to `https://basemaps.cartocdn.com` — covered by `connect-src https:` and `img-src https:`.

**No CSP blocking on tile requests.**
