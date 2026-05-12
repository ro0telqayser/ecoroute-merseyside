import { Leaf, Trophy } from "lucide-react";
import { leaderboardData } from "../../data/leaderboardData";
import "./Leaderboard.css";

function Leaderboard() {
  return (
    <section className="leaderboard-section">
      <div className="leaderboard-card">
        <div className="leaderboard-intro">
          <h2>Top Eco Travellers This Week</h2>
          <p>
            <Leaf size={16} />
            See who is making the biggest green impact.
          </p>

          <button>View Leaderboard</button>
        </div>

        <div className="leaderboard-users">
          {leaderboardData.map((user) => (
            <article className="leaderboard-user" key={user.id}>
              <div className="rank-badge">{user.rank}</div>

              <div className="user-avatar">
                {user.initials}
              </div>

              <h3>{user.name}</h3>
              <p>{user.points}</p>

              {user.id === 1 && (
                <Trophy className="top-user-icon" size={18} />
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Leaderboard;