import { IconBike, IconTrain, IconBus, IconCar, IconStar, IconFlame, IconLeaf, IconRoute, IconClock, IconLightning } from "./icons";

export const DEMO_ROUTE = {
  from: "Liverpool Lime Street",
  fromMeta: "L1 1JD",
  to: "Sefton Park",
  toMeta: "Lark Lane, L17",
};

export const MODES = [
  {
    key: "bike",
    label: "Bike",
    sublabel: "via Hope St & Princes Park",
    Icon: IconBike,
    co2: 0.0,
    time: 16,
    distance: 3.8,
    points: 50,
    cal: 142,
    badges: [
      { kind: "green", text: "Greenest" },
      { kind: "amber", text: "Most points" },
    ],
    steps: [
      { t: "Start at Lime Street", m: "Cycle south on Lime St", time: "0 min" },
      { t: "Right onto Hope Street", m: "Pass Liverpool Cathedral", time: "4 min" },
      { t: "Princes Avenue cycle lane", m: "Segregated path, 1.2 km", time: "8 min" },
      { t: "Arrive Sefton Park", m: "Park entry at Aigburth Dr", time: "16 min" },
    ],
  },
  {
    key: "train",
    label: "Train + walk",
    sublabel: "Merseyrail to St Michaels",
    Icon: IconTrain,
    co2: 0.18,
    time: 28,
    distance: 4.2,
    points: 35,
    cal: 38,
    badges: [{ kind: "navy", text: "Cleanest motorised" }],
    steps: [
      { t: "Walk to Lime Street", m: "Concourse, platform 4", time: "0 min" },
      { t: "Northern Line to St Michaels", m: "3 stops · Merseyrail", time: "9 min" },
      { t: "Walk along Aigburth Rd", m: "0.7 km", time: "20 min" },
      { t: "Arrive Sefton Park", m: "via Lark Lane", time: "28 min" },
    ],
  },
  {
    key: "bus",
    label: "Bus",
    sublabel: "Arriva 80A",
    Icon: IconBus,
    co2: 0.31,
    time: 22,
    distance: 4.5,
    points: 25,
    cal: 12,
    badges: [{ kind: "gray", text: "Fewest changes" }],
    steps: [
      { t: "Lime Street stop LS3", m: "Bus 80A · 3 min wait", time: "0 min" },
      { t: "Ride to Smithdown Rd", m: "13 stops", time: "18 min" },
      { t: "Short walk to Lark Lane", m: "0.3 km", time: "22 min" },
    ],
  },
  {
    key: "car",
    label: "Solo car",
    sublabel: "via A561",
    Icon: IconCar,
    co2: 0.94,
    time: 12,
    distance: 4.6,
    points: 0,
    cal: 0,
    badges: [{ kind: "amber", text: "Fastest" }],
    steps: [
      { t: "Pull out of Lime St", m: "Onto Lime Street southbound", time: "0 min" },
      { t: "A562 Catharine St", m: "1.8 km", time: "6 min" },
      { t: "Right onto A561", m: "2.4 km", time: "10 min" },
      { t: "Arrive Sefton Park", m: "Aigburth Dr", time: "12 min" },
    ],
  },
];

export const RECENTS = [
  { from: "Albert Dock", to: "University of Liverpool", meta: "2.1 km · 3 days ago", mode: "bike" },
  { from: "Birkenhead", to: "Pier Head", meta: "Ferry · 1 week ago", mode: "train" },
  { from: "Anfield", to: "Liverpool ONE", meta: "5.4 km · 2 weeks ago", mode: "bus" },
];

export const LEADERBOARD = [
  { name: "Jamie O.", pts: 1840, av: "JO" },
  { name: "Priya K.", pts: 1632, av: "PK" },
  { name: "Marcus T.", pts: 1488, av: "MT" },
  { name: "You", pts: 1245, av: "AS", you: true },
  { name: "Sam W.", pts: 1180, av: "SW" },
  { name: "Reece B.", pts: 1062, av: "RB" },
];

