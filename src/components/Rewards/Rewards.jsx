import { Gift, Lock, Star } from "lucide-react";
import { rewardsData } from "../../data/rewardsData";
import "./Rewards.css";

function Rewards() {
  const progress = (rewardsData.currentPoints / rewardsData.targetPoints) * 100;

  return (
    <section className="rewards-section">
      <div className="rewards-grid">
        <div className="points-card">
          <div className="points-header">
            <Gift size={22} />
            <h2>Your Green Points</h2>
          </div>

          <div className="points-content">
            <h3>{rewardsData.currentPoints}</h3>
            <p>Total Points</p>
          </div>

          <div className="next-reward">
            <span>Next Reward</span>
            <strong>{rewardsData.nextReward}</strong>
            <p>{rewardsData.pointsLeft} points left</p>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <small>
            {rewardsData.currentPoints} / {rewardsData.targetPoints}
          </small>
        </div>

        <div className="milestones-card">
          <div className="milestones-header">
            <Star size={22} />
            <h2>Your Reward Milestones</h2>
          </div>

          <div className="reward-list">
            {rewardsData.rewards.map((reward) => (
              <article
                key={reward.id}
                className={
                  reward.locked ? "reward-card locked" : "reward-card"
                }
              >
                {reward.locked && (
                  <div className="lock-icon">
                    <Lock size={14} />
                  </div>
                )}

                <div className="reward-emoji">{reward.emoji}</div>

                <h3>{reward.name}</h3>
                <p>{reward.points} Points</p>
                <span>{reward.status}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Rewards;