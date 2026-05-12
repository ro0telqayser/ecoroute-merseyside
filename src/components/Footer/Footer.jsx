import { Leaf } from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>GreenRoute</h2>

          <p>
            Helping people travel smarter,
            reduce emissions, and earn rewards.
          </p>
        </div>

        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/">Journey Planner</a>
          <a href="/">Rewards</a>
          <a href="/">Community</a>
        </div>

        <div className="footer-socials">
            <button><Leaf size={18} /></button>
            <button><Leaf size={18} /></button>
            <button><Leaf size={18} /></button>
            </div>

      </div>

      <div className="footer-bottom">
        © 2026 GreenRoute. Built for sustainable travel.
      </div>
    </footer>
  );
}

export default Footer;