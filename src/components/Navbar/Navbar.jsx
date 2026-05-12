import { useState } from "react";
import { PawPrint, Bell, Menu, X } from "lucide-react";
import "./Navbar.css";

function Navbar({ onStartJourney }) {
  const [activeLink, setActiveLink] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    "Home",
    "Journey Planner",
    "Rewards",
    "Sustainability",
    "Community",
  ];

  function handleNavClick(link) {
    setActiveLink(link);
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <nav className="navbar-container">
        <div className="navbar-logo">
          <PawPrint className="navbar-logo-icon" />

          <div>
            <h1>GreenRoute</h1>
            <p>Travel green. Earn more.</p>
          </div>
        </div>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <button
              key={link}
              className={activeLink === link ? "active" : ""}
              onClick={() => handleNavClick(link)}
            >
              {link}
            </button>
          ))}
        </div>

        <div className="navbar-actions">
          <button className="navbar-icon-button">
            <Bell size={20} />
          </button>

          <div className="navbar-profile">P</div>

          <button className="navbar-start-button" onClick={onStartJourney}>
            Start Journey
          </button>
        </div>

        <button
          className="navbar-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <button
              key={link}
              className={activeLink === link ? "active" : ""}
              onClick={() => handleNavClick(link)}
            >
              {link}
            </button>
          ))}

          <button className="mobile-start-button" onClick={onStartJourney}>
            Start Journey
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;