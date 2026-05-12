// map.jsx — Leaflet-backed real map of Merseyside.

const LIME_STREET = [53.4076, -2.9774];
const SEFTON_PARK = [53.3845, -2.9466];

const ROUTES_LL = {
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

const MODE_COLORS = {
  bike: '#2f8d5b', bus: '#3a7bd5', train: '#7a4ec9', car: '#d35a3a',
};

const AQ_LL = [
  { lat: 53.4500, lng: -2.9900, r: 1800, band: 'good' },
  { lat: 53.4300, lng: -2.9750, r: 1500, band: 'mid' },
  { lat: 53.4090, lng: -2.9870, r: 1300, band: 'poor' },
  { lat: 53.3950, lng: -2.9550, r: 1400, band: 'mid' },
  { lat: 53.3800, lng: -2.9300, r: 1600, band: 'good' },
  { lat: 53.3900, lng: -3.0300, r: 2000, band: 'good' },
  { lat: 53.4500, lng: -2.8900, r: 1800, band: 'good' },
];

const AQ_COLORS = { good: '#3e9c6a', mid: '#e0a83a', poor: '#cc5b48' };

// Congestion hotspots — each has a base intensity curve sampled by predicted minute offset
// Bands shift over time to suggest ML predictions.
const CONGESTION_HOTSPOTS = [
  { lat: 53.4076, lng: -2.9774, r: 800,  label: 'Lime St gyratory',  base: [0.75, 0.85, 0.92, 0.88, 0.70, 0.45] },
  { lat: 53.4032, lng: -2.9680, r: 900,  label: 'A5039 Catharine',   base: [0.55, 0.70, 0.82, 0.85, 0.78, 0.55] },
  { lat: 53.3958, lng: -2.9530, r: 1000, label: 'Smithdown Rd',      base: [0.85, 0.92, 0.95, 0.86, 0.62, 0.40] },
  { lat: 53.4140, lng: -2.9920, r: 1100, label: 'Strand / Mann Is',  base: [0.40, 0.55, 0.72, 0.80, 0.75, 0.60] },
  { lat: 53.3880, lng: -2.9410, r: 850,  label: 'Aigburth Rd / A561',base: [0.30, 0.42, 0.55, 0.68, 0.78, 0.85] },
  { lat: 53.4220, lng: -2.9580, r: 950,  label: 'Edge Lane / M62',   base: [0.65, 0.78, 0.88, 0.92, 0.85, 0.70] },
  { lat: 53.3760, lng: -2.9750, r: 1000, label: 'Otterspool prom',   base: [0.20, 0.28, 0.35, 0.42, 0.50, 0.55] },
];

const CONGESTION_COLORS = ['#3e9c6a', '#94b14f', '#e0a83a', '#e08442', '#cc5b48', '#a23a4a'];

function bandIndex(v) {
  // 0..1 → 0..5
  return Math.min(5, Math.max(0, Math.floor(v * 6)));
}

function intensityAt(spot, minuteOffset) {
  // Each base entry is at 0,15,30,45,60,75 min. Linear interpolate.
  const idx = (minuteOffset / 15);
  const i0 = Math.floor(idx);
  const i1 = Math.min(i0 + 1, spot.base.length - 1);
  const t = idx - i0;
  return spot.base[i0] * (1 - t) + spot.base[i1] * t;
}

const TILE_PROVIDERS = {
  realistic: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '© OSM · © CARTO', subdomains: 'abcd',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© OSM · © CARTO', subdomains: 'abcd',
  },
  illustrated: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '© OSM · © CARTO', subdomains: 'abcd',
  },
};

