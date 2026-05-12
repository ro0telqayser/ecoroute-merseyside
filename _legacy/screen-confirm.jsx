// screen-confirm.jsx — celebration after picking a mode + route steps

function ConfirmScreen({ from, to, mode, totalSaved, totalPoints, onStart, onBack, mapLayer, mapStyle }) {
  const co2Saved = (0.94 - mode.co2); // vs solo car baseline
  return (
    <div className="confirm">
      {/* Left: map view of selected route */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
        <div className="summary-bar">
          <button className="btn btn-ghost btn-sm" onClick={onBack}>← Change</button>
          <div className="summary-route" style={{ marginLeft: 4 }}>
            <span className="summary-pin from" />
            <span className="name">{from}</span>
            <span className="arrow">→</span>
            <span className="summary-pin to" />
            <span className="name">{to}</span>
          </div>
          {(() => {
            const ModeIco = window['Icon' + mode.key.charAt(0).toUpperCase() + mode.key.slice(1)];
            return (
              <div className={`mode-ico ${mode.key}`} style={{ width: 30, height: 30, borderRadius: 8 }}>
                {ModeIco && <ModeIco size={16} />}
              </div>
            );
          })()}
        </div>

        <div className="map-panel" style={{ flex: 1, position: 'relative' }}>
          <div className="map-shell">
            <window.RouteMap showRoute={mode.key} mapLayer={mapLayer} selected={mode.key} style={mapStyle} />
            <div className="map-zoom">
              <button aria-label="Zoom in"><window.IconPlus size={14} /></button>
              <div className="sep" />
              <button aria-label="Zoom out"><window.IconMinus size={14} /></button>
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

      {/* Right: celebration + steps */}
      <div className="confirm-detail">
        <div className="celebration rise">
          <Confetti run={true} count={42} />
          <div className="cel-label">Nice one</div>
          <div className="cel-title">+{mode.points} points<br/>added to your total.</div>
          <div className="points-burst">
            <window.IconLightning size={14} /> Streak +1 · 13 days
          </div>
          <div className="cel-row">
            <div className="cel-stat">
              <div className="l">CO₂ saved vs car</div>
              <div className="v amber">{co2Saved.toFixed(2)}<span style={{ fontSize: 13, opacity: 0.7, marginLeft: 2, fontWeight: 500 }}>kg</span></div>
            </div>
            <div className="cel-stat">
              <div className="l">Your lifetime</div>
              <div className="v">{(totalSaved + co2Saved).toFixed(1)}<span style={{ fontSize: 13, opacity: 0.7, marginLeft: 2, fontWeight: 500 }}>kg</span></div>
            </div>
            <div className="cel-stat">
              <div className="l">Points balance</div>
              <div className="v amber">{(totalPoints + mode.points).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="card card-pad rise rise-1">
          <div className="section-h">Step by step</div>
          <div className="steplist">
            {mode.steps.map((s, i) => (
              <div key={i} className="step">
                <div className="step-pin">
                  <div className={`dot ${i === mode.steps.length - 1 ? 'dest' : ''}`} />
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

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onStart}>
            Start trip
            <window.IconArrow />
          </button>
          <button className="btn btn-ghost" onClick={onBack}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ConfirmScreen });
