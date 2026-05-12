import {
  Car,
  Train,
  Bus,
  Leaf,
  Clock,
  ArrowRight,
} from "lucide-react";

import { routeOptions } from "../../data/routeData";
import "./RouteComparison.css";

function getTransportIcon(transport) {
  if (transport.includes("Car")) return <Car size={28} />;
  if (transport.includes("Train")) return <Train size={28} />;
  if (transport.includes("Bus")) return <Bus size={28} />;

  return <Leaf size={28} />;
}

function RouteComparison({
  selectedRouteId,
  setSelectedRouteId,
}) {
  return (
    <section className="route-section">
      <div className="route-container">

        <h2 className="route-section-title">
          Compare Your Route Options
        </h2>

        <div className="route-card-grid">

          {routeOptions.map((route) => (

            <article
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={
                selectedRouteId === route.id
                  ? "route-card selected-route"
                  : "route-card"
              }
            >

              {selectedRouteId === route.id && (
                <div className="recommended-badge">
                  Recommended
                </div>
              )}

              <div className="route-card-top">

                <div className="route-icon">
                  {getTransportIcon(route.transport)}
                </div>

                <h3>{route.name}</h3>

              </div>

              <div className="route-divider"></div>

              <div className="route-metrics">

                <div className="route-metric">
                  <strong>{route.duration}</strong>
                  <span>Travel Time</span>
                </div>

                <div className="route-metric">
                  <strong>{route.co2}</strong>
                  <span>Emissions</span>
                </div>

                <div className="route-metric points">
                  <strong>{route.points}</strong>
                  <span>Points</span>
                </div>

              </div>

              <div className="route-divider"></div>

              <div className="route-bottom">
                <span>{route.via}</span>
                <ArrowRight size={22} />
              </div>

            </article>

          ))}

        </div>
      </div>
    </section>
  );
}

export default RouteComparison;