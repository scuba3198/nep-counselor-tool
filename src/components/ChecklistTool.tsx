"use client";

import { CheckSquare, FileCheck, Square } from "lucide-react";
import { useState } from "react";
import type { ChecklistItem } from "@/lib/checklists";

interface ChecklistToolProps {
	items: ChecklistItem[];
}

export default function ChecklistTool({ items }: ChecklistToolProps) {
	const [checked, setChecked] = useState<Record<string, boolean>>({});

	const toggle = (id: string) => {
		setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const progress = Math.round(
		(Object.values(checked).filter(Boolean).length / items.length) * 100,
	);

	return (
		<div className="checklist-container glass">
			<div className="checklist-header">
				<FileCheck size={20} className="icon-crimson" />
				<h3>Document Checklist</h3>
				<div className="progress-pill">{progress || 0}% Complete</div>
			</div>

			<div className="items-list">
				{items.map((item) => (
					<button
						type="button"
						key={item.id}
						className={`item ${checked[item.id] ? "is-checked" : ""}`}
						onClick={() => toggle(item.id)}
					>
						{checked[item.id] ? (
							<CheckSquare size={18} className="icon-crimson" />
						) : (
							<Square size={18} />
						)}
						<div className="item-content">
							<span className="label">{item.label}</span>
							<span className="category">{item.category}</span>
						</div>
					</button>
				))}
			</div>

			<style jsx>{`
        .checklist-container {
          padding: 1.25rem;
          border-radius: var(--radius-lg);
          height: fit-content;
        }
        @media (min-width: 768px) {
          .checklist-container {
            padding: 2rem;
          }
        }
        .checklist-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        h3 {
          font-size: 1.1rem;
          margin: 0;
          flex: 1;
        }
        @media (min-width: 768px) {
          .checklist-header {
            margin-bottom: 2rem;
          }
          h3 {
            font-size: 1.25rem;
          }
        }
        .progress-pill {
          background: var(--color-crimson);
          color: white;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 700;
          white-space: nowrap;
        }
        @media (min-width: 768px) {
          .progress-pill {
            padding: 0.25rem 0.75rem;
            font-size: 0.75rem;
          }
        }
        .items-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .item {
          all: unset;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          width: 100%;
          box-sizing: border-box;
          padding: 0.75rem;
          border-radius: 10px;
          transition: all 0.2s;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid transparent;
        }
        .item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--color-glass-border);
        }
        .is-checked {
          background: rgba(220, 20, 60, 0.05);
          border-color: rgba(220, 20, 60, 0.2);
        }
        .item-content {
          display: flex;
          flex-direction: column;
        }
        .label {
          font-size: 0.95rem;
          font-weight: 500;
          color: #fff;
        }
        .category {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-secondary);
          margin-top: 0.25rem;
        }
      `}</style>
		</div>
	);
}
