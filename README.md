# EcoRoute Merseyside

> Choose the greener way across Liverpool — and get rewarded for it.

Built for the **Merseyside Inter-Varsity Hackathon 2026**.

EcoRoute is a journey planner for Merseyside that compares four ways to get
anywhere — **bike, train + walk, bus, or solo car** — side-by-side on a single
map. Every trip is scored on time, distance, calories, CO₂ saved vs. the car
baseline, and green points. Pick the cleaner option and you climb the
Merseyside leaderboard, earn achievements, and watch the city's collective CO₂
savings tick up in real time.

---

## Demo

> 🎬 **Demo video:** _coming soon — link will be added after the hackathon
> submission._

Until then, run the app locally (see [Getting started](#getting-started)) — the
landing page → planner → confirm → stats flow is the full pitch in ~60 seconds.

---

## Why this matters

Transport is the UK's largest source of greenhouse-gas emissions, and most
short urban trips in Merseyside are still made by single-occupant car. Existing
journey planners optimise for **time** — they show the fastest route and a CO₂
number as an afterthought. EcoRoute flips that: emissions, air quality, and
reward points are first-class citizens, sitting next to time and distance so
the greener choice is the obvious choice.

## What it does

- **Compare four modes in one glance.** Bike, Merseyrail + walk, Arriva bus,
  and solo car — each with time, distance, CO₂ kg, calories burned, and
  reward points, drawn as four coloured polylines on the same map.
- **Real Liverpool geography.** Routes use real lat/lng polylines between
  Lime Street, Sefton Park, the Albert Dock, Anfield, Birkenhead, and more,
  rendered on CARTO/OpenStreetMap tiles via Leaflet.
- **Air-quality overlay.** Toggleable PM₂.₅ heat layer (good / moderate / poor)
  so cyclists can see which corridors to avoid.
- **ML congestion forecast.** A predicted-congestion heatmap with a
  time-of-day scrubber (`0 → +90 min`). Hotspots are synthesised
  deterministically for any map view so panning to a new area still produces a
  plausible signature. Built-in hotspots cover Lime St gyratory, Smithdown Rd,
  Strand / Mann Island, Edge Lane / M62, and others.
- **Gamification.** Green points for bike + train, lifetime CO₂ saved,
  day streaks, level progression, achievements (First Ride, Week Streak,
  Mersey Loop, Cathedral Climb…), and a weekly Merseyside leaderboard.
- **Live community counter.** Watch tonnes of CO₂ saved by everyone on
  EcoRoute tick up in real time on the home screen.
- **Geolocation with graceful fallback.** "Use my location" prompts the
  browser, times out after 3.5s, and falls back to Liverpool city centre if
  permission is denied or the request hangs.

## Screens

| Screen | What's on it |
|---|---|
| **Landing** | Liverpool skyline hero, From / To inputs, "Use my location", swap, big *Compare routes* CTA |
| **Plan** | Inputs, recents, live community counter, full map with Streets / Air quality / **ML Congestion** layers |
| **Compare** | All four modes as cards (CO₂, time, distance, points, calories) with badges — *Greenest*, *Fastest*, *Most points*, *Cleanest motorised* — and route polylines on the map |
| **Confirm** | Step-by-step turn-by-turn directions for the chosen mode, with running CO₂ + points tally |
| **Stats** | Weekly CO₂ bar chart, Merseyside leaderboard, achievement grid, level + streak chips |

## Tech stack

- **React 19** + **Vite 8** (no framework, no router — a single `view` state
  drives the landing ↔ planner transition)
- **Leaflet 1.9 / react-leaflet 5** for the map, with a custom canvas overlay
  for the heatmaps
- **Tailwind CSS 4** for utility classes (the project also ships hand-written
  CSS in `Planner.css` and `Landing.css` for the bespoke palette)
- **CARTO** light / dark / voyager raster tiles, **OpenStreetMap** attribution
- **lucide-react** + custom inline SVG icons
- No backend — all routes, points, and ML hotspots are computed client-side
  from `src/components/Planner/data.jsx` so the demo runs entirely offline
  after first load

## Project structure

```
src/
├── App.jsx                    ← landing ↔ planner switcher
├── components/
│   ├── Landing/               ← marketing landing page with hero + form
│   └── Planner/
│       ├── Planner.jsx        ← sidebar + topbar + screen router
│       ├── Map.jsx            ← Leaflet map, AQ overlay, ML congestion heatmap
│       ├── data.jsx           ← MODES, routes (lat/lng), AQ, hotspots,
│       │                       leaderboard, achievements, weekly stats
│       ├── icons.jsx          ← inline SVG icon set
│       └── screens/
│           ├── HomeScreen.jsx     ← plan a trip
│           ├── CompareScreen.jsx  ← four-mode comparison
│           ├── ConfirmScreen.jsx  ← turn-by-turn confirmation
│           └── StatsScreen.jsx    ← weekly chart + leaderboard + achievements
├── assets/images/             ← Liverpool hero image
└── data/                      ← legacy data modules (kept for reference)

_legacy/                       ← original single-file HTML prototype + JSX scratch
```

## Getting started

Prerequisites: **Node 20+** and **npm 10+**.

```bash
git clone https://github.com/ro0telqayser/ecoroute-merseyside.git
cd ecoroute-merseyside
npm install
npm run dev
```

Open <http://localhost:5173>. The landing page loads with a pre-filled
*Lime Street → Sefton Park* journey — hit **Compare routes** to jump straight
into the planner.

### Other scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the codebase |

## How the data works

Everything in `src/components/Planner/data.jsx` is hand-tuned demo data so the
app is dependency-free at runtime:

- **`MODES`** — the four transport options with CO₂ (kg/trip), time, distance,
  calories, points, badge metadata, and per-step turn-by-turn instructions.
- **`ROUTES_LL`** — lat/lng polylines per mode for the Lime St → Sefton Park
  demo route, coloured via `MODE_COLORS`.
- **`AQ_LL` + `AQ_COLORS`** — air-quality bubbles (good / mid / poor) drawn as
  translucent circles on the map.
- **`CONGESTION_HOTSPOTS`** — handcrafted hotspots around Merseyside with a
  6-step base intensity curve covering rush hour. `intensityAt(spot, +Nmin)`
  interpolates between curve steps.
- **`generateHotspots(centerLat, centerLng, span…)`** — a deterministic
  `mulberry32`-seeded synthesiser that produces 10–14 plausible hotspots for
  any map view, so panning to Manchester or Birmingham still shows a
  believable ML signature.
- **`LEADERBOARD`, `ACHIEVEMENTS`, `WEEK`, `RECENTS`** — drive the stats
  screen and home recents.

CO₂ savings are computed in the planner as `0.94 – chosenMode.co2` kg, where
0.94 is the solo-car baseline for the demo route. Points are awarded only for
**bike** and **train** trips, reinforcing the green nudge.

## Roadmap

- [ ] Wire up real Merseyrail GTFS feed for live train times
- [ ] Replace synthetic congestion with a real ML model trained on TfL /
  TfGM-style probe data
- [ ] Real OpenRouteService routing per mode (the loader text already hints
  at this)
- [ ] Persist user state (streak, points, achievements) to Supabase
- [ ] Native PWA install + offline routes for cyclists
- [ ] Add Mersey Ferry as a fifth mode (the *Mersey Loop* achievement is
  waiting for it)

## Team

EcoRoute Merseyside was built by a student team at the **Merseyside
Inter-Varsity Hackathon 2026**.

_Add team members here — name, university, role._

## Acknowledgements

- Map tiles © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, © [CARTO](https://carto.com/attributions)
- Inspiration from [Citymapper](https://citymapper.com/), [Strava](https://www.strava.com/), and the Merseyside Combined Authority's [Local Transport Plan](https://www.liverpoolcityregion-ca.gov.uk/)
- Icons by [Lucide](https://lucide.dev/) and custom SVG

## License

MIT — see [LICENSE](LICENSE) if present, otherwise the code is provided as-is
for hackathon judging and educational use.
