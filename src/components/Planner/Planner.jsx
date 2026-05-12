import { useState, useEffect, useCallback, useRef } from "react";
import { DEMO_ROUTE, MODES } from "./data";
import { HomeScreen } from "./screens/HomeScreen";
import { CompareScreen } from "./screens/CompareScreen";
import { ConfirmScreen } from "./screens/ConfirmScreen";
import { StatsScreen } from "./screens/StatsScreen";
import {
  IconMap,
  IconCompare,
  IconRoute,
  IconChart,
  IconTrophy,
  IconLeaf,
} from "./icons";
import "./Planner.css";

export function Planner({ initialFrom, initialTo, initialScreen = "home", onBackToLanding }) {
  const [screen, setScreen] = useState(initialScreen);
  const [from, setFrom] = useState(initialFrom || DEMO_ROUTE.from);
  const [to, setTo] = useState(initialTo || DEMO_ROUTE.to);
  const [mapLayer, setMapLayer] = useState("streets");
  const [predictedMinutes, setPredictedMinutes] = useState(0);
  const [selectedMode, setSelectedMode] = useState("bike");
  const [chosenMode, setChosenMode] = useState(null);
  const [planning, setPlanning] = useState(false);

  const [totalSaved, setTotalSaved] = useState(318.0);
  const [totalPoints, setTotalPoints] = useState(1245);
  const [totalTrips, setTotalTrips] = useState(47);
  const [communityCO2, setCommunityCO2] = useState(8.42);

  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState(null);
  const [locationLabel, setLocationLabel] = useState(null);

  const mapApiRef = useRef(null);

  const handleUseMyLocation = useCallback(() => {
    setLocateError(null);
    setLocating(true);
    const finish = (loc, label) => {
      setUserLocation(loc);
      setLocationLabel(label);
      setFrom(label || "My location");
      setLocating(false);
    };
    const fallback = () => {
      finish({ lat: 53.4084, lng: -2.9916 }, "Liverpool city centre");
    };
    if (!navigator.geolocation) {
      setLocateError("Geolocation unsupported");
      fallback();
      return;
    }
    let done = false;
    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      setLocateError("Using approximate location");
      fallback();
    }, 4000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        finish({ lat: pos.coords.latitude, lng: pos.coords.longitude }, "Current location");
      },
      (err) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        setLocateError(
          err.code === 1 ? "Permission denied — using demo location" : "Couldn't locate — using demo location"
        );
        fallback();
      },
      { enableHighAccuracy: false, timeout: 3500, maximumAge: 60000 }
    );
  }, []);

  // Palette is defined in Planner.css (.planner-app scope) — no runtime overrides needed.

  const handlePlan = () => {
    setPlanning(true);
    setTimeout(() => {
      setPlanning(false);
      setScreen("compare");
      setSelectedMode("bike");
    }, 700);
  };

  const handleChoose = () => {
    const mode = MODES.find((m) => m.key === selectedMode);
    setChosenMode(mode);
    setScreen("confirm");
  };

  const handleStart = () => {
    if (chosenMode) {
      const isGreen = chosenMode.key === "bike" || chosenMode.key === "train";
      setTotalSaved((v) => v + (0.94 - chosenMode.co2));
      setTotalTrips((v) => v + 1);
      setCommunityCO2((v) => v + (0.94 - chosenMode.co2) / 1000);
      if (isGreen) {
        setTotalPoints((v) => v + chosenMode.points);
      }
    }
    setScreen("stats");
  };

  const goHome = () => {
    setScreen("home");
    setChosenMode(null);
  };

  return (
    <div className="planner-app">
      <aside className="sidebar" data-screen-label="Sidebar">
        <button
          className="brand"
          onClick={onBackToLanding}
          style={{ background: "transparent", border: 0, padding: 0, color: "inherit", textAlign: "left", cursor: "pointer", width: "100%", display: "flex", alignItems: "center", gap: 10 }}
          aria-label="Back to landing page"
        >
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
        </button>

        <div>
          <div className="nav-section">Travel</div>
          <nav className="nav">
            <button className={`nav-item ${screen === "home" ? "active" : ""}`} onClick={goHome}>
              <IconMap /> Plan a trip
            </button>
            <button
              className={`nav-item ${screen === "compare" ? "active" : ""}`}
              onClick={() => screen !== "home" && setScreen("compare")}
              disabled={screen === "home"}
              style={screen === "home" ? { opacity: 0.5, cursor: "default" } : {}}
            >
              <IconCompare /> Compare
            </button>
            <button className="nav-item">
              <IconRoute size={16} /> Saved routes
            </button>
          </nav>
        </div>

        <div>
          <div className="nav-section">You</div>
          <nav className="nav">
            <button className={`nav-item ${screen === "stats" ? "active" : ""}`} onClick={() => setScreen("stats")}>
              <IconChart /> Stats
            </button>
            <button className="nav-item">
              <IconTrophy /> Achievements
            </button>
            <button className="nav-item">
              <IconLeaf /> Community
            </button>
          </nav>
        </div>

        <div className="sidebar-foot">
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-mono)", padding: "0 4px 6px" }}>
            Lifetime
          </div>
          <div style={{ display: "flex", gap: 8, padding: "0 4px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-mono)", letterSpacing: "-0.02em" }}>
                {totalSaved.toFixed(0)}<span style={{ fontSize: 10, opacity: 0.55, fontWeight: 500, marginLeft: 2 }}>kg</span>
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-mono)" }}>CO₂ saved</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-mono)", letterSpacing: "-0.02em", color: "var(--amber)" }}>
                {totalPoints.toLocaleString()}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-mono)" }}>Points</div>
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

      <main className="main">
        <div className="topbar">
          <div className="crumb">
            {screen === "home" && <>EcoRoute / <b>Plan</b></>}
            {screen === "compare" && <>EcoRoute / Plan / <b>Compare</b></>}
            {screen === "confirm" && <>EcoRoute / Plan / Compare / <b>{chosenMode?.label}</b></>}
            {screen === "stats" && <>EcoRoute / <b>Stats</b></>}
          </div>
          <div className="topbar-right">
            <span className="live-dot" />
            <span>Live · Merseyside</span>
            <span style={{ color: "var(--hairline)", margin: "0 4px" }}>·</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5 }}>
              {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
            </span>
          </div>
        </div>

        <div className="screen" data-screen-label={`Screen / ${screen}`}>
          {screen === "home" && (
            <HomeScreen
              from={from}
              to={to}
              onChangeFrom={setFrom}
              onChangeTo={setTo}
              onPlan={handlePlan}
              onSelectRecent={(r) => { setFrom(r.from); setTo(r.to); handlePlan(); }}
              mapLayer={mapLayer}
              setMapLayer={setMapLayer}
              predictedMinutes={predictedMinutes}
              setPredictedMinutes={setPredictedMinutes}
              mapStyle="realistic"
              communityCO2={communityCO2}
              userLocation={userLocation}
              locating={locating}
              locateError={locateError}
              onUseMyLocation={handleUseMyLocation}
              locationLabel={locationLabel}
              mapApiRef={mapApiRef}
            />
          )}
          {screen === "compare" && (
            <CompareScreen
              from={from}
              to={to}
              modes={MODES}
              selected={selectedMode}
              setSelected={setSelectedMode}
              onChoose={handleChoose}
              mapLayer={mapLayer}
              setMapLayer={setMapLayer}
              predictedMinutes={predictedMinutes}
              setPredictedMinutes={setPredictedMinutes}
              mapStyle="realistic"
              cardLayout="cards"
            />
          )}
          {screen === "confirm" && chosenMode && (
            <ConfirmScreen
              from={from}
              to={to}
              mode={chosenMode}
              totalSaved={totalSaved}
              totalPoints={totalPoints}
              onStart={handleStart}
              onBack={() => setScreen("compare")}
              mapLayer={mapLayer}
              mapStyle="realistic"
            />
          )}
          {screen === "stats" && (
            <StatsScreen totalSaved={totalSaved} totalPoints={totalPoints} totalTrips={totalTrips} />
          )}
        </div>

        {planning && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(20,30,60,0.18)", display: "grid", placeItems: "center", zIndex: 100 }}>
            <div className="loader">
              <div className="spinner" />
              <div>Routing via OpenRouteService…</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
