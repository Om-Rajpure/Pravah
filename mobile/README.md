# PRAVAAH Mobile Application
**React Native + Expo &middot; Mobile-First City Intelligence Client**

Built for **Ganesh Chaturthi 2026** crowd pressure mitigation, dynamic transit routing, and incident management in Mumbai.

Connected directly to the unified **PRAVAAH Python Flask Backend** as the single source of truth.

---

## 📱 Architecture

```
                      PRAVAAH SYSTEM
                            │
               ┌────────────┴────────────┐
               │                         │
          React Web                React Native
        (Control Room)            (Expo Mobile)
          [frontend/]               [mobile/]
               │                         │
               └────────────┬────────────┘
                            │ (REST APIs)
                            ▼
                        Flask API
                       [backend/]
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    DuckDB Data      Intelligence      External Integrations
  (Corridors/Zones) (Sim/Pred/Action)   (Open-Meteo/OSM)
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli` or `npx expo`)
- Android Studio / Android Emulator or Expo Go on physical device

### 2. Configure Backend URL
In `mobile/.env`:
```env
# For Android Emulator:
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000

# For iOS Simulator:
EXPO_PUBLIC_API_URL=http://localhost:5000

# For Physical Device on same Wi-Fi:
EXPO_PUBLIC_API_URL=http://192.168.x.x:5000

# For Deployed Vercel API:
EXPO_PUBLIC_API_URL=https://pravaah-mumbai.vercel.app
```

### 3. Start Development Server
```bash
cd mobile
npm install
npx expo start
```
- Press `a` to open in Android Emulator
- Press `i` to open in iOS Simulator
- Scan QR code with Expo Go app on physical phone

---

## 🔐 Credentials & Role Access

The mobile app connects to the Flask `/api/auth/login` and `/api/auth/me` endpoints:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Incident Commander (Operator)** | `admin@pravaah.gov.in` | `pravaah2026` | View all telemetry, trigger 18% redirection, run stress scenarios |
| **Field Mobility Lead (Staff)** | `staff@pravaah.gov.in` | `field2026` | View station bottlenecks, road closures, incident logs |
| **Festival Attendee (Visitor)** | `visitor@pravaah.in` | `visitor2026` | Transit routing, crowd bypass, queue forecasts |
| **Guest Explorer** | *One-Tap Quick Pass* | *N/A* | Public route planning, live map, civic amenities |

---

## 📁 Mobile Project Structure

```
mobile/
├── assets/                  # App icon, adaptive icon, splash screen
├── src/
│   ├── api/                 # Centralized API layer connecting to Flask backend
│   │   ├── client.ts        # Base client with SecureStore token injection & offline detection
│   │   ├── auth.ts          # Login, logout, session verification
│   │   ├── city.ts          # City overview & zone telemetry
│   │   ├── weather.ts       # Open-Meteo live weather telemetry
│   │   ├── alerts.ts        # Active corridor incident alerts
│   │   ├── journey.ts       # Dijkstra shortest path & congestion bypass
│   │   ├── hospitality.ts   # Suburban buffer room availability & tariffs
│   │   ├── mobility.ts      # Suburban railway station saturation
│   │   ├── welfare.ts       # Drinking water, medical aid, police help desks
│   │   ├── predictions.ts   # Multi-horizon (+30m to +180m) forecast
│   │   ├── actions.ts       # 18% redirection recommendation & simulation
│   │   ├── scenarios.ts     # What-If sandbox (Rain, Train Outage, VIP Influx)
│   │   ├── explainability.ts# Glass Box 4-step reasoning trace
│   │   └── visitor.ts       # Pandal queue forecasts & darshan windows
│   ├── components/
│   │   ├── ui/              # Reusable UI component suite
│   │   │   ├── PRHeader.tsx # Mobile top bar with LIVE pulse dot
│   │   │   ├── MetricCard.tsx# 32px bold KPI card
│   │   │   ├── StatusBadge.tsx# Semantic status chip
│   │   │   ├── WeatherCard.tsx# Open-Meteo weather telemetry card
│   │   │   ├── AlertCard.tsx# Critical & warning incident card
│   │   │   ├── HotspotCard.tsx# Zone progress meter
│   │   │   ├── BottomSheet.tsx# Floating interactive map detail sheet
│   │   │   ├── PrimaryButton.tsx# 44px+ touch-friendly buttons
│   │   │   ├── ScreenContainer.tsx# Safe-area scrollview with pull-to-refresh
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   └── OfflineBanner.tsx
│   │   └── map/
│   │       └── MobileMumbaiMap.tsx # OpenStreetMap raster canvas (0 API keys, 0 watermarks)
│   ├── context/
│   │   ├── AuthContext.tsx  # Authentication state & role checks
│   │   └── NetworkContext.tsx# Offline tracking & freshness timestamps
│   ├── navigation/
│   │   ├── RootNavigator.tsx# Stack navigator (Splash, Login, MainTabs, Secondary)
│   │   └── TabNavigator.tsx # Bottom tab bar (Home, Map, Alerts, Journey, More)
│   ├── screens/
│   │   ├── SplashScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── MapScreen.tsx
│   │   ├── AlertsScreen.tsx
│   │   ├── JourneyScreen.tsx
│   │   ├── MoreScreen.tsx
│   │   └── secondary/
│   │       ├── AlertDetailScreen.tsx
│   │       ├── HospitalityScreen.tsx
│   │       ├── MobilityScreen.tsx
│   │       ├── WelfareScreen.tsx
│   │       ├── PredictionsScreen.tsx
│   │       ├── RecommendationsScreen.tsx
│   │       ├── ScenariosScreen.tsx
│   │       ├── GlassBoxScreen.tsx
│   │       ├── VisitorExperienceScreen.tsx
│   │       └── SettingsScreen.tsx
│   ├── theme/               # Centralized Warm White + Charcoal + Orange tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   └── types/               # TypeScript data models
├── App.tsx                  # Root entry point
├── app.json                 # Expo configuration
├── package.json
└── tsconfig.json
```
