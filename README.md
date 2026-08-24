# PRAVAAH (प्रवाह) — Real-Time City Flow & Mobility Intelligence Platform

> **Calm intelligence controlling a complex city.**  
> Built for large-scale mega-event operations and urban crowd intelligence, calibrated to Mumbai during Ganesh Chaturthi.

---

## 🏛️ Overview

**PRAVAAH** is a city operations and mobility intelligence platform designed for municipal authorities, event control rooms, transit operators, and hospitality coordinators. Instead of presenting generic SaaS metrics or glowing cyber dashboards, PRAVAAH brings together real geographic constraints, multimodal transit loads, hotel occupancy distribution, and deterministic crowd modeling to recommend calm, actionable urban interventions.

---

## 🎨 Visual Identity & Design System

PRAVAAH employs an architectural, operations-grade color system designed for prolonged control-room monitoring without eye fatigue:

| Token | Hex | Usage |
| :--- | :--- | :--- |
| **Warm Stone** | `#F5F2EC` | Primary application canvas |
| **Soft Ivory** | `#FBFAF7` | Primary surface, operational cards & panels |
| **Secondary Surface** | `#ECE8E0` | Filters, inactive controls, table headers |
| **Dark Graphite** | `#292827` | Headings, primary metrics, high-priority text, sidebar canvas |
| **Secondary Text** | `#6B6761` | Descriptions, metadata, timestamps |
| **Terracotta / Rust** | `#B85C3E` | Primary brand accent, recommendations, highlights |
| **Dark Terracotta** | `#91452F` | Hover states, recommendation headings |
| **Light Terracotta** | `#E8C9BC` | Action preview badges, selected areas |
| **Very Light Terracotta**| `#F4E7E1` | Recommendation card backgrounds |
| **Muted Slate** | `#536873` | Transit network, railway lines, road infrastructure |
| **Semantic Critical** | `#A94338` | Severe crowd pressure (≥85%), critical alerts |
| **Semantic Warning** | `#B8893D` | Moderate crowd pressure (50–69%) |
| **Semantic Low** | `#52755F` | Spare capacity, healthy status (<50%) |

---

## 📦 Project Architecture

```
pravaah/
├── backend/
│   ├── app.py                  # Flask Application Factory & Blueprint Registration
│   ├── config.py               # Central configuration & DEMO_SEED
│   ├── validation.py           # Data integrity & boundary validation suite
│   ├── requirements.txt        # Python dependencies (Flask, DuckDB, Flask-CORS)
│   ├── data/
│   │   ├── schema.py           # DuckDB DDL schemas (11 relational tables)
│   │   ├── seed.py             # Deterministic Mumbai synthetic data generator
│   │   └── db.py               # DuckDB connection & initialization manager
│   ├── services/
│   │   ├── city_service.py     # System KPIs, alerts, recommendation engine
│   │   ├── zone_service.py     # Multi-zone analytics & drilldowns
│   │   ├── hotel_service.py    # Accommodation clusters & occupancy stats
│   │   ├── transport_service.py# Railway stations, lines, & road network
│   │   ├── welfare_service.py  # Civic support amenities (water, medical, etc.)
│   │   └── map_service.py      # Unified multi-layer map state
│   └── routes/
│       ├── health.py           # Health check endpoint
│       ├── overview.py         # /api/overview endpoint
│       ├── zones.py            # /api/zones and /api/zones/<id>
│       ├── hotels.py           # /api/hotels endpoint
│       ├── transport.py        # /api/transport endpoint
│       ├── welfare.py          # /api/welfare endpoint
│       └── map.py              # /api/map/state endpoint
├── frontend/
│   ├── index.html              # HTML entry point
│   ├── package.json            # React, Vite, Tailwind CSS, Lucide icons, Recharts
│   ├── vite.config.js          # Vite config with /api proxy to backend
│   ├── tailwind.config.js      # PRAVAAH architectural design tokens
│   └── src/
│       ├── App.jsx             # React router configuration
│       ├── main.jsx            # React root mount
│       ├── styles/
│       │   └── index.css       # Tailwind CSS & custom scrollbar variables
│       ├── lib/
│       │   ├── api.js          # Typed Axios client methods for all endpoints
│       │   └── constants.js    # Status thresholds, navigation items, metadata
│       ├── components/
│       │   ├── layout/         # Header, Sidebar, ControlRoomLayout, VisitorLayout
│       │   ├── shared/         # LoadingState, ErrorState, EmptyState
│       │   └── ui/             # KPICard, RecommendationCard, AlertCard, StatusBadge, Button, Card, Panel
│       └── pages/
│           ├── control-room/   # Overview, LiveCity, Hospitality, Mobility, Welfare, etc.
│           └── visitor/        # Plan, Route, Stay, Support mobile-first flows
└── README.md
```

---

## 🗄️ Synthetic Data Foundation (Phase 2)

All city data is deterministically seeded (`DEMO_SEED = 20260908`) and stored locally using **DuckDB**. The data models authentic Mumbai geographic and logistical relationships during Ganesh Chaturthi:

- **11 Monitored Zones**: Lalbaug (epicenter), Curry Road (critical transit bottle-neck), South Mumbai, Girgaon, Dadar, Parel, Byculla, Andheri, and spare-capacity buffer zones (Thane, Vashi, Navi Mumbai).
- **Multi-Modal Transport Nodes**: Central Line, Western Line, Harbour Line stations with calibrated passenger capacities and current hourly loads.
- **Accommodation Clusters**: Realistically modeled hotel clusters showing 94% occupancy in South Mumbai vs 43–48% available capacity in eastern buffer zones.
- **Civic Welfare Amenities**: Medical aid posts, drinking water stations, mobile sanitation units, and senior rest centers.
- **Road Network & Corridors**: Major arterial avenues (Dr. BA Road, Eastern Freeway, Tilak Bridge) with traffic flow and restriction states.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup & Run

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run Flask server (defaults to port 5000)
python app.py
```

*The backend will automatically initialize the DuckDB database and validate data integrity on startup.*

### 2. Frontend Setup & Run

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Service health status and version |
| `/api/overview` | `GET` | Core KPIs (City Pressure, Predicted Peak, Hotels, Transport, Alerts) |
| `/api/zones` | `GET` | All 11 monitored zones with current crowd pressures and capacities |
| `/api/zones/<id>` | `GET` | Zone drilldown (stations, hotels, crowd metrics, predictions) |
| `/api/hotels` | `GET` | Hotel clusters, total/available rooms, price ranges, and zone breakdown |
| `/api/transport` | `GET` | Railway stations, transit lines, and road network status |
| `/api/welfare` | `GET` | Welfare support amenities categorized by type and active status |
| `/api/map/state` | `GET` | Unified multi-layer geographic state ready for map visualization |

---

## 🛡️ Implementation Status

- [x] **Phase 1**: Control Room + Visitor Shell & Navigation Architecture
- [x] **Phase 2**: Synthetic City Data Architecture, DuckDB Storage Layer, REST APIs & Visual Identity Refinement
- [ ] **Phase 3**: MapLibre Geographic Centerpiece & Interactive Overlays *(Upcoming)*
- [ ] **Phase 4–20**: Live Sensors, Predictions, Counterfactual Simulations & Glass Box Intelligence *(Upcoming)*

---

*Prototype data · Simulated + calibrated to real geography*