export const ACHIEVEMENTS = [
  { name: "First Ride", desc: "Logged your first green trip", earned: true, Ico: IconStar },
  { name: "Week Streak", desc: "7 days in a row", earned: true, Ico: IconFlame },
  { name: "Half a tonne", desc: "Save 500kg CO₂ lifetime", earned: false, Ico: IconLeaf, prog: "318 / 500 kg" },
  { name: "Mersey Loop", desc: "Cross the river by ferry", earned: true, Ico: IconRoute },
  { name: "Off-peak Pro", desc: "30 trips outside rush", earned: false, Ico: IconClock, prog: "22 / 30" },
  { name: "Cathedral Climb", desc: "Bike up Hope Street", earned: false, Ico: IconLightning, prog: "Locked" },
];

export const WEEK = [
  { d: "Mon", v: 0.72, mode: "bike" },
  { d: "Tue", v: 0.34, mode: "bus" },
  { d: "Wed", v: 0.0, mode: "off" },
  { d: "Thu", v: 0.88, mode: "bike" },
  { d: "Fri", v: 0.42, mode: "train" },
  { d: "Sat", v: 1.1, mode: "bike" },
  { d: "Sun", v: 0.18, mode: "train" },
];

export const LIME_STREET = [53.4076, -2.9774];
export const SEFTON_PARK = [53.3845, -2.9466];

export const ROUTES_LL = {
  bike: [
    [53.4076, -2.9774], [53.4055, -2.9760], [53.4030, -2.9740],
    [53.4005, -2.9700], [53.3975, -2.9655], [53.3945, -2.9610],
    [53.3915, -2.9555], [53.3885, -2.9510], [53.3860, -2.9485],
    [53.3845, -2.9466],
  ],
  bus: [
    [53.4076, -2.9774], [53.4060, -2.9770], [53.4030, -2.9760],
    [53.4000, -2.9745], [53.3970, -2.9720], [53.3945, -2.9680],
    [53.3925, -2.9630], [53.3905, -2.9580], [53.3885, -2.9530],
    [53.3865, -2.9495], [53.3845, -2.9466],
  ],
  train: [
    [53.4076, -2.9774], [53.4070, -2.9740], [53.4055, -2.9700],
    [53.4030, -2.9660], [53.4000, -2.9620], [53.3960, -2.9580],
    [53.3915, -2.9540], [53.3880, -2.9510], [53.3855, -2.9485],
    [53.3845, -2.9466],
  ],
  car: [
    [53.4076, -2.9774], [53.4085, -2.9755], [53.4090, -2.9720],
    [53.4080, -2.9670], [53.4050, -2.9610], [53.4010, -2.9560],
    [53.3970, -2.9520], [53.3925, -2.9490], [53.3880, -2.9475],
    [53.3845, -2.9466],
  ],
};

export const MODE_COLORS = {
  bike: "#2f8d5b", bus: "#3a7bd5", train: "#7a4ec9", car: "#d35a3a",
};

export const AQ_LL = [
  { lat: 53.45, lng: -2.99, r: 1800, band: "good" },
  { lat: 53.43, lng: -2.975, r: 1500, band: "mid" },
  { lat: 53.409, lng: -2.987, r: 1300, band: "poor" },
  { lat: 53.395, lng: -2.955, r: 1400, band: "mid" },
  { lat: 53.38, lng: -2.93, r: 1600, band: "good" },
  { lat: 53.39, lng: -3.03, r: 2000, band: "good" },
  { lat: 53.45, lng: -2.89, r: 1800, band: "good" },
];

export const AQ_COLORS = { good: "#3e9c6a", mid: "#e0a83a", poor: "#cc5b48" };

export const CONGESTION_HOTSPOTS = [
  { lat: 53.4076, lng: -2.9774, r: 800, label: "Lime St gyratory", base: [0.75, 0.85, 0.92, 0.88, 0.7, 0.45] },
  { lat: 53.4032, lng: -2.968, r: 900, label: "A5039 Catharine", base: [0.55, 0.7, 0.82, 0.85, 0.78, 0.55] },
  { lat: 53.3958, lng: -2.953, r: 1000, label: "Smithdown Rd", base: [0.85, 0.92, 0.95, 0.86, 0.62, 0.4] },
  { lat: 53.414, lng: -2.992, r: 1100, label: "Strand / Mann Is", base: [0.4, 0.55, 0.72, 0.8, 0.75, 0.6] },
  { lat: 53.388, lng: -2.941, r: 850, label: "Aigburth Rd / A561", base: [0.3, 0.42, 0.55, 0.68, 0.78, 0.85] },
  { lat: 53.422, lng: -2.958, r: 950, label: "Edge Lane / M62", base: [0.65, 0.78, 0.88, 0.92, 0.85, 0.7] },
  { lat: 53.376, lng: -2.975, r: 1000, label: "Otterspool prom", base: [0.2, 0.28, 0.35, 0.42, 0.5, 0.55] },
];

