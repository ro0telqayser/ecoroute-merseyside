import { useEffect, useRef, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  LIME_STREET,
  SEFTON_PARK,
  ROUTES_LL,
  MODE_COLORS,
  AQ_LL,
  AQ_COLORS,
  CONGESTION_HOTSPOTS,
  CONGESTION_COLORS,
  HEAT_PALETTE,
  bandIndex,
  intensityAt,
  generateHotspots,
  setCurrentHotspots,
  getCurrentHotspots,
  subscribeHotspots,
} from "./data";

// Smooth color lookup over the HEAT_PALETTE stops by intensity 0..1.
function heatRamp(t) {
  t = Math.min(1, Math.max(0, t));
  const idx = t * (HEAT_PALETTE.length - 1);
  const i0 = Math.floor(idx);
  const i1 = Math.min(HEAT_PALETTE.length - 1, i0 + 1);
  const f = idx - i0;
  const a = HEAT_PALETTE[i0];
  const b = HEAT_PALETTE[i1];
  return [
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
    a[3] + (b[3] - a[3]) * f,
  ];
}

const TILE_PROVIDERS = {
  realistic: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: "© OSM · © CARTO",
    subdomains: "abcd",
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "© OSM · © CARTO",
    subdomains: "abcd",
  },
  illustrated: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: "© OSM · © CARTO",
    subdomains: "abcd",
  },
};

