import { useState, useEffect } from "react";

import { Landing } from "./components/Landing/Landing";
import { Planner } from "./components/Planner/Planner";

import "./App.css";

function App() {
  const [view, setView] = useState("landing");
  const [plannerFrom, setPlannerFrom] = useState("");
  const [plannerTo, setPlannerTo] = useState("");

  useEffect(() => {
    if (view === "planner") {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [view]);

  const launchPlanner = ({ from, to } = {}) => {
    if (from) setPlannerFrom(from);
    if (to) setPlannerTo(to);
    setView("planner");
  };

  if (view === "planner") {
    return (
      <Planner
        initialFrom={plannerFrom}
        initialTo={plannerTo}
        initialScreen="compare"
        onBackToLanding={() => setView("landing")}
      />
    );
  }

  return <Landing onLaunch={launchPlanner} />;
}

export default App;