function RouteMap({
  showRoute = "none",
  mapLayer = "streets", // streets | aq | congestion
  predictedMinutes = 0,
  selected = null,
  style = "realistic",
  userLocation = null,
}) {
  const hostRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const tileRef = React.useRef(null);
  const layerRef = React.useRef(null);

  React.useEffect(() => {
    if (!hostRef.current || mapRef.current) return;
    if (typeof L === 'undefined') return;
    const map = L.map(hostRef.current, {
      center: [53.397, -2.962], zoom: 13,
      zoomControl: false, attributionControl: false,
      scrollWheelZoom: false, dragging: true,
      doubleClickZoom: true, preferCanvas: true,
    });
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    window.__erMap = {
      zoomIn: () => map.zoomIn(),
      zoomOut: () => map.zoomOut(),
      fitRoute: () => map.fitBounds([LIME_STREET, SEFTON_PARK], { padding: [40, 40] }),
    };
    return () => { map.remove(); mapRef.current = null; tileRef.current = null; layerRef.current = null; };
  }, []);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (tileRef.current) map.removeLayer(tileRef.current);
    const p = TILE_PROVIDERS[style] || TILE_PROVIDERS.realistic;
    tileRef.current = L.tileLayer(p.url, {
      attribution: p.attribution, subdomains: p.subdomains,
      maxZoom: 19, detectRetina: true,
    }).addTo(map);
  }, [style]);

  React.useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    // AQ layer
    if (mapLayer === 'aq') {
      AQ_LL.forEach(p => {
        L.circle([p.lat, p.lng], { radius: p.r, color: AQ_COLORS[p.band], fillColor: AQ_COLORS[p.band], fillOpacity: 0.22, weight: 0, interactive: false }).addTo(layer);
        L.circle([p.lat, p.lng], { radius: p.r * 0.55, color: AQ_COLORS[p.band], fillColor: AQ_COLORS[p.band], fillOpacity: 0.18, weight: 0, interactive: false }).addTo(layer);
      });
    }

    // Congestion layer
    if (mapLayer === 'congestion') {
      CONGESTION_HOTSPOTS.forEach((spot, idx) => {
        const v = intensityAt(spot, predictedMinutes);
        const color = CONGESTION_COLORS[bandIndex(v)];
        const radius = spot.r * (0.7 + v * 0.6);
        const opacity = 0.18 + v * 0.22;
        L.circle([spot.lat, spot.lng], { radius, color, fillColor: color, fillOpacity: opacity, weight: 0, interactive: false }).addTo(layer);
        L.circle([spot.lat, spot.lng], { radius: radius * 0.55, color, fillColor: color, fillOpacity: opacity * 1.1, weight: 0, interactive: false }).addTo(layer);
        // intensity dot
        L.circle([spot.lat, spot.lng], { radius: 60, color: '#fff', fillColor: color, fillOpacity: 1, weight: 2, interactive: false }).addTo(layer);
      });
    }

    // Route polylines
    const modes =
      showRoute === 'none' ? [] :
      showRoute === 'all' ? ['car', 'bus', 'train', 'bike'] :
      [showRoute];

    modes.forEach((mode) => {
      const isSelected = selected === mode;
      const isDimmed = selected && selected !== mode;
      const coords = ROUTES_LL[mode];
      L.polyline(coords, { color: '#fff', weight: isSelected ? 9 : 7, opacity: isDimmed ? 0.4 : 0.95, lineCap: 'round', lineJoin: 'round', interactive: false }).addTo(layer);
      L.polyline(coords, { color: MODE_COLORS[mode], weight: isSelected ? 5.5 : 4, opacity: isDimmed ? 0.5 : 1, lineCap: 'round', lineJoin: 'round', interactive: false, dashArray: mode === 'train' ? '1, 9' : null }).addTo(layer);
    });

    if (showRoute !== 'none') {
      const fromIcon = L.divIcon({ className: '', html: '<div class="er-pin er-pin-from"></div>', iconSize: [22, 22], iconAnchor: [11, 11] });
      const toIcon = L.divIcon({ className: '', html: '<div class="er-pin er-pin-to"></div>', iconSize: [22, 22], iconAnchor: [11, 11] });
      L.marker(LIME_STREET, { icon: fromIcon, interactive: false }).addTo(layer);
      L.marker(SEFTON_PARK, { icon: toIcon, interactive: false }).addTo(layer);
    }

    if (userLocation) {
      const userIcon = L.divIcon({ className: '', html: '<div class="er-pin er-pin-user"><span class="er-pulse"></span><span class="er-dot"></span></div>', iconSize: [28, 28], iconAnchor: [14, 14] });
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, interactive: false }).addTo(layer);
    }

    if (modes.length > 0) {
      map.fitBounds([LIME_STREET, SEFTON_PARK], { padding: [40, 40], maxZoom: 14 });
    }
  }, [showRoute, mapLayer, predictedMinutes, selected, userLocation]);

  return <div ref={hostRef} className="leaflet-host" />;
}

