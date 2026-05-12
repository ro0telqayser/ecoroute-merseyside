import { Award, Leaf, Users } from "lucide-react";
import { communityData } from "../../data/communityData";
import "./Community.css";

function Community() {
  return (
    <section className="community-section">
      <div className="community-grid">
        <div className="community-main-card">
          <div className="community-heading">
            <Leaf size={24} />
            <div>
              <h2>{communityData.title}</h2>
              <p>{communityData.subtitle}</p>
            </div>
          </div>

          <div className="community-stats">
            {communityData.stats.map((stat) => (
              <div className="community-stat-card" key={stat.id}>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="leaderboard-card">
          <div className="leaderboard-heading">
            <Award size={22} />
            <h2>Top Eco Travellers</h2>
          </div>

          <div className="leaderboard-list">
            {communityData.leaderboard.map((person, index) => (
              <div className="leaderboard-row" key={person.id}>
                <span className="rank">#{index + 1}</span>

                <div className="avatar">
                  <Users size={16} />
                </div>

                <div>
                  <strong>{person.name}</strong>
                  <p>{person.points}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="leaderboard-button">
            View Full Leaderboard
          </button>
        </div>
      </div>
    </section>
  );
}

export default Community;