import { RouteMap } from "../Map";
import { Confetti } from "./HomeScreen";
import { IconArrow, IconLeaf, IconLightning, IconPlus, IconMinus } from "../icons";

const GREEN_MODES = new Set(["bike", "train"]);

function getAdvice(mode) {
  if (mode.key === "bus") {
    return {
      tier: "medium",
      label: "Shared transport",
      headline: "Buses spread emissions across many passengers.",
      body:
        "It's better than driving alone, but next time try to reduce using environmentally harmful machines — switching short hops to a bike or walking cuts emissions further.",
    };
  }
  return {
    tier: "high",
    label: "Higher-impact option",
    headline: "Solo driving emits the most CO₂ of the options shown.",
    body:
      "This trip will release about 0.94 kg of CO₂ on its own. Next time, try to reduce using environmentally harmful vehicles — even swapping one car trip a week for the bus, train, or a bike makes a measurable difference for Merseyside's air.",
  };
}

export function ConfirmScreen({ from, to, mode, totalSaved, totalPoints, onStart, onBack, mapLayer, mapStyle }) {
  const ModeIco = mode.Icon;
  const co2Saved = 0.94 - mode.co2;
  const isGreen = GREEN_MODES.has(mode.key);
  const advice = isGreen ? null : getAdvice(mode);

  return (
    <div className="confirm">
      <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
        <div className="summary-bar">
          <button className="btn btn-ghost btn-sm" onClick={onBack}>← Change</button>
          <div className="summary-route" style={{ marginLeft: 4 }}>
            <span className="summary-pin from" />
            <span className="name">{from}</span>
            <span className="arrow">→</span>
            <span className="summary-pin to" />
            <span className="name">{to}</span>
          </div>
          <div className={`mode-ico ${mode.key}`} style={{ width: 30, height: 30, borderRadius: 8 }}>
            {ModeIco && <ModeIco size={16} />}
          </div>
        </div>

        <div className="map-panel" style={{ flex: 1, position: "relative" }}>
          <div className="map-shell">
            <RouteMap showRoute={mode.key} mapLayer={mapLayer} selected={mode.key} style={mapStyle} />
            <div className="map-zoom">
              <button aria-label="Zoom in"><IconPlus size={14} /></button>
              <div className="sep" />
              <button aria-label="Zoom out"><IconMinus size={14} /></button>
            </div>
            <div className="map-legend">
              <div className="legend-title">Selected</div>
              <div className="legend-row">
                <span className="legend-swatch" style={{ background: `var(--mode-${mode.key})` }} />
                {mode.label} · {mode.distance.toFixed(1)} km
              </div>
            </div>
            <div className="map-attrib">© EcoRoute Tiles · OpenRouteService</div>
          </div>
        </div>
      </div>

      <div className="confirm-detail">
        {isGreen ? (
          <div className="celebration rise">
            <Confetti run={true} count={42} />
            <div className="cel-label">You won</div>
            <div className="cel-title">+{mode.points} points<br />added to your total.</div>
            <div className="points-burst">
              <IconLightning size={14} /> Streak +1 · 13 days
            </div>
            <div className="cel-row">
              <div className="cel-stat">
                <div className="l">CO₂ saved vs car</div>
                <div className="v amber">
                  {co2Saved.toFixed(2)}
                  <span style={{ fontSize: 13, opacity: 0.7, marginLeft: 2, fontWeight: 500 }}>kg</span>
                </div>
              </div>
              <div className="cel-stat">
                <div className="l">Your lifetime</div>
                <div className="v">
                  {(totalSaved + co2Saved).toFixed(1)}
                  <span style={{ fontSize: 13, opacity: 0.7, marginLeft: 2, fontWeight: 500 }}>kg</span>
                </div>
              </div>
              <div className="cel-stat">
                <div className="l">Points balance</div>
                <div className="v amber">{(totalPoints + mode.points).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`card card-pad rise eco-note eco-${advice.tier}`}>
            <div className="eco-note-head">
              <div className="eco-note-icon" aria-hidden="true">
                <IconLeaf size={16} />
              </div>
              <div className="eco-note-label">{advice.label}</div>
            </div>
            <div className="eco-note-title">{advice.headline}</div>
            <p className="eco-note-body">{advice.body}</p>
            <div className="eco-note-stats">
              <div>
                <div className="l">This trip · CO₂</div>
                <div className="v num">
                  {mode.co2.toFixed(2)}
                  <span style={{ fontSize: 12, opacity: 0.7, marginLeft: 3, fontWeight: 500 }}>kg</span>
                </div>
              </div>
              <div>
                <div className="l">Distance</div>
                <div className="v num">
                  {mode.distance.toFixed(1)}
                  <span style={{ fontSize: 12, opacity: 0.7, marginLeft: 3, fontWeight: 500 }}>km</span>
                </div>
              </div>
              <div>
                <div className="l">Time</div>
                <div className="v num">
                  {mode.time}
                  <span style={{ fontSize: 12, opacity: 0.7, marginLeft: 3, fontWeight: 500 }}>min</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card card-pad rise rise-1">
          <div className="section-h">Step by step</div>
          <div className="steplist">
            {mode.steps.map((s, i) => (
              <div key={i} className="step">
                <div className="step-pin">
                  <div className={`dot ${i === mode.steps.length - 1 ? "dest" : ""}`} />
                  {i < mode.steps.length - 1 && <div className="line" />}
                </div>
                <div className="step-body">
                  <div className="step-title">{s.t}</div>
                  <div className="step-meta">{s.m}</div>
                </div>
                <div className="step-time num">{s.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onStart}>
            {isGreen ? "Start trip" : "Continue"}
            <IconArrow />
          </button>
          <button className="btn btn-ghost" onClick={onBack}>{isGreen ? "Cancel" : "Back"}</button>
        </div>
      </div>
    </div>
  );
}