// Predicted congestion widget — sits on top of the map.
function CongestionPanel({ predictedMinutes, setPredictedMinutes, active, onToggle }) {
  const t = new Date(Date.now() + predictedMinutes * 60000);
  const eta = t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const hottest = CONGESTION_HOTSPOTS
    .map(s => ({ ...s, v: intensityAt(s, predictedMinutes) }))
    .sort((a, b) => b.v - a.v)[0];
  const band = bandIndex(hottest.v);
  const bandLabel = ['Free', 'Light', 'Busy', 'Slow', 'Heavy', 'Severe'][band];
  const bandColor = CONGESTION_COLORS[band];

  // Suggest best window: scan next 75 min for lowest peak average
  const suggest = React.useMemo(() => {
    let best = { score: Infinity, minute: 0 };
    for (let m = 0; m <= 60; m += 5) {
      const s = CONGESTION_HOTSPOTS.reduce((acc, sp) => acc + intensityAt(sp, m), 0) / CONGESTION_HOTSPOTS.length;
      if (s < best.score) best = { score: s, minute: m };
    }
    return best;
  }, []);

  const suggestTime = new Date(Date.now() + suggest.minute * 60000)
    .toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const delta = Math.round((1 - suggest.score) * 100 - 40); // arbitrary % saving

  return (
    <div className={`congest-panel ${active ? 'on' : ''}`}>
      <div className="congest-head">
        <div className="congest-title">
          <span className="ml-pill">ML</span>
          Predicted congestion
          <span className="confidence">
            <span className="conf-dot" /> 92% conf.
          </span>
        </div>
        <button className="congest-toggle" onClick={onToggle} aria-pressed={active}>
          <span className={`congest-sw ${active ? 'on' : ''}`}><span /></span>
          {active ? 'On' : 'Off'}
        </button>
      </div>

      {active && (
        <>
          <div className="congest-now">
            <div>
              <div className="congest-l">Forecast for</div>
              <div className="congest-time">
                {predictedMinutes === 0 ? 'Now' : `+${predictedMinutes} min`}
                <span className="congest-eta">· {eta}</span>
              </div>
            </div>
            <div className="congest-band" style={{ background: bandColor }}>
              {bandLabel}
            </div>
          </div>

          <div className="congest-scrub">
            <input
              type="range" min="0" max="75" step="5"
              value={predictedMinutes}
              onChange={(e) => setPredictedMinutes(parseInt(e.target.value, 10))}
            />
            <div className="congest-ticks">
              <span>now</span><span>+15</span><span>+30</span><span>+45</span><span>+60</span><span>+75</span>
            </div>
          </div>

          <div className="congest-spark">
            {Array.from({ length: 16 }, (_, i) => {
              const m = i * 5;
              const v = CONGESTION_HOTSPOTS.reduce((acc, sp) => acc + intensityAt(sp, m), 0) / CONGESTION_HOTSPOTS.length;
              const isCur = Math.abs(m - predictedMinutes) < 3;
              return (
                <span key={i}
                      className={`spark-bar ${isCur ? 'cur' : ''}`}
                      style={{ height: `${10 + v * 90}%`, background: CONGESTION_COLORS[bandIndex(v)] }} />
              );
            })}
          </div>

          <div className="congest-hottest">
            <div className="congest-l">Hottest hotspot</div>
            <div className="hottest-row">
              <span className="hottest-dot" style={{ background: bandColor }} />
              <span className="hottest-name">{hottest.label}</span>
              <span className="hottest-v">{Math.round(hottest.v * 100)}%</span>
            </div>
          </div>

          <div className="congest-suggest">
            <span className="suggest-ico">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </span>
            <div>
              <div className="suggest-h">Best to leave</div>
              <div className="suggest-b">
                <b>{suggest.minute === 0 ? 'now' : `in ${suggest.minute} min`}</b>
                {suggest.minute > 0 && <> · {suggestTime}</>}
                {' · '}
                <span style={{ color: 'var(--mode-bike)' }}>save ~{Math.max(5, delta)}% travel time</span>
              </div>
            </div>
          </div>

          <div className="congest-foot">
            Trained on TfL feeds · Merseytravel sensors · 7-day rolling
          </div>
        </>
      )}
    </div>
  );
}

Object.assign(window, { RouteMap, CongestionPanel, CONGESTION_HOTSPOTS, intensityAt, bandIndex, CONGESTION_COLORS });
