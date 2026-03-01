"use client";

import { Bell, Calendar, ExternalLink } from "lucide-react";
import type { PolicyUpdate } from "@/lib/updates";

interface PolicyFeedProps {
	updates: PolicyUpdate[];
}

export default function PolicyFeed({ updates }: PolicyFeedProps) {
	return (
		<div className="feed-container">
			<div className="feed-header">
				<Bell size={20} className="icon-crimson" />
				<h2>Global Policy Feed</h2>
			</div>

			<div className="update-list">
				{updates.map((upd) => (
					<div key={upd.id} className="update-item glass">
						<div className="update-meta">
							<span className="country-tag">{upd.countryName}</span>
							<span className={`impact-tag impact-${upd.impact.toLowerCase()}`}>
								{upd.impact} Impact
							</span>
						</div>
						<h3>{upd.title}</h3>
						<p className="summary">{upd.summary}</p>
						<div className="update-footer">
							<span className="date">
								<Calendar size={14} /> {upd.date}
							</span>
							<a
								href={upd.link}
								target="_blank"
								rel="noopener noreferrer"
								className="source-link"
							>
								Official Source <ExternalLink size={14} />
							</a>
						</div>
					</div>
				))}
			</div>

			<style jsx>{`
        .feed-container {
          margin-top: 2rem;
        }
        @media (min-width: 768px) {
          .feed-container {
            margin-top: 4rem;
          }
        }
        .feed-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .feed-header h2 {
          font-size: 1.5rem;
        }
        @media (min-width: 768px) {
          .feed-header h2 {
            font-size: 1.75rem;
          }
        }
        .update-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .update-list {
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
          }
        }
        .update-item {
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 768px) {
          .update-item {
            padding: 2rem;
          }
        }
        .update-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .country-tag {
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--color-crimson);
          text-transform: uppercase;
        }
        .impact-tag {
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .impact-high {
          background: rgba(255, 82, 82, 0.2);
          color: var(--color-difficult);
        }
        .impact-medium {
          background: rgba(255, 214, 0, 0.2);
          color: var(--color-medium);
        }
        .impact-low {
          background: rgba(0, 230, 118, 0.2);
          color: var(--color-easy);
        }

        h3 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          color: #fff;
        }
        .summary {
          font-size: 0.95rem;
          color: var(--color-text-secondary);
          margin-bottom: 2rem;
          flex: 1;
        }
        .update-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid var(--color-glass-border);
          font-size: 0.85rem;
        }
        .date {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--color-text-secondary);
        }
        .source-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #fff;
          font-weight: 600;
          transition: color 0.2s;
        }
        .source-link:hover {
          color: var(--color-crimson);
        }
      `}</style>
		</div>
	);
}
