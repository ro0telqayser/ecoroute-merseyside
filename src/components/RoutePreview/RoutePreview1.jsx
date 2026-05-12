import {
    Leaf,
    MapPinned,
    Clock3,
    Trees,
    Gift,
    TrendingDown,
  } from "lucide-react";
  
  import { previewData } from "../../data/previewData";
  import "./RoutePreview.css";
  
  function RoutePreview() {
    return (
      <section className="preview-section">
  
        <div className="preview-grid">
  
          {/* LEFT SIDE */}
          <div className="map-preview-card">
  
            <div className="map-preview-top">
              <div>
                <p className="map-preview-label">
                  Live Route Preview
                </p>
  
                <h2 className="map-preview-route">
                  {previewData.route}
                </h2>
              </div>
  
              <div className="arrival-badge">
                <Clock3 size={16} />
                {previewData.arrivalTime}
              </div>
            </div>
  
            {/* Fake map for now */}
            <div className="fake-map">
  
              <div className="route-line"></div>
  
              <div className="map-point start-point">
                <MapPinned size={18} />
              </div>
  
              <div className="map-point end-point">
                <Leaf size={18} />
              </div>
  
            </div>
  
          </div>
  
          {/* RIGHT SIDE */}
          <div className="insights-column">
  
            <div className="insight-card green">
              <Leaf size={26} />
  
              <div>
                <h3>{previewData.co2Saved}</h3>
                <p>Estimated emissions reduction</p>
              </div>
            </div>
  
            <div className="insight-card">
              <TrendingDown size={26} />
  
              <div>
                <h3>{previewData.congestion}</h3>
                <p>Less traffic compared to driving</p>
              </div>
            </div>
  
            <div className="insight-card">
              <Gift size={26} />
  
              <div>
                <h3>{previewData.rewardPoints}</h3>
                <p>Reward points earned from this trip</p>
              </div>
            </div>
  
            <div className="impact-summary-card">
              <Trees size={28} />
  
              <h3>Sustainability Impact</h3>
  
              <p>
                {previewData.sustainabilityText}
              </p>
  
              <div className="reward-progress">
                {previewData.nextReward}
              </div>
            </div>
  
          </div>
  
        </div>
  
      </section>
    );
  }
  
  export default RoutePreview;