export function RouteMap({
  showRoute = "none",
  mapLayer = "streets",
  predictedMinutes = 0,
  selected = null,
  style = "realistic",
  userLocation = null,
  mapApiRef,
}) {
  const hostRef = useRef(null);
  const mapRef = useRef(null);
  const tileRef = useRef(null);
  const layerRef = useRef(null);
  const heatCanvasRef = useRef(null);
  const hotspotsRef = useRef(CONGESTION_HOTSPOTS);
  const lastGenRef = useRef({ lat: 53.397, lng: -2.962, zoom: 13 });

  useEffect(() => {
    if (!hostRef.current || mapRef.current) return;
    const map = L.map(hostRef.current, {
      center: [53.397, -2.962],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: true,
      doubleClickZoom: true,
      preferCanvas: true,
    });
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    // Heat canvas overlay (sits above tiles, below routes/markers).
    const canvas = document.createElement("canvas");
    canvas.className = "heat-canvas";
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "1";
    hostRef.current.appendChild(canvas);
    heatCanvasRef.current = canvas;

    if (mapApiRef) {
      mapApiRef.current = {
        zoomIn: () => map.zoomIn(),
        zoomOut: () => map.zoomOut(),
        fitRoute: () => map.fitBounds([LIME_STREET, SEFTON_PARK], { padding: [40, 40] }),
      };
    }
    return () => {
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      heatCanvasRef.current = null;
      map.remove();
      mapRef.current = null;
      tileRef.current = null;
      layerRef.current = null;
    };
  }, [mapApiRef]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (tileRef.current) map.removeLayer(tileRef.current);
    const p = TILE_PROVIDERS[style] || TILE_PROVIDERS.realistic;
    tileRef.current = L.tileLayer(p.url, {
      attribution: p.attribution,
      subdomains: p.subdomains,
      maxZoom: 19,
      detectRetina: true,
    }).addTo(map);
  }, [style]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    if (mapLayer === "aq") {
      AQ_LL.forEach((p) => {
        L.circle([p.lat, p.lng], {
          radius: p.r,
          color: AQ_COLORS[p.band],
          fillColor: AQ_COLORS[p.band],
          fillOpacity: 0.22,
          weight: 0,
          interactive: false,
        }).addTo(layer);
        L.circle([p.lat, p.lng], {
          radius: p.r * 0.55,
          color: AQ_COLORS[p.band],
          fillColor: AQ_COLORS[p.band],
          fillOpacity: 0.18,
          weight: 0,
          interactive: false,
        }).addTo(layer);
      });
    }

    // Heatmap is rendered via the Canvas overlay (see effect below).

    const modes =
      showRoute === "none" ? [] :
      showRoute === "all" ? ["car", "bus", "train", "bike"] :
      [showRoute];

    modes.forEach((mode) => {
      const isSelected = selected === mode;
      const isDimmed = selected && selected !== mode;
      const coords = ROUTES_LL[mode];
      L.polyline(coords, {
        color: "#fff",
        weight: isSelected ? 9 : 7,
        opacity: isDimmed ? 0.4 : 0.95,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
      }).addTo(layer);
      L.polyline(coords, {
        color: MODE_COLORS[mode],
        weight: isSelected ? 5.5 : 4,
        opacity: isDimmed ? 0.5 : 1,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
        dashArray: mode === "train" ? "1, 9" : null,
      }).addTo(layer);
    });

    if (showRoute !== "none") {
      const fromIcon = L.divIcon({ className: "", html: '<div class="er-pin er-pin-from"></div>', iconSize: [22, 22], iconAnchor: [11, 11] });
      const toIcon = L.divIcon({ className: "", html: '<div class="er-pin er-pin-to"></div>', iconSize: [22, 22], iconAnchor: [11, 11] });
      L.marker(LIME_STREET, { icon: fromIcon, interactive: false }).addTo(layer);
      L.marker(SEFTON_PARK, { icon: toIcon, interactive: false }).addTo(layer);
    }

    if (userLocation) {
      const userIcon = L.divIcon({
        className: "",
        html: '<div class="er-pin er-pin-user"><span class="er-pulse"></span><span class="er-dot"></span></div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, interactive: false }).addTo(layer);
    }

    if (modes.length > 0) {
      map.fitBounds([LIME_STREET, SEFTON_PARK], { padding: [40, 40], maxZoom: 14 });
    }
  }, [showRoute, mapLayer, predictedMinutes, selected, userLocation]);

  // Canvas heatmap — additive radial blobs + palette lookup, follows the map worldwide.
  useEffect(() => {
    const map = mapRef.current;
    const canvas = heatCanvasRef.current;
    if (!map || !canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext("2d");
    let rafId = 0;

    const regenIfNeeded = () => {
      const c = map.getCenter();
      const z = map.getZoom();
      const last = lastGenRef.current;
      const moved =
        Math.abs(c.lat - last.lat) > 0.01 ||
        Math.abs(c.lng - last.lng) > 0.01 ||
        Math.abs(z - last.zoom) >= 1;
      if (!moved && hotspotsRef.current.length) return;
      const b = map.getBounds();
      const spanLat = Math.abs(b.getNorth() - b.getSouth());
      const spanLng = Math.abs(b.getEast() - b.getWest());
      const hotspots = generateHotspots(c.lat, c.lng, spanLat, spanLng);
      hotspotsRef.current = hotspots;
      setCurrentHotspots(hotspots);
      lastGenRef.current = { lat: c.lat, lng: c.lng, zoom: z };
    };

    const resize = () => {
      const size = map.getSize();
      canvas.width = Math.max(1, Math.floor(size.x * dpr));
      canvas.height = Math.max(1, Math.floor(size.y * dpr));
      canvas.style.width = size.x + "px";
      canvas.style.height = size.y + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (!canvas.width || !canvas.height) return;
      if (mapLayer !== "congestion") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Pass 1: additive grayscale blobs.
      ctx.globalCompositeOperation = "lighter";
      const hotspots = hotspotsRef.current;
      hotspots.forEach((spot) => {
        const v = intensityAt(spot, predictedMinutes);
        if (v < 0.05) return;
        const pt = map.latLngToContainerPoint([spot.lat, spot.lng]);
        const pt2 = map.latLngToContainerPoint([
          spot.lat + spot.r / 111320,
          spot.lng,
        ]);
        const pixelR = Math.max(28, Math.abs(pt.y - pt2.y) * (0.85 + v * 0.55));
        const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pixelR);
        grad.addColorStop(0, `rgba(255,255,255,${0.85 * v})`);
        grad.addColorStop(0.45, `rgba(255,255,255,${0.42 * v})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pixelR, 0, Math.PI * 2);
        ctx.fill();
      });

      // Pass 2: replace per-pixel alpha with the heat palette.
      ctx.globalCompositeOperation = "source-over";
      try {
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = img.data;
        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3] / 255;
          if (a < 0.04) {
            data[i + 3] = 0;
            continue;
          }
          const [r, g, bl, na] = heatRamp(a);
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = bl;
          data[i + 3] = na;
        }
        ctx.putImageData(img, 0, 0);
      } catch {
        // CORS-tainted canvas shouldn't happen here; ignore.
      }
    };

    const schedule = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        draw();
      });
    };

    const onMove = () => schedule();
    const onMoveEnd = () => {
      regenIfNeeded();
      schedule();
    };
    const onResize = () => {
      resize();
      schedule();
    };

    resize();
    regenIfNeeded();
    draw();
    map.on("move", onMove);
    map.on("zoom", onMove);
    map.on("moveend", onMoveEnd);
    map.on("zoomend", onMoveEnd);
    map.on("resize", onResize);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      map.off("move", onMove);
      map.off("zoom", onMove);
      map.off("moveend", onMoveEnd);
      map.off("zoomend", onMoveEnd);
      map.off("resize", onResize);
    };
  }, [mapLayer, predictedMinutes]);

  return <div ref={hostRef} className="leaflet-host" />;
}

export function CongestionPanel({ predictedMinutes, setPredictedMinutes, active, onToggle }) {
  const [hotspots, setHotspots] = useState(getCurrentHotspots);
  useEffect(() => subscribeHotspots(setHotspots), []);

  const t = new Date(Date.now() + predictedMinutes * 60000);
  const eta = t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const hottest = hotspots
    .map((s) => ({ ...s, v: intensityAt(s, predictedMinutes) }))
    .sort((a, b) => b.v - a.v)[0];
  const band = bandIndex(hottest.v);
  const bandLabel = ["Free", "Light", "Busy", "Slow", "Heavy", "Severe"][band];
  const bandColor = CONGESTION_COLORS[band];
  const confidencePct = Math.max(72, Math.round(96 - 0.32 * predictedMinutes));

  const suggest = useMemo(() => {
    let best = { score: Infinity, minute: 0 };
    for (let m = 0; m <= 60; m += 5) {
      const s = hotspots.reduce((acc, sp) => acc + intensityAt(sp, m), 0) / hotspots.length;
      if (s < best.score) best = { score: s, minute: m };
    }
    return best;
  }, [hotspots]);

  const suggestTime = new Date(Date.now() + suggest.minute * 60000)
    .toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const delta = Math.round((1 - suggest.score) * 100 - 40);

  return (
    <div className={`congest-panel cp-v2 ${active ? "on" : ""}`}>
      <div className="cp-head">
        <div className="cp-head-l">
          <div className="cp-title-row">
            <span className="ml-pill">ML</span>
            <span className="cp-title">Predicted congestion</span>
          </div>
          <div className="cp-sub">
            <span className="cp-dot-live" />
            ST-GCN v2.4 · <span className="cp-mono">{confidencePct}%</span> confidence
          </div>
        </div>
        <button className="cp-toggle" onClick={onToggle} aria-pressed={active} aria-label="Toggle congestion forecast">
          <span className={`cp-sw ${active ? "on" : ""}`}><span className="cp-sw-knob" /></span>
        </button>
      </div>

      {active && (
        <>
          <div className="cp-forecast">
            <div className="cp-forecast-l">
              <div className="cp-label">Forecast for</div>
              <div className="cp-time">
                {predictedMinutes === 0 ? "Now" : `+${predictedMinutes} min`}
                <span className="cp-eta"> · {eta}</span>
              </div>
            </div>
            <div className="cp-band" style={{ background: bandColor }}>
              {bandLabel}
            </div>
          </div>

          <div className="cp-scrub">
            <input
              type="range"
              min="0"
              max="75"
              step="5"
              value={predictedMinutes}
              onChange={(e) => setPredictedMinutes(parseInt(e.target.value, 10))}
              style={{ "--cp-fill": `${(predictedMinutes / 75) * 100}%`, "--cp-color": bandColor }}
            />
            <div className="cp-ticks">
              <span>now</span><span>+15</span><span>+30</span><span>+45</span><span>+60</span><span>+75</span>
            </div>
          </div>

          <div className="cp-spark2">
            {Array.from({ length: 16 }, (_, i) => {
              const m = i * 5;
              const v = hotspots.reduce((acc, sp) => acc + intensityAt(sp, m), 0) / hotspots.length;
              const isCur = Math.abs(m - predictedMinutes) < 3;
              return (
                <span
                  key={i}
                  className={`cp-bar ${isCur ? "cur" : ""}`}
                  style={{ height: `${22 + v * 78}%`, background: CONGESTION_COLORS[bandIndex(v)] }}
                />
              );
            })}
          </div>

          <div className="cp-hottest">
            <div className="cp-label">Hottest hotspot</div>
            <div className="cp-hottest-row">
              <span className="cp-hottest-dot" style={{ background: bandColor }} />
              <span className="cp-hottest-name">{hottest.label}</span>
              <span className="cp-hottest-v" style={{ color: bandColor }}>{Math.round(hottest.v * 100)}%</span>
            </div>
          </div>

          <div className="cp-suggest">
            <span className="cp-suggest-ico" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            </span>
            <div className="cp-suggest-text">
              <div className="cp-suggest-h">Best to leave</div>
              <div className="cp-suggest-b">
                <b>{suggest.minute === 0 ? "now" : `in ${suggest.minute} min`}</b>
                {suggest.minute > 0 && <> · {suggestTime}</>}
                <span className="cp-suggest-save"> · save ~{Math.max(5, delta)}% travel time</span>
              </div>
            </div>
          </div>

          <div className="cp-foot">
            Trained on Merseytravel feeds · INRIX sensors · 7-day rolling window
          </div>
        </>
      )}
    </div>
  );
}
