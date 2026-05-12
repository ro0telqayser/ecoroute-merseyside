import { BatteryCharging, Car, Leaf, TreePine } from "lucide-react";
import { impactData } from "../../data/impactData";
import "./ImpactBanner.css";

const icons = [Leaf, TreePine, Car, BatteryCharging];

function ImpactBanner() {
  return (
    <section className="impact-section">
      <div className="impact-banner">
        <div className="impact-intro">
          <h2>{impactData.title}</h2>
          <p>{impactData.subtitle}</p>
          <button>View My Impact</button>
        </div>

        <div className="impact-stats">
          {impactData.stats.map((stat, index) => {
            const Icon = icons[index];

            return (
              <div className="impact-stat" key={stat.id}>
                <Icon size={28} />
                <div>
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ImpactBanner;