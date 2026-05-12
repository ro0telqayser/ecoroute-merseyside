import { useState } from "react";
import {
  Calendar,
  Clock,
  Leaf,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { journeyPlannerData } from "../../data/journeyData";
import "./JourneyPlanner.css";

function JourneyPlanner({ onSearch }) {
  const [from, setFrom] = useState(journeyPlannerData.fromPlaceholder);
  const [to, setTo] = useState(journeyPlannerData.toPlaceholder);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(from, to);
  };

  return (
    <section className="journey-section">
      <form className="journey-card" onSubmit={handleSearch}>
        <h2 className="journey-title">
          <Leaf size={20} />
          Plan Your Journey
        </h2>

        <div className="journey-form">
          <label className="journey-field">
            <span>From</span>
            <div className="journey-input-box">
              <MapPin size={18} />
              <input value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
          </label>

          <label className="journey-field">
            <span>To</span>
            <div className="journey-input-box">
              <MapPin size={18} />
              <input value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </label>

          <label className="journey-field small">
            <span>Date</span>
            <div className="journey-input-box">
              <Calendar size={18} />
              <input value={journeyPlannerData.date} readOnly />
            </div>
          </label>

          <label className="journey-field small">
            <span>Time</span>
            <div className="journey-input-box">
              <Clock size={18} />
              <input value={journeyPlannerData.time} readOnly />
            </div>
          </label>

          <label className="journey-field small">
            <span>Preference</span>
            <div className="journey-input-box">
              <SlidersHorizontal size={18} />
              <select defaultValue={journeyPlannerData.preference}>
                <option>Lowest CO₂</option>
                <option>Fastest Route</option>
                <option>Cheapest Route</option>
                <option>Balanced</option>
              </select>
            </div>
          </label>

          <button type="submit" className="journey-search-button">
            <span>{journeyPlannerData.buttonText}</span>
            <Search size={18} />
          </button>
        </div>

        <p className="journey-eco-message">
          <Leaf size={17} />
          {journeyPlannerData.ecoMessage}
        </p>
      </form>
    </section>
  );
}

export default JourneyPlanner;
