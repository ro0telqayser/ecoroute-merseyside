import { useState, useEffect, useMemo } from "react";
import { RouteMap, CongestionPanel } from "../Map";
import { RECENTS } from "../data";
import {
  IconSwap,
  IconCrosshair,
  IconArrow,
  IconRoute,
  IconLeaf,
  IconPlus,
  IconMinus,
} from "../icons";

function useTickingNumber(target, { stepMs = 60, increment = 0.001 } = {}) {
  const [v, setV] = useState(target);
  useEffect(() => {
    const id = setInterval(() => {
      setV((cur) => cur + increment * (0.6 + Math.random() * 0.9));
    }, stepMs);
    return () => clearInterval(id);
  }, [stepMs, increment]);
  return v;
}

export function HomeScreen({
  from,
  to,
  onChangeFrom,
  onChangeTo,
  onPlan,
  onSelectRecent,
  mapLayer,
  setMapLayer,
  predictedMinutes,
  setPredictedMinutes,
  mapStyle,
  communityCO2,
  userLocation,
  locating,
  locateError,
  onUseMyLocation,
  locationLabel,
  mapApiRef,
}) {
  const live = useTickingNumber(communityCO2, { stepMs: 800, increment: 0.012 });

  return (
    <div className="home-grid">
      <div className="card card-pad rise" style={{ display: "flex", flexDirection: "column" }}>
        <div className="tag tag-amber" style={{ alignSelf: "flex-start", marginBottom: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
          Plan a journey
        </div>
        <h1 className="panel-h1">Where are you off to?</h1>
        <p className="panel-sub">We'll compare four ways across Merseyside — and the greener you choose, the more you earn.</p>

        <div className="input-stack">
          <div className="input-row">
            <div className="input-pin from"><span /></div>
            <input value={from} onChange={(e) => onChangeFrom(e.target.value)} placeholder="From" />
            <button className="swap" onClick={() => { onChangeFrom(to); onChangeTo(from); }} aria-label="Swap">
              <IconSwap />
            </button>
          </div>
          <div className="input-connector" />
          <div className="input-row">
            <div className="input-pin to"><span /></div>
            <input value={to} onChange={(e) => onChangeTo(e.target.value)} placeholder="To" />
          </div>
        </div>

        <button
          className={`btn btn-locate ${locating ? "is-locating" : ""} ${userLocation ? "is-located" : ""}`}
          onClick={onUseMyLocation}
          disabled={locating}
          style={{ marginTop: 10, width: "100%" }}
        >
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
              <IconCrosshair size={14} />
              Use my location
            </>
          )}
        </button>
        {locateError && <div className="locate-err">{locateError}</div>}

        <button className="btn btn-primary" style={{ marginTop: 10, width: "100%" }} onClick={onPlan}>
          Compare routes
          <IconArrow />
        </button>

        <div className="section-h" style={{ marginTop: 22 }}>Recent</div>
        <div className="recents">
          {RECENTS.map((r, i) => (
            <button key={i} className="recent-item" onClick={() => onSelectRecent(r)}>
              <div className="recent-ico">
                <IconRoute />
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

      <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
        <div className="map-panel rise rise-1" style={{ flex: 1 }}>
          <div className="map-shell">
            <RouteMap
              showRoute="none"
              mapLayer={mapLayer}
              predictedMinutes={predictedMinutes}
              style={mapStyle}
              userLocation={userLocation}
              mapApiRef={mapApiRef}
            />
            <div className="map-overlay">
              <button className={mapLayer === "streets" ? "on" : ""} onClick={() => setMapLayer("streets")}>Streets</button>
              <button className={mapLayer === "aq" ? "on" : ""} onClick={() => setMapLayer("aq")}>Air quality</button>
              <button className={mapLayer === "congestion" ? "on" : ""} onClick={() => setMapLayer("congestion")}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <span className="ml-pill ml-pill-sm">ML</span>Congestion
                </span>
              </button>
            </div>
            <div className="map-zoom">
              <button aria-label="Zoom in" onClick={() => mapApiRef?.current?.zoomIn?.()}><IconPlus size={14} /></button>
              <div className="sep" />
              <button aria-label="Zoom out" onClick={() => mapApiRef?.current?.zoomOut?.()}><IconMinus size={14} /></button>
            </div>
            {mapLayer === "aq" && (
              <div className="map-legend">
                <div className="legend-title">PM₂.₅ (μg/m³)</div>
                <div className="legend-row"><span className="legend-swatch" style={{ background: "var(--aq-good)" }} />Good · 0–10</div>
                <div className="legend-row"><span className="legend-swatch" style={{ background: "var(--aq-mid)" }} />Moderate · 11–20</div>
                <div className="legend-row"><span className="legend-swatch" style={{ background: "var(--aq-poor)" }} />Poor · 21+</div>
              </div>
            )}
            {mapLayer === "congestion" && (
              <CongestionPanel
                predictedMinutes={predictedMinutes}
                setPredictedMinutes={setPredictedMinutes}
                active={true}
                onToggle={() => setMapLayer("streets")}
              />
            )}
            {!userLocation && mapLayer !== "congestion" && (
              <div className="map-empty-cta">
                <IconRoute size={14} /> Enter a destination to see routes
              </div>
            )}
            <div className="map-attrib">© OpenStreetMap · © CARTO</div>
          </div>
        </div>

        <div className="ticker rise rise-2">
          <div className="ticker-ico"><IconLeaf size={22} /></div>
          <div className="ticker-body">
            <div className="ticker-label">Merseyside saved together · today</div>
            <div className="ticker-value num">
              <span className="tick-up" key={Math.floor(live * 100)}>{live.toFixed(2)}</span>
              <span className="unit">tonnes CO₂</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 18, paddingRight: 8 }}>
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

export function Confetti({ count = 36, run = true }) {
  const pieces = useMemo(() => {
    if (!run) return [];
    const colors = ["var(--amber)", "var(--navy)", "var(--mode-bike)", "var(--amber-deep)", "#fff"];
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
          left: p.left + "%",
          background: p.color,
          animationDelay: p.delay + "ms",
          animationDuration: p.duration + "ms",
        };
        s["--dx"] = p.dx + "px";
        s["--rot"] = p.rot + "deg";
        return <span key={p.i} className="confetti" style={s} />;
      })}
    </div>
  );
}