export const CONGESTION_COLORS = ["#3e9c6a", "#94b14f", "#e0a83a", "#e08442", "#cc5b48", "#a23a4a"];

// Heat-ramp palette for the canvas heatmap (RGBA stops by intensity 0→1).
export const HEAT_PALETTE = [
  [0, 0, 0, 0],
  [62, 156, 106, 92],
  [148, 177, 79, 145],
  [224, 168, 58, 185],
  [224, 132, 66, 210],
  [204, 91, 72, 230],
  [120, 40, 70, 240],
];

export function bandIndex(v) {
  return Math.min(5, Math.max(0, Math.floor(v * 6)));
}

export function intensityAt(spot, minuteOffset) {
  const idx = minuteOffset / 15;
  const i0 = Math.floor(idx);
  const i1 = Math.min(i0 + 1, spot.base.length - 1);
  const t = idx - i0;
  return spot.base[i0] * (1 - t) + spot.base[i1] * t;
}

// ── Worldwide hotspot synthesizer ─────────────────────────────────
// Deterministic per-tile hotspots so any city/area gets a plausible
// ML-style congestion signature.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ZONE_PREFIX = [
  "Central", "Northern", "Eastern", "Southern", "Western",
  "Riverside", "Harbour", "Downtown", "Outer ring", "Inner loop",
];
const ZONE_SUFFIX = [
  "junction", "corridor", "artery", "gyratory",
  "interchange", "approach", "ring", "expressway",
];

export function generateHotspots(centerLat, centerLng, spanLat, spanLng) {
  const seed =
    Math.floor((centerLat + 90) * 600) * 1000003 +
    Math.floor((centerLng + 180) * 600);
  const rng = mulberry32(seed);
  const n = 10 + Math.floor(rng() * 4);
  const mPerDegLat = 111320;
  const mPerDegLng = 111320 * Math.cos((centerLat * Math.PI) / 180);
  const baseSpanM = Math.min(spanLat * mPerDegLat, Math.abs(spanLng * mPerDegLng));
  const hotspots = [];
  const usedLabels = new Set();
  for (let i = 0; i < n; i++) {
    // Slight gaussian bias toward the visible center (urban core proxy)
    const ox = ((rng() + rng() + rng()) / 3 - 0.5) * spanLat * 1.3;
    const oy = ((rng() + rng() + rng()) / 3 - 0.5) * spanLng * 1.3;
    const lat = centerLat + ox;
    const lng = centerLng + oy;
    const r = 220 + rng() * baseSpanM * 0.09;
    const peakIdx = Math.floor(rng() * 6);
    const peakHeight = 0.55 + rng() * 0.42;
    const phase = rng() * Math.PI * 2;
    const base = Array.from({ length: 6 }, (_, k) => {
      const d = Math.abs(k - peakIdx);
      const v = peakHeight * Math.exp(-d * d * 0.45) + 0.08 + 0.07 * Math.sin(phase + k);
      return Math.max(0.05, Math.min(1, v));
    });
    let label;
    let tries = 0;
    do {
      const px = ZONE_PREFIX[Math.floor(rng() * ZONE_PREFIX.length)];
      const sf = ZONE_SUFFIX[Math.floor(rng() * ZONE_SUFFIX.length)];
      label = `${px} ${sf}`;
      tries++;
    } while (usedLabels.has(label) && tries < 6);
    usedLabels.add(label);
    hotspots.push({ lat, lng, r, label, base });
  }
  return hotspots;
}

// Tiny pub-sub for the live hotspot list — RouteMap publishes, CongestionPanel reads.
let _currentHotspots = CONGESTION_HOTSPOTS;
const _hotspotListeners = new Set();
export function setCurrentHotspots(h) {
  _currentHotspots = h;
  _hotspotListeners.forEach((fn) => fn(h));
}
export function getCurrentHotspots() {
  return _currentHotspots;
}
export function subscribeHotspots(fn) {
  _hotspotListeners.add(fn);
  return () => _hotspotListeners.delete(fn);
}
