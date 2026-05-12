// screens.jsx — Home, Compare, Confirm, Stats screens

// ── Demo data ──────────────────────────────────────────────────────────
const DEMO_ROUTE = {
  from: "Liverpool Lime Street",
  fromMeta: "L1 1JD",
  to: "Sefton Park",
  toMeta: "Lark Lane, L17",
};

const MODES = [
  {
    key: "bike",
    label: "Bike",
    sublabel: "via Hope St & Princes Park",
    Icon: window.IconBike,
    co2: 0.00,
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
    Icon: window.IconTrain,
    co2: 0.18,
    time: 28,
    distance: 4.2,
    points: 35,
    cal: 38,
    badges: [
      { kind: "navy", text: "Cleanest motorised" },
    ],
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
    Icon: window.IconBus,
    co2: 0.31,
    time: 22,
    distance: 4.5,
    points: 25,
    cal: 12,
    badges: [
      { kind: "gray", text: "Fewest changes" },
    ],
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
    Icon: window.IconCar,
    co2: 0.94,
    time: 12,
    distance: 4.6,
    points: 0,
    cal: 0,
    badges: [
      { kind: "amber", text: "Fastest" },
    ],
    steps: [
      { t: "Pull out of Lime St", m: "Onto Lime Street southbound", time: "0 min" },
      { t: "A562 Catharine St", m: "1.8 km", time: "6 min" },
      { t: "Right onto A561", m: "2.4 km", time: "10 min" },
      { t: "Arrive Sefton Park", m: "Aigburth Dr", time: "12 min" },
    ],
  },
];

const RECENTS = [
  { from: "Albert Dock", to: "University of Liverpool", meta: "2.1 km · 3 days ago", mode: "bike" },
  { from: "Birkenhead", to: "Pier Head", meta: "Ferry · 1 week ago", mode: "train" },
  { from: "Anfield", to: "Liverpool ONE", meta: "5.4 km · 2 weeks ago", mode: "bus" },
];

const LEADERBOARD = [
  { name: "Jamie O.", pts: 1840, av: "JO" },
  { name: "Priya K.", pts: 1632, av: "PK" },
  { name: "Marcus T.", pts: 1488, av: "MT" },
  { name: "You", pts: 1245, av: "AS", you: true },
  { name: "Sam W.", pts: 1180, av: "SW" },
  { name: "Reece B.", pts: 1062, av: "RB" },
];

const ACHIEVEMENTS = [
  { name: "First Ride", desc: "Logged your first green trip", earned: true, Ico: window.IconStar },
  { name: "Week Streak", desc: "7 days in a row", earned: true, Ico: window.IconFlame },
  { name: "Half a tonne", desc: "Save 500kg CO₂ lifetime", earned: false, Ico: window.IconLeaf, prog: "318 / 500 kg" },
  { name: "Mersey Loop", desc: "Cross the river by ferry", earned: true, Ico: window.IconRoute },
  { name: "Off-peak Pro", desc: "30 trips outside rush", earned: false, Ico: window.IconClock, prog: "22 / 30" },
  { name: "Cathedral Climb", desc: "Bike up Hope Street", earned: false, Ico: window.IconLightning, prog: "Locked" },
];

const WEEK = [
  { d: "Mon", v: 0.72, mode: "bike" },
  { d: "Tue", v: 0.34, mode: "bus" },
  { d: "Wed", v: 0.00, mode: "off" },
  { d: "Thu", v: 0.88, mode: "bike" },
  { d: "Fri", v: 0.42, mode: "train" },
  { d: "Sat", v: 1.10, mode: "bike" },
  { d: "Sun", v: 0.18, mode: "train" },
];

Object.assign(window, { DEMO_ROUTE, MODES, RECENTS, LEADERBOARD, ACHIEVEMENTS, WEEK });

// ── Confetti generator ─────────────────────────────────────────────────
function Confetti({ count = 36, run = true }) {
  const pieces = React.useMemo(() => {
    if (!run) return [];
    const colors = ['var(--amber)', 'var(--navy)', 'var(--mode-bike)', 'var(--amber-deep)', '#fff'];
    return Array.from({ length: count }, (_, i) => ({
      i,
      left: Math.random() * 100,
      dx: (Math.random() - 0.5) * 240,
      rot: 200 + Math.random() * 800,
      color: colors[i % colors.length],
      delay: Math.random() * 200,
      duration: 1800 + Math.random() * 1200,
    }));
  }, [run, count]);
  if (!run) return null;
  return (
    <div className="confetti-stage">
      {pieces.map((p) => {
        const s = {
          left: p.left + '%',
          background: p.color,
          animationDelay: p.delay + 'ms',
          animationDuration: p.duration + 'ms',
        };
        s['--dx'] = p.dx + 'px';
        s['--rot'] = p.rot + 'deg';
        return <span key={p.i} className="confetti" style={s} />;
      })}
    </div>
  );
}

// ── Animated counter ───────────────────────────────────────────────────
function useTickingNumber(target, { stepMs = 60, increment = 0.001 } = {}) {
  const [v, setV] = React.useState(target);
  React.useEffect(() => {
    const id = setInterval(() => {
      setV((cur) => cur + increment * (0.6 + Math.random() * 0.9));
    }, stepMs);
    return () => clearInterval(id);
  }, [stepMs, increment]);
  return v;
}

