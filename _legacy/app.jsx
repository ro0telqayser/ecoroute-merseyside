// app.jsx — Root app: sidebar + screen router + state + Tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": ["#1c2a52","#e3a634","#fafaf7"],
  "mapStyle": "realistic",
  "cardLayout": "cards",
  "pointsStyle": "celebratory"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  const [screen, setScreen] = React.useState('home'); // home | compare | confirm | stats
  const [from, setFrom] = React.useState(window.DEMO_ROUTE.from);
  const [to, setTo] = React.useState(window.DEMO_ROUTE.to);
  const [mapLayer, setMapLayer] = React.useState('streets'); // streets | aq | congestion
  const [predictedMinutes, setPredictedMinutes] = React.useState(0);
  const [selectedMode, setSelectedMode] = React.useState('bike');
  const [chosenMode, setChosenMode] = React.useState(null);
  const [planning, setPlanning] = React.useState(false);

  // user totals
  const [totalSaved, setTotalSaved] = React.useState(318.0);
  const [totalPoints, setTotalPoints] = React.useState(1245);
  const [totalTrips, setTotalTrips] = React.useState(47);

  const [communityCO2, setCommunityCO2] = React.useState(8.42); // tonnes today

  // geolocation
  const [userLocation, setUserLocation] = React.useState(null); // {lat, lng}
  const [locating, setLocating] = React.useState(false);
  const [locateError, setLocateError] = React.useState(null);
  const [locationLabel, setLocationLabel] = React.useState(null);

  const handleUseMyLocation = React.useCallback(() => {
    setLocateError(null);
    setLocating(true);
    const finish = (loc, label) => {
      setUserLocation(loc);
      setLocationLabel(label);
      setFrom(label || 'My location');
      setLocating(false);
    };
    const fallback = () => {
      // Liverpool city centre fallback for demo reliability
      finish({ lat: 53.4084, lng: -2.9916 }, 'Liverpool city centre');
    };
    if (!navigator.geolocation) { setLocateError('Geolocation unsupported'); fallback(); return; }
    let done = false;
    const timer = setTimeout(() => {
      if (done) return; done = true;
      setLocateError('Using approximate location');
      fallback();
    }, 4000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (done) return; done = true; clearTimeout(timer);
        finish({ lat: pos.coords.latitude, lng: pos.coords.longitude }, 'Current location');
      },
      (err) => {
        if (done) return; done = true; clearTimeout(timer);
        setLocateError(err.code === 1 ? 'Permission denied — using demo location' : 'Couldn\'t locate — using demo location');
        fallback();
      },
      { enableHighAccuracy: false, timeout: 3500, maximumAge: 60000 }
    );
  }, []);

  // Apply theme tweaks via CSS variables
  React.useEffect(() => {
    const root = document.documentElement;
    if (Array.isArray(tweaks.theme)) {
      // Convert hex to oklch-ish for primary navy
      root.style.setProperty('--navy', tweaks.theme[0]);
      root.style.setProperty('--navy-deep', tweaks.theme[0]);
      root.style.setProperty('--amber', tweaks.theme[1]);
      root.style.setProperty('--paper', tweaks.theme[2]);
    }
  }, [tweaks.theme]);

  const handlePlan = () => {
    setPlanning(true);
    setTimeout(() => {
      setPlanning(false);
      setScreen('compare');
      setSelectedMode('bike');
    }, 700);
  };

  const handleChoose = () => {
    const mode = window.MODES.find(m => m.key === selectedMode);
    setChosenMode(mode);
    setScreen('confirm');
  };

  const handleStart = () => {
    if (chosenMode) {
      setTotalSaved((v) => v + (0.94 - chosenMode.co2));
      setTotalPoints((v) => v + chosenMode.points);
      setTotalTrips((v) => v + 1);
      setCommunityCO2((v) => v + (0.94 - chosenMode.co2) / 1000);
    }
    setScreen('stats');
  };

  // Reset to home with a tap
  const goHome = () => { setScreen('home'); setChosenMode(null); };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar" data-screen-label="Sidebar">
        <div className="brand">
          <div className="brand-mark">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M5 19c4-4 8-8 14-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="brand-name">EcoRoute</div>
            <div className="brand-sub">Merseyside</div>
          </div>
        </div>

        <div>
          <div className="nav-section">Travel</div>
          <nav className="nav">
            <button className={`nav-item ${screen === 'home' ? 'active' : ''}`} onClick={goHome}>
              <window.IconMap /> Plan a trip
            </button>
            <button className={`nav-item ${screen === 'compare' ? 'active' : ''}`}
                    onClick={() => screen !== 'home' && setScreen('compare')}
                    disabled={screen === 'home'} style={screen === 'home' ? { opacity: 0.5, cursor: 'default' } : {}}>
              <window.IconCompare /> Compare
            </button>
            <button className="nav-item">
              <window.IconRoute size={16} /> Saved routes
            </button>
          </nav>
        </div>

        <div>
          <div className="nav-section">You</div>
          <nav className="nav">
            <button className={`nav-item ${screen === 'stats' ? 'active' : ''}`}
                    onClick={() => setScreen('stats')}>
              <window.IconChart /> Stats
            </button>
            <button className="nav-item">
              <window.IconTrophy /> Achievements
            </button>
            <button className="nav-item">
              <window.IconLeaf /> Community
            </button>
          </nav>
        </div>

        <div className="sidebar-foot">
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', padding: '0 4px 6px' }}>
            Lifetime
          </div>
          <div style={{ display: 'flex', gap: 8, padding: '0 4px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>
                {totalSaved.toFixed(0)}<span style={{ fontSize: 10, opacity: 0.55, fontWeight: 500, marginLeft: 2 }}>kg</span>
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>CO₂ saved</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em', color: 'var(--amber)' }}>
                {totalPoints.toLocaleString()}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>Points</div>
            </div>
          </div>
          <div className="user-chip">
            <div className="user-avatar">AS</div>
            <div>
              <div className="user-name">Alex S.</div>
              <div className="user-meta">L17 · Level 4</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main pane */}
      <main className="main">
        <div className="topbar">
          <div className="crumb">
            {screen === 'home' && <>EcoRoute / <b>Plan</b></>}
            {screen === 'compare' && <>EcoRoute / Plan / <b>Compare</b></>}
            {screen === 'confirm' && <>EcoRoute / Plan / Compare / <b>{chosenMode?.label}</b></>}
            {screen === 'stats' && <>EcoRoute / <b>Stats</b></>}
          </div>
          <div className="topbar-right">
            <span className="live-dot" />
            <span>Live · Merseyside</span>
            <span style={{ color: 'var(--hairline)', margin: '0 4px' }}>·</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>
              {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>

        <div className="screen" data-screen-label={`Screen / ${screen}`}>
          {screen === 'home' && (
            <window.HomeScreen
              from={from} to={to}
              onChangeFrom={setFrom} onChangeTo={setTo}
              onPlan={handlePlan}
              onSelectRecent={(r) => { setFrom(r.from); setTo(r.to); handlePlan(); }}
              mapLayer={mapLayer} setMapLayer={setMapLayer}
              predictedMinutes={predictedMinutes} setPredictedMinutes={setPredictedMinutes}
              mapStyle={tweaks.mapStyle}
              communityCO2={communityCO2}
              userLocation={userLocation}
              locating={locating}
              locateError={locateError}
              onUseMyLocation={handleUseMyLocation}
              locationLabel={locationLabel}
            />
          )}
          {screen === 'compare' && (
            <window.CompareScreen
              from={from} to={to}
              modes={window.MODES}
              selected={selectedMode} setSelected={setSelectedMode}
              onChoose={handleChoose}
              mapLayer={mapLayer} setMapLayer={setMapLayer}
              predictedMinutes={predictedMinutes} setPredictedMinutes={setPredictedMinutes}
              mapStyle={tweaks.mapStyle}
              cardLayout={tweaks.cardLayout}
            />
          )}
          {screen === 'confirm' && chosenMode && (
            <window.ConfirmScreen
              from={from} to={to}
              mode={chosenMode}
              totalSaved={totalSaved} totalPoints={totalPoints}
              onStart={handleStart}
              onBack={() => setScreen('compare')}
              mapLayer={mapLayer} mapStyle={tweaks.mapStyle}
            />
          )}
          {screen === 'stats' && (
            <window.StatsScreen
              totalSaved={totalSaved} totalPoints={totalPoints} totalTrips={totalTrips}
            />
          )}
        </div>

        {planning && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,30,60,0.18)', display: 'grid', placeItems: 'center', zIndex: 100 }}>
            <div className="loader">
              <div className="spinner" />
              <div>Routing via OpenRouteService…</div>
            </div>
          </div>
        )}
      </main>

      {/* Tweaks */}
      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Theme">
          <window.TweakColor label="Palette" value={tweaks.theme}
            options={[
              ["#1c2a52", "#e3a634", "#fafaf7"], /* civic navy + amber */
              ["#0f3d2e", "#d9a441", "#f7f4ec"], /* forest + brass */
              ["#3a2a4a", "#f4a259", "#faf6f0"], /* aubergine + sunset */
              ["#1a1a1a", "#ff6b35", "#f5f5f4"], /* mono + ember */
            ]}
            onChange={(v) => setTweak('theme', v)} />
        </window.TweakSection>

        <window.TweakSection label="Map">
          <window.TweakRadio label="Style" value={tweaks.mapStyle}
            options={['realistic', 'dark', 'illustrated']}
            onChange={(v) => setTweak('mapStyle', v)} />
        </window.TweakSection>

        <window.TweakSection label="Compare layout">
          <window.TweakRadio label="Modes" value={tweaks.cardLayout}
            options={['cards', 'table']}
            onChange={(v) => setTweak('cardLayout', v)} />
        </window.TweakSection>

        <window.TweakSection label="Demo">
          <window.TweakButton label="Reset to home" onClick={() => { setScreen('home'); setChosenMode(null); setSelectedMode('bike'); }} />
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
