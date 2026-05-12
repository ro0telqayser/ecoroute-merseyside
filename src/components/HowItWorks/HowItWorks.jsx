import { Leaf, ArrowRight } from "lucide-react";
import { howItWorksData } from "../../data/howItWorksData";
import "./HowItWorks.css";

function HowItWorks() {
  return (
    <section className="how-section">
      <div className="how-container">
        <h2 className="how-title">
          How GreenRoute Works <Leaf size={20} />
        </h2>

        <div className="how-grid">
          {howItWorksData.map((item, index) => (
            <div className="how-step-wrapper" key={item.id}>
              <article className="how-card">
                <div className="step-circle">{item.step}</div>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                <div className="how-image-wrapper">
                    <img src={item.image} alt={item.title} className="how-image" />
                    </div>
             </article>

              {index < howItWorksData.length - 1 && (
                <ArrowRight className="how-arrow" size={24} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;