// ── HOME ───────────────────────────────────────────────────────────────
function HomeScreen({ from, to, onChangeFrom, onChangeTo, onPlan, onSelectRecent, mapLayer, setMapLayer, predictedMinutes, setPredictedMinutes, mapStyle, communityCO2, userLocation, locating, locateError, onUseMyLocation, locationLabel }) {
  const live = useTickingNumber(communityCO2, { stepMs: 800, increment: 0.012 });

  return (
    <div className="home-grid">
      {/* Left panel: route entry */}
      <div className="card card-pad rise" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="tag tag-amber" style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
          Plan a journey
        </div>
        <h1 className="panel-h1">Where are you off to?</h1>
        <p className="panel-sub">We'll compare four ways across Merseyside — and the greener you choose, the more you earn.</p>

        <div className="input-stack">
          <div className="input-row">
            <div className="input-pin from"><span /></div>
            <input value={from} onChange={(e) => onChangeFrom(e.target.value)} placeholder="From" />
            <button className="swap" onClick={() => { onChangeFrom(to); onChangeTo(from); }} aria-label="Swap">
              <window.IconSwap />
            </button>
          </div>
          <div className="input-connector" />
          <div className="input-row">
            <div className="input-pin to"><span /></div>
            <input value={to} onChange={(e) => onChangeTo(e.target.value)} placeholder="To" />
          </div>
        </div>

        <button
          className={`btn btn-locate ${locating ? 'is-locating' : ''} ${userLocation ? 'is-located' : ''}`}
          onClick={onUseMyLocation}
          disabled={locating}
          style={{ marginTop: 10, width: '100%' }}>
          {locating ? (
            <><span className="locate-spinner" /> Locating you…</>
          ) : userLocation ? (
            <>
              <span className="locate-dot" />
              Using your location
              {locationLabel && <span className="locate-meta">· {locationLabel}</span>}
            </>
          ) : (
            <>
              <window.IconCrosshair size={14} />
              Use my location
            </>
          )}
        </button>
        {locateError && (
          <div className="locate-err">{locateError}</div>
        )}

        <button className="btn btn-primary" style={{ marginTop: 10, width: '100%' }} onClick={onPlan}>
          Compare routes
          <window.IconArrow />
        </button>

        <div className="section-h" style={{ marginTop: 22 }}>Recent</div>
        <div className="recents">
          {RECENTS.map((r, i) => (
            <button key={i} className="recent-item" onClick={() => onSelectRecent(r)}>
              <div className="recent-ico">
                <window.IconRoute />
              </div>
              <div className="recent-text">
                <div className="recent-title">{r.from} → {r.to}</div>
                <div className="recent-meta">{r.meta}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mini-grid">
          <div className="mini-card">
            <div className="l">Your savings</div>
            <div className="v">318<span style={{ fontSize: 11, opacity: 0.6, marginLeft: 3, fontWeight: 500 }}>kg</span></div>
            <div className="d">+1.2kg this week</div>
          </div>
          <div className="mini-card">
            <div className="l">Streak</div>
            <div className="v">12<span style={{ fontSize: 11, opacity: 0.6, marginLeft: 3, fontWeight: 500 }}>days</span></div>
            <div className="d">Personal best</div>
          </div>
        </div>
      </div>

      {/* Right panel: map */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
        <div className="map-panel rise rise-1" style={{ flex: 1 }}>
          <div className="map-shell">
            <window.RouteMap showRoute="none" mapLayer={mapLayer} predictedMinutes={predictedMinutes} style={mapStyle} userLocation={userLocation} />
            <div className="map-overlay">
              <button className={mapLayer === 'streets' ? 'on' : ''} onClick={() => setMapLayer('streets')}>Streets</button>
              <button className={mapLayer === 'aq' ? 'on' : ''} onClick={() => setMapLayer('aq')}>Air quality</button>
              <button className={mapLayer === 'congestion' ? 'on' : ''} onClick={() => setMapLayer('congestion')}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span className="ml-pill ml-pill-sm">ML</span>Congestion
                </span>
              </button>
            </div>
            <div className="map-zoom">
              <button aria-label="Zoom in" onClick={() => window.__erMap?.zoomIn?.()}><window.IconPlus size={14} /></button>
              <div className="sep" />
              <button aria-label="Zoom out" onClick={() => window.__erMap?.zoomOut?.()}><window.IconMinus size={14} /></button>
            </div>
            {mapLayer === 'aq' && (
              <div className="map-legend">
                <div className="legend-title">PM₂.₅ (μg/m³)</div>
                <div className="legend-row"><span className="legend-swatch" style={{ background: 'var(--aq-good)' }} />Good · 0–10</div>
                <div className="legend-row"><span className="legend-swatch" style={{ background: 'var(--aq-mid)' }} />Moderate · 11–20</div>
                <div className="legend-row"><span className="legend-swatch" style={{ background: 'var(--aq-poor)' }} />Poor · 21+</div>
              </div>
            )}
            {mapLayer === 'congestion' && (
              <window.CongestionPanel
                predictedMinutes={predictedMinutes}
                setPredictedMinutes={setPredictedMinutes}
                active={true}
                onToggle={() => setMapLayer('streets')}
              />
            )}
            {!userLocation && mapLayer !== 'congestion' && (
              <div className="map-empty-cta">
                <window.IconRoute size={14} /> Enter a destination to see routes
              </div>
            )}
            <div className="map-attrib">© OpenStreetMap · © CARTO</div>
          </div>
        </div>

        <div className="ticker rise rise-2">
          <div className="ticker-ico"><window.IconLeaf size={22} /></div>
          <div className="ticker-body">
            <div className="ticker-label">Merseyside saved together · today</div>
            <div className="ticker-value num">
              <span className="tick-up" key={Math.floor(live * 100)}>{live.toFixed(2)}</span>
              <span className="unit">tonnes CO₂</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 18, paddingRight: 8 }}>
            <div>
              <div className="ticker-label">Trips today</div>
              <div className="num" style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>4,182</div>
            </div>
            <div>
              <div className="ticker-label">Active users</div>
              <div className="num" style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>2,310</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, Confetti, useTickingNumber });
