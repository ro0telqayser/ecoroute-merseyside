import { RouteMap, CongestionPanel } from "../Map";
import { IconCheck, IconPlus, IconMinus } from "../icons";

function ModeIcon({ mode, size = 18 }) {
  const I = mode.Icon;
  return <I size={size} />;
}

function ModeCard({ mode, selected, dimmed, onSelect, onChoose }) {
  return (
    <div
      className={`mode-card ${selected ? "selected" : ""} ${dimmed ? "dimmed" : ""}`}
      onClick={onSelect}
    >
      <div className="points-pill">
        {mode.points > 0 ? `+${mode.points} pts` : "0 pts"}
      </div>
      <div className="mode-card-h">
        <div className={`mode-ico ${mode.key}`}><ModeIcon mode={mode} /></div>
        <div>
          <div className="label">{mode.label}</div>
          <div className="sublabel">{mode.sublabel}</div>
        </div>
      </div>
      <div className="mode-card-stats">
        <div className="stat">
          <div className="stat-l">CO₂</div>
          <div className="stat-v">
            {mode.co2.toFixed(2)}<span className="stat-u">kg</span>
          </div>
        </div>
        <div className="stat">
          <div className="stat-l">Time</div>
          <div className="stat-v">{mode.time}<span className="stat-u">min</span></div>
        </div>
        <div className="stat">
          <div className="stat-l">Distance</div>
          <div className="stat-v">{mode.distance.toFixed(1)}<span className="stat-u">km</span></div>
        </div>
      </div>
      <div className="mode-badges">
        {mode.badges.map((b, i) => (
          <span key={i} className={`badge badge-${b.kind}`}>{b.text}</span>
        ))}
      </div>
      {selected && (
        <button
          className="btn btn-accent btn-sm"
          style={{ width: "100%", marginTop: 12 }}
          onClick={(e) => { e.stopPropagation(); onChoose(); }}
        >
          <IconCheck size={14} /> Choose this route
        </button>
      )}
    </div>
  );
}

export function CompareScreen({
  from,
  to,
  modes,
  selected,
  setSelected,
  onChoose,
  mapLayer,
  setMapLayer,
  predictedMinutes,
  setPredictedMinutes,
  mapStyle,
  cardLayout,
}) {
  return (
    <div className="compare">
      <div className="compare-map">
        <div className="summary-bar">
          <div className="summary-route">
            <span className="summary-pin from" />
            <span className="name">{from}</span>
            <span className="arrow">→</span>
            <span className="summary-pin to" />
            <span className="name">{to}</span>
          </div>
          <div className="summary-meta">4 ways · planned now</div>
        </div>
        <div className="map-panel" style={{ flex: 1 }}>
          <div className="map-shell">
            <RouteMap
              showRoute="all"
              mapLayer={mapLayer}
              predictedMinutes={predictedMinutes}
              selected={selected}
              style={mapStyle}
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
            {mapLayer === "congestion" && (
              <CongestionPanel
                predictedMinutes={predictedMinutes}
                setPredictedMinutes={setPredictedMinutes}
                active={true}
                onToggle={() => setMapLayer("streets")}
              />
            )}
            <div className="map-zoom">
              <button aria-label="Zoom in"><IconPlus size={14} /></button>
              <div className="sep" />
              <button aria-label="Zoom out"><IconMinus size={14} /></button>
            </div>
            <div className="map-legend" style={{ minWidth: 140 }}>
              <div className="legend-title">Modes</div>
              {modes.map((m) => (
                <div key={m.key} className="legend-row" style={{ opacity: selected && selected !== m.key ? 0.45 : 1 }}>
                  <span className="legend-swatch" style={{ background: `var(--mode-${m.key})` }} />
                  {m.label}
                </div>
              ))}
            </div>
            <div className="map-attrib">© EcoRoute Tiles · OpenRouteService</div>
          </div>
        </div>
      </div>

      <div className="compare-rail">
        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>Pick your way</h2>
            <span style={{ fontSize: 11, color: "var(--ink-faint)", fontFamily: "var(--font-mono)" }}>
              {modes.length} options
            </span>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--ink-soft)" }}>
            Lower CO₂ earns more points. <strong style={{ color: "var(--mode-bike)" }}>Greenest</strong> saves <span className="num" style={{ fontWeight: 600 }}>0.94 kg</span> vs solo car.
          </p>
        </div>

        {cardLayout === "table" ? (
          <div className="compare-table">
            <table>
              <thead>
                <tr>
                  <th>Mode</th>
                  <th style={{ textAlign: "right" }}>CO₂</th>
                  <th style={{ textAlign: "right" }}>Time</th>
                  <th style={{ textAlign: "right" }}>Points</th>
                </tr>
              </thead>
              <tbody>
                {modes.map((m) => (
                  <tr key={m.key} className={selected === m.key ? "selected" : ""} onClick={() => setSelected(m.key)}>
                    <td>
                      <div className="td-mode">
                        <div className={`mode-ico ${m.key}`} style={{ width: 26, height: 26, borderRadius: 7 }}>
                          <ModeIcon mode={m} size={14} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{m.label}</div>
                          <div style={{ fontSize: 11, color: "var(--ink-faint)", fontFamily: "var(--font-mono)" }}>{m.distance.toFixed(1)} km</div>
                        </div>
                      </div>
                    </td>
                    <td className="num" style={{ textAlign: "right", fontWeight: 600 }}>{m.co2.toFixed(2)} kg</td>
                    <td className="num" style={{ textAlign: "right" }}>{m.time} min</td>
                    <td className="num" style={{ textAlign: "right", fontWeight: 600, color: m.points > 0 ? "var(--mode-bike)" : "var(--ink-faint)" }}>
                      {m.points > 0 ? `+${m.points}` : "0"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selected && (
              <div style={{ padding: 14, borderTop: "1px solid var(--hairline-soft)" }}>
                <button className="btn btn-accent" style={{ width: "100%" }} onClick={onChoose}>
                  <IconCheck size={14} /> Choose {modes.find((m) => m.key === selected).label}
                </button>
              </div>
            )}
          </div>
        ) : (
          modes.map((m, i) => (
            <div key={m.key} className={`rise rise-${Math.min(i + 1, 4)}`}>
              <ModeCard
                mode={m}
                selected={selected === m.key}
                dimmed={selected && selected !== m.key}
                onSelect={() => setSelected(m.key)}
                onChoose={onChoose}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
