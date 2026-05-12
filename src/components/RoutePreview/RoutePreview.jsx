import {
  Bus,
  Car,
  Footprints,
  Leaf,
  MapPin,
  Navigation,
  Train,
} from "lucide-react";

import { routeOptions } from "../../data/routeData";

import "./RoutePreview.css";

function getStepIcon(icon) {
  if (icon === "train") return <Train size={18} />;
  if (icon === "bus") return <Bus size={18} />;
  if (icon === "car") return <Car size={18} />;
  if (icon === "walk") return <Footprints size={18} />;

  return <MapPin size={18} />;
}

function RoutePreview({ selectedRouteId }) {

  const selectedRoute =
    routeOptions.find(
      (route) => route.id === selectedRouteId
    ) || routeOptions[0];

  return (
    <section className="preview-section">

      <div className="preview-card">

        {/* LEFT SIDE */}
        <div className="map-panel">

          <div className="route-filter-box">

            <h4>Selected Route</h4>

            <p>
              <Leaf size={14} />
              {selectedRoute.name}
            </p>

            <p>
              <Navigation size={14} />
              {selectedRoute.transport}
            </p>

          </div>

          <div className="map-label start-label">
            <MapPin size={16} />
            <span>
              From
              <br />
              Liverpool
            </span>
          </div>

          <div className="map-label end-label">
            <Navigation size={16} />
            <span>
              To
              <br />
              Manchester
            </span>
          </div>

          <div className="route-line green-line"></div>

        </div>

        {/* RIGHT SIDE */}
        <aside className="route-details-panel">

          <div className="details-header">

            <Leaf size={20} />

            <div>
              <h3>{selectedRoute.name}</h3>

              <p>
                {selectedRoute.summary}
              </p>
            </div>

          </div>

          <div className="journey-steps">

            {selectedRoute.steps.map((step, index) => (

              <div className="journey-step" key={index}>

                {getStepIcon(step.icon)}

                <div>
                  <strong>{step.title}</strong>
                  <span>{step.detail}</span>
                </div>

              </div>

            ))}

          </div>

          <div className="route-impact-grid">

            <div className="impact-mini-card">
              <p>CO₂ Saved</p>

              <h4>{selectedRoute.co2Saved}</h4>

              <span>Compared to driving</span>
            </div>

            <div className="impact-mini-card">
              <p>Points Earned</p>

              <h4>{selectedRoute.points}</h4>

              <span>Earned on this journey</span>
            </div>

          </div>

          <button className="route-details-button">
            View Full Route Details
          </button>

        </aside>

      </div>

    </section>
  );
}

export default RoutePreview;