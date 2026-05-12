import { useState, useCallback } from "react";
import { DEMO_ROUTE } from "../Planner/data";
import { IconSwap, IconCrosshair, IconArrow } from "../Planner/icons";
import liverpoolImage from "../../assets/images/liverpool_image.png";
import "../Planner/Planner.css";
import "./Landing.css";

export function Landing({ onLaunch }) {
  const [from, setFrom] = useState(DEMO_ROUTE.from);
  const [to, setTo] = useState(DEMO_ROUTE.to);
  const [locating, setLocating] = useState(false);
  const [locatedLabel, setLocatedLabel] = useState(null);
  const [locateError, setLocateError] = useState(null);

  const handleUseMyLocation = useCallback(() => {
    setLocateError(null);
    setLocating(true);
    const finish = (label) => {
      setLocatedLabel(label);
      setFrom(label);
      setLocating(false);
    };
    const fallback = () => finish("Liverpool city centre");
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
      () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        finish("Current location");
      },
      (err) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        setLocateError(
          err.code === 1
            ? "Permission denied — using demo location"
            : "Couldn't locate — using demo location"
        );
        fallback();
      },
      { enableHighAccuracy: false, timeout: 3500, maximumAge: 60000 }
    );
  }, []);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleCompare = (e) => {
    e?.preventDefault?.();
    onLaunch?.({ from, to });
  };

  return (
    <div
      className="planner-app landing-app"
      style={{ backgroundImage: `url(${liverpoolImage})` }}
    >
      <div className="landing-overlay" aria-hidden="true" />
      <div className="landing-shell">
        <header className="landing-topbar">
          <div className="landing-brand">
            <div className="brand-mark">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 19c4-4 8-8 14-14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <div className="brand-name">EcoRoute</div>
              <div className="brand-sub">Merseyside</div>
            </div>
          </div>
        </header>

        <main className="landing-main">
          <form className="card card-pad landing-card" onSubmit={handleCompare}>
            <div className="tag tag-amber landing-tag">
              <span className="landing-tag-dot" />
              Plan a journey
            </div>

            <h1 className="panel-h1 landing-h1">Where are you off to?</h1>
            <p className="panel-sub landing-sub">
              We'll compare four ways across Merseyside — and the greener you
              choose, the more you earn.
            </p>

            <div className="input-stack">
              <div className="input-row">
                <div className="input-pin from">
                  <span />
                </div>
                <input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="From"
                  aria-label="From"
                />
                <button
                  type="button"
                  className="swap"
                  onClick={handleSwap}
                  aria-label="Swap"
                >
                  <IconSwap />
                </button>
              </div>
              <div className="input-connector" />
              <div className="input-row">
                <div className="input-pin to">
                  <span />
                </div>
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="To"
                  aria-label="To"
                />
              </div>
            </div>

            <button
              type="button"
              className={`btn btn-locate ${locating ? "is-locating" : ""} ${
                locatedLabel ? "is-located" : ""
              }`}
              onClick={handleUseMyLocation}
              disabled={locating}
              style={{ marginTop: 10, width: "100%" }}
            >
              {locating ? (
                <>
                  <span className="locate-spinner" /> Locating you…
                </>
              ) : locatedLabel ? (
                <>
                  <span className="locate-dot" />
                  Using your location
                  <span className="locate-meta">· {locatedLabel}</span>
                </>
              ) : (
                <>
                  <IconCrosshair size={14} />
                  Use my location
                </>
              )}
            </button>
            {locateError && <div className="locate-err">{locateError}</div>}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: 10, width: "100%" }}
            >
              Compare routes
              <IconArrow />
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Landing;
