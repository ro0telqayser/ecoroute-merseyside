// screen-stats.jsx — Personal dashboard with weekly chart, leaderboard, achievements

function StatsScreen({ totalSaved, totalPoints, totalTrips }) {
  const maxWeek = Math.max(...window.WEEK.map(w => w.v), 0.1);
  const weekSum = window.WEEK.reduce((a, b) => a + b.v, 0);

  return (
    <div className="stats">
      <div className="stats-hero rise">
        <div>
          <div className="hero-title">Hi Alex — week 18 of 2026</div>
          <div className="hero-sub">You're in the top 12% of Merseyside this week.</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <span className="tag" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>
              <window.IconFlame size={12} /> 13 day streak
            </span>
            <span className="tag" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>
              <window.IconStar size={12} /> Level 4 · Commuter
            </span>
          </div>
        </div>
        <div className="hero-stat">
          <div className="l">CO₂ saved</div>
          <div className="v amber">{totalSaved.toFixed(1)}<span style={{ fontSize: 14, opacity: 0.7, marginLeft: 2, fontWeight: 500 }}>kg</span></div>
          <div className="delta">+{weekSum.toFixed(2)} kg this week</div>
        </div>
        <div className="hero-stat">
          <div className="l">Points</div>
          <div className="v">{totalPoints.toLocaleString()}</div>
          <div className="delta">+185 this week</div>
        </div>
        <div className="hero-stat">
          <div className="l">Trips</div>
          <div className="v">{totalTrips}</div>
          <div className="delta">+7 this week</div>
        </div>
      </div>

      <div className="chart-card rise rise-1" style={{ gridColumn: '1' }}>
        <h3>This week's CO₂ saved</h3>
        <p className="sub">vs solo car baseline · kg CO₂e</p>
        <div className="chart-bars">
          {window.WEEK.map((w, i) => {
            const h = (w.v / maxWeek) * 100;
            const cls = w.mode === 'bike' ? 'green' : w.mode === 'off' ? 'muted' : w.mode === 'bus' ? '' : 'amber';
            return (
              <div key={i} className="chart-bar-col">
                <div style={{ fontSize: 10, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', marginBottom: 4 }}>
                  {w.v > 0 ? w.v.toFixed(2) : '—'}
                </div>
                <div className={`chart-bar ${cls}`} style={{ height: `${h}%` }} />
                <div className="chart-bar-label">{w.d}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--hairline-soft)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-soft)' }}>
            <span className="legend-swatch" style={{ background: 'var(--mode-bike)' }} />Bike
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-soft)' }}>
            <span className="legend-swatch" style={{ background: 'var(--amber)' }} />Train / bus
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-soft)' }}>
            <span className="legend-swatch" style={{ background: 'var(--hairline)' }} />Rest day
          </div>
        </div>
      </div>

      <div className="leaderboard rise rise-2">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h3>Merseyside leaderboard</h3>
          <span style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>This week</span>
        </div>
        <div style={{ marginTop: 4 }}>
          {window.LEADERBOARD.map((l, i) => (
            <div key={i} className={`leader-row ${l.you ? 'you' : ''}`}>
              <div className="leader-rank">{(i + 1).toString().padStart(2, '0')}</div>
              <div className="leader-avatar" style={l.you ? { background: 'var(--navy)', color: '#fff' } : {}}>{l.av}</div>
              <div className="leader-name">{l.name}</div>
              <div className="leader-pts">{l.pts.toLocaleString()} pts</div>
            </div>
          ))}
        </div>
      </div>

      <div className="achievements rise rise-3" style={{ gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h3>Achievements</h3>
          <span style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
            {window.ACHIEVEMENTS.filter(a => a.earned).length} / {window.ACHIEVEMENTS.length} earned
          </span>
        </div>
        <div className="achievement-grid">
          {window.ACHIEVEMENTS.map((a, i) => (
            <div key={i} className={`achievement ${a.earned ? 'earned' : 'locked'}`}>
              <div className="ach-ico">
                {a.earned ? <a.Ico size={16} /> : <window.IconLock size={14} />}
              </div>
              <div className="ach-name">{a.name}</div>
              <div className="ach-desc">{a.desc}</div>
              {a.prog && !a.earned && (
                <div style={{ fontSize: 10, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                  {a.prog}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { StatsScreen });
