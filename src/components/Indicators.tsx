import {
	AlertCircle,
	CheckCircle2,
	Info,
	type LucideIcon,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import type { EaseIndicator } from "@/lib/types";

interface IndicatorProps {
	indicator: EaseIndicator;
	description?: string;
}

export const IndicatorBadge = ({ indicator, description }: IndicatorProps) => {
	const [showTooltip, setShowTooltip] = useState(false);

	const styles: Record<EaseIndicator, { bg: string; icon: LucideIcon }> = {
		Easy: { bg: "var(--color-easy)", icon: CheckCircle2 },
		Medium: { bg: "var(--color-medium)", icon: Info },
		Difficult: { bg: "var(--color-difficult)", icon: AlertCircle },
		"Not Recommended": { bg: "var(--color-not-recommended)", icon: XCircle },
	};

	const { bg, icon: Icon } = styles[indicator] || styles.Medium;

	return (
		<div className="badge-container">
			<button
				type="button"
				className="badge-pill"
				style={{ backgroundColor: bg }}
				onClick={() => setShowTooltip(!showTooltip)}
			>
				<Icon size={16} />
				<span>{indicator}</span>
			</button>

			{showTooltip && description && (
				<div className="tooltip glass animate-in">
					<p>{description}</p>
				</div>
			)}

			<style jsx>{`
        .badge-container {
          position: relative;
          display: inline-block;
        }
        .badge-pill {
          all: unset;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1rem;
          border-radius: 100px;
          color: #000;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: transform 0.2s;
          user-select: none;
          box-sizing: border-box;
        }
        .badge-pill:hover {
          transform: scale(1.05);
        }
        .tooltip {
          position: absolute;
          top: calc(100% + 10px);
          left: 0;
          width: 250px;
          padding: 1rem;
          border-radius: var(--radius-md);
          z-index: 50;
          font-size: 0.85rem;
          color: var(--color-text-primary);
          line-height: 1.4;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          border: 1px solid var(--color-glass-border);
        }
        .animate-in {
          animation: tooltipIn 0.2s ease-out forwards;
        }
        @keyframes tooltipIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
		</div>
	);
};

interface ScoreBarProps {
	label: string;
	score: number;
}

export const ScoreBar = ({ label, score }: ScoreBarProps) => {
	const width = `${score * 10}%`;
	const getChance = (s: number) => {
		if (s >= 8) return { text: "High", color: "var(--color-easy)" };
		if (s >= 4) return { text: "Medium", color: "var(--color-medium)" };
		return { text: "Low", color: "var(--color-difficult)" };
	};
	const chance = getChance(score);

	return (
		<div className="score-container">
			<div className="score-header">
				<span className="label">{label}</span>
				<div className="score-values">
					<span className="chance" style={{ color: chance.color }}>
						{chance.text}
					</span>
					<span className="value">{score}/10</span>
				</div>
			</div>
			<div className="bar-bg">
				<div
					className="bar-fill"
					style={{ width, backgroundColor: chance.color }}
				></div>
			</div>
			<style jsx>{`
        .score-container {
          margin-bottom: 1.5rem;
        }
        .score-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .score-values {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .chance {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 800;
        }
        @media (min-width: 480px) {
          .score-header {
            font-size: 0.9rem;
          }
          .chance {
            font-size: 0.75rem;
          }
        }
        .label {
          color: var(--color-text-secondary);
        }
        .bar-bg {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 10px;
          transition:
            width 1s ease-out,
            background-color 0.3s ease;
        }
      `}</style>
		</div>
	);
};
