import {
	Minus,
	RefreshCw,
	TrendingDown,
	TrendingUp,
	Trophy,
} from "lucide-react";
import type { LeaderboardItem } from "@/lib/types";

interface LeaderboardProps {
	items: LeaderboardItem[];
	isLoading: boolean;
	onRefresh: () => void;
	onSelect: (country: string) => void;
}

export default function Leaderboard({
	items,
	isLoading,
	onRefresh,
	onSelect,
}: LeaderboardProps) {
	return (
		<div className="leaderboard glass animate-in">
			<div className="leaderboard-header">
				<div className="title">
					<Trophy size={20} className="icon-gold" />
					<h3>Visa Success Leaderboard</h3>
				</div>
				<button
					type="button"
					className="refresh-btn"
					onClick={onRefresh}
					disabled={isLoading}
					title="Refresh Global Intelligence"
				>
					<RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
				</button>
			</div>

			<div className="leaderboard-list">
				{isLoading && items.length === 0 ? (
					<div className="loading-state">
						<p>Scanning global visa trends...</p>
					</div>
				) : (
					items.map((item) => (
						<button
							type="button"
							key={item.country}
							className="leaderboard-item"
							onClick={() => onSelect(item.country)}
						>
							<span className="rank">{item.rank}</span>
							<div className="country-info">
								<span className="country-name">{item.country}</span>
								<span
									className={`indicator-dot ${item.indicator.toLowerCase()}`}
								/>
							</div>
							<div className="stats">
								<span className="rate">{item.successRate}%</span>
								<div className={`trend ${item.trend}`}>
									{item.trend === "up" && <TrendingUp size={14} />}
									{item.trend === "down" && <TrendingDown size={14} />}
									{item.trend === "stable" && <Minus size={14} />}
								</div>
							</div>
						</button>
					))
				)}
			</div>

			<style jsx>{`
        .leaderboard {
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          height: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .leaderboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .icon-gold {
          color: #fbbf24;
        }

        h3 {
          font-size: 1.1rem;
          margin: 0;
          color: var(--color-text-primary);
        }

        .refresh-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-glass-border);
          color: var(--color-text-secondary);
          padding: 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .refresh-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .leaderboard-item {
          all: unset;
          display: flex;
          align-items: center;
          padding: 0.75rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          background: rgba(255, 255, 255, 0.02);
          width: 100%;
          box-sizing: border-box;
          border: 1px solid transparent;
        }

        .leaderboard-item:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(4px);
        }

        .rank {
          font-weight: 800;
          color: var(--color-crimson);
          width: 25px;
          font-size: 0.9rem;
        }

        .country-info {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .country-name {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .indicator-dot.easy {
          background: var(--color-easy);
        }
        .indicator-dot.medium {
          background: var(--color-medium);
        }
        .indicator-dot.difficult {
          background: var(--color-difficult);
        }

        .stats {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .rate {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--color-easy);
        }

        .trend.up {
          color: var(--color-easy);
        }
        .trend.down {
          color: var(--color-difficult);
        }
        .trend.stable {
          color: var(--color-text-secondary);
          opacity: 0.5;
        }

        .loading-state {
          padding: 2rem;
          text-align: center;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
		</div>
	);
}
