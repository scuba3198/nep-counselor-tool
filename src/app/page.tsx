"use client";

import {
  ArrowRight,
  Loader2,
  Search,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ChecklistTool from "@/components/ChecklistTool";
import { IndicatorBadge, ScoreBar } from "@/components/Indicators";
import Leaderboard from "@/components/Leaderboard";
import PolicyFeed from "@/components/PolicyFeed";
import {
  type ChecklistItem,
  COUNTRY_CHECKLISTS,
  DEFAULT_CHECKLIST,
} from "@/lib/checklists";
import type { CountryData, LeaderboardItem } from "@/lib/types";
import { MOCK_UPDATES } from "@/lib/updates";
import { getTopDestinations, performDeepAIResearch } from "./actions";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    setIsLeaderboardLoading(true);
    try {
      const data = await getTopDestinations();
      setLeaderboard(data);
    } catch {
      console.error("Leaderboard refresh failed.");
    } finally {
      setIsLeaderboardLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const query = overrideQuery || searchQuery;
    if (!query.trim()) return;

    if (overrideQuery) setSearchQuery(overrideQuery);

    setLoading(true);
    setError(null);

    try {
      const data = await performDeepAIResearch(query);
      if (data.isInvalid) {
        setError(
          data.why || "This location is not a recognized study destination.",
        );
        setResult(null);
      } else {
        setResult(data);
        setError(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Analysis failed";
      setError(`AI Analysis failed: ${msg}. Check if GEMINI_API_KEY is configured.`);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="hero">
        <div className="hero-grid">
          <div className="hero-main">
            <div className="badge glass">
              <ShieldAlert size={14} className="icon-crimson" />
              <span>Live Visa Intelligence Engine</span>
            </div>
            <h1 className="gradient-text">Hamro Foreign Study Guide</h1>
            <p className="subtitle">
              Global visa intelligence for Nepal&apos;s brightest minds.
            </p>

            <div className="search-box">
              <form className="search-bar glass" onSubmit={handleSearch}>
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search any country (e.g., Japan, Germany, USA)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="ai-btn" disabled={loading}>
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>AI Research</span>
                    </>
                  )}
                </button>
              </form>
              {error && <p className="error-msg">{error}</p>}
            </div>
          </div>

          <aside className="hero-aside">
            <Leaderboard
              items={leaderboard}
              isLoading={isLeaderboardLoading}
              onRefresh={fetchLeaderboard}
              onSelect={(country) => handleSearch(undefined, country)}
            />
          </aside>
        </div>
      </header>

      {result && (
        <section className="result-view glass animate-in">
          <div className="result-header">
            <div className="title-area">
              <h2>{result.name}</h2>
              <IndicatorBadge
                indicator={result.indicator}
                description={result.why}
              />
            </div>
            <div className="visa-summary">
              <span className="type">
                {result.visaDetails?.type || "Standard Student Visa"}
              </span>
              <span className="dot">•</span>
              <span className="time">
                {result.visaDetails?.processingTime || "Variable"} processing
              </span>
            </div>
          </div>

          <div className="result-grid">
            <div className="analysis-pane">
              <h3>Counselor Assessment</h3>
              <p className="why-text">{result.why}</p>

              <div className="detail-box">
                <h4>
                  <ArrowRight size={16} /> Key Requirement
                </h4>
                <p>{result.visaDetails.requirementHighlight}</p>
              </div>

              <div className="detail-box">
                <h4>
                  <ArrowRight size={16} /> Estimated Cost
                </h4>
                <p>{result.livingCost} (Excluding Tuition)</p>
              </div>
            </div>

            <div className="score-pane">
              <h3>Factor breakdown</h3>
              <ScoreBar
                label="Visa Success Rate"
                score={result.scores.visaSuccess}
              />
              <ScoreBar
                label="Financial Ease"
                score={result.scores.financialBarrier}
              />
              <ScoreBar
                label="Job Prospects"
                score={result.scores.jobProspects}
              />
              <ScoreBar
                label="PR Opportunity"
                score={result.scores.prPathways}
              />

              <div className="spacer" />
              {(() => {
                const baseItems =
                  COUNTRY_CHECKLISTS[result.id] || DEFAULT_CHECKLIST;
                // If AI provided specific financials, inject them into the checklist
                const finalItems: ChecklistItem[] = baseItems.map((item) => {
                  if (result.financials && item.category === "Financial") {
                    if (item.label.toLowerCase().includes("balance")) {
                      return {
                        ...item,
                        label: `Bank Balance (${result.financials.bankBalance})`,
                      };
                    }
                    if (item.label.toLowerCase().includes("income")) {
                      return {
                        ...item,
                        label: `Annual Income (${result.financials.annualIncome})`,
                      };
                    }
                  }
                  return item;
                });
                return <ChecklistTool items={finalItems} />;
              })()}
            </div>
          </div>
        </section>
      )}

      {!result && !loading && (
        <section className="featured-grid">
          <div className="card glass">
            <Search className="card-icon" />
            <h3>Dynamic Scoring</h3>
            <p>
              Every search triggers a vector analysis of visa, jobs, and PR
              likelihood.
            </p>
          </div>
          <div className="card glass">
            <ArrowRight className="card-icon" />
            <h3>Counselor Dashboard</h3>
            <p>
              Built-in indicators to help you suggest the best destination for
              students.
            </p>
          </div>
          <div className="card glass">
            <ShieldAlert className="card-icon" />
            <h3>Zero-Vulnerability</h3>
            <p>
              Strict sanitization and type-safe architecture for maximum
              security.
            </p>
          </div>
        </section>
      )}

      <PolicyFeed updates={MOCK_UPDATES} />

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .hero {
          margin-bottom: 3rem;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: start;
        }

        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1.5fr 1fr;
            gap: 4rem;
          }
        }

        .hero-main {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .hero-aside {
          width: 100%;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 1.5rem;
        }

        .icon-crimson {
          color: var(--color-crimson);
        }

        h1 {
          font-size: clamp(2.5rem, 10vw, 4.5rem);
          line-height: 1.1;
          margin-bottom: 1rem;
        }

        .subtitle {
          font-size: 1rem;
          color: var(--color-text-secondary);
          max-width: 600px;
          margin-bottom: 2rem;
        }

        .search-box {
          width: 100%;
          max-width: 700px;
        }

        .search-bar {
          display: flex;
          flex-direction: column;
          padding: 1rem;
          border-radius: 24px;
          gap: 1rem;
        }

        @media (min-width: 768px) {
          .container {
            padding: 4rem 2rem;
          }
          .hero {
            margin-bottom: 4rem;
          }
          .search-bar {
            flex-direction: row;
            padding: 0.5rem 0.5rem 0.5rem 1.5rem;
            border-radius: 100px;
          }
          .subtitle {
            font-size: 1.25rem;
            margin-bottom: 3rem;
          }
        }

        input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 1.1rem;
          width: 100%;
        }

        .ai-btn {
          width: 100%;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .ai-btn {
            width: auto;
          }
        }

        .ai-btn {
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 100px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }

        .ai-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
          filter: brightness(1.1);
        }

        .ai-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .ai-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: grayscale(1);
        }

        .error-msg {
          color: var(--color-difficult);
          margin-top: 1rem;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .result-view {
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          margin-top: 2rem;
        }

        @media (min-width: 768px) {
          .result-view {
            padding: 3rem;
          }
        }

        .result-header {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--color-glass-border);
        }

        .title-area {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        @media (min-width: 768px) {
          .title-area {
            flex-direction: row;
            align-items: center;
            gap: 1.5rem;
          }
          .result-header {
            margin-bottom: 3rem;
            padding-bottom: 2rem;
          }
        }

        h2 {
          font-size: clamp(1.75rem, 6vw, 2.5rem);
        }

        .visa-summary {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem 0.75rem;
          color: var(--color-text-secondary);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .dot {
          opacity: 0.5;
          display: none;
        }

        @media (min-width: 768px) {
          .visa-summary {
            font-size: 1rem;
          }
          .dot {
            display: inline;
          }
        }

        .result-grid {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        @media (min-width: 768px) {
          .result-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            gap: 4rem;
          }
        }

        .analysis-pane h3,
        .score-pane h3 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          color: var(--color-text-primary);
        }

        .why-text {
          font-size: 1rem;
          color: var(--color-text-secondary);
          margin-bottom: 2rem;
          line-height: 1.6;
          overflow-wrap: break-word;
        }

        @media (min-width: 768px) {
          .why-text {
            font-size: 1.1rem;
            line-height: 1.8;
          }
        }

        .detail-box {
          background: rgba(255, 255, 255, 0.03);
          padding: 1.25rem;
          border-radius: var(--radius-md);
          margin-bottom: 1rem;
          border: 1px solid var(--color-glass-border);
        }

        @media (min-width: 768px) {
          .detail-box {
            padding: 1.5rem;
          }
        }

        .detail-box h4 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-crimson);
          margin-bottom: 0.5rem;
        }

        .detail-box p {
          font-size: 0.95rem;
          color: #fff;
          font-weight: 500;
        }

        @media (min-width: 768px) {
          .detail-box h4 {
            font-size: 0.85rem;
          }
          .detail-box p {
            font-size: 1rem;
          }
        }

        .spacer {
          height: 2rem;
        }

        @media (min-width: 768px) {
          .spacer {
            height: 3rem;
          }
        }

        .featured-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .featured-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
        }

        .card {
          padding: 2rem;
          border-radius: var(--radius-lg);
          text-align: center;
        }

        @media (min-width: 768px) {
          .card {
            padding: 2.5rem;
          }
        }

        .card-icon {
          width: 40px;
          height: 40px;
          color: var(--color-crimson);
          margin-bottom: 1.25rem;
        }

        @media (min-width: 768px) {
          .card-icon {
            width: 48px;
            height: 48px;
            margin-bottom: 1.5rem;
          }
        }

        .animate-in {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
