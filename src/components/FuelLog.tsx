import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Droplets, Info, Flame } from 'lucide-react';
import type { DailyStats } from '../services/StorageService';
import { StorageService } from '../services/StorageService';

const FuelLog: React.FC = () => {
    const [stats, setStats] = useState<DailyStats>(StorageService.getStats());

    const updateStats = (updates: Partial<DailyStats>) => {
        const newStats = { ...stats, ...updates };
        setStats(newStats);
        StorageService.saveStats(newStats);
    };

    const { lunchProtein, noCarbs, waterCount, sodaCount } = stats;

    return (
        <div className="fuel-log">
            <div className="section-title">
                <Droplets className="title-icon" />
                <h2>Hydration & Fuel</h2>
            </div>

            <div className="glass-card tracker-card">
                <h3>Lunch Control (Sabancı Style)</h3>
                <p className="card-subtitle">Stick to the plan, skip the rice.</p>

                <div className="checkbox-group">
                    <button
                        className={`binary-btn ${lunchProtein === true ? 'success' : ''}`}
                        onClick={() => updateStats({ lunchProtein: true })}
                    >
                        <Check size={18} />
                        <span>Protein Obtained</span>
                    </button>

                    <button
                        className={`binary-btn ${noCarbs === true ? 'success' : lunchProtein === false ? 'fail' : ''}`}
                        onClick={() => updateStats({ noCarbs: true })}
                    >
                        <X size={18} />
                        <span>No Carbs (Pilav-free)</span>
                    </button>
                </div>

                {lunchProtein && noCarbs && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="success-feedback"
                    >
                        <Flame size={16} />
                        <span>Elite Discipline! Fat burning continues.</span>
                    </motion.div>
                )}
            </div>

            <div className="hydration-grid">
                <div className="glass-card stat-mini">
                    <div className="stat-info">
                        <h4>Water</h4>
                        <div className="counter">
                            <span className="count-num">{(waterCount * 0.5).toFixed(1)}L</span>
                            <span className="count-label">/ 4.0L</span>
                        </div>
                    </div>
                    <button className="add-btn" onClick={() => updateStats({ waterCount: waterCount + 1 })}>+</button>
                </div>

                <div className="glass-card stat-mini">
                    <div className="stat-info">
                        <h4>Soda (Maden Suyu)</h4>
                        <div className="counter">
                            <span className="count-num">{sodaCount}</span>
                            <span className="count-label">/ 2 Bottles</span>
                        </div>
                    </div>
                    <button className="add-btn" onClick={() => updateStats({ sodaCount: sodaCount + 1 })}>+</button>
                </div>
            </div>

            <div className="glass-card info-card">
                <div className="info-header">
                    <Info size={16} />
                    <h4>Pro Tip</h4>
                </div>
                <p>If you feel a headache (Keto Flu), add a pinch of Himalayan salt to your water immediately.</p>
            </div>

            <style>{`
        .fuel-log {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .title-icon { color: #3b82f6; }
        
        .tracker-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .card-subtitle {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .checkbox-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin: 0.5rem 0;
        }

        .binary-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
          padding: 1rem;
          border-radius: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .binary-btn.success {
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.3);
          color: #4ade80;
        }

        .success-feedback {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 0.75rem;
          color: var(--primary-color);
          font-size: 0.8rem;
          font-weight: 600;
        }

        .hydration-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .stat-mini {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem !important;
        }

        .stat-info h4 {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .count-num {
          font-size: 1.25rem;
          font-weight: 700;
        }
        .count-label {
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-left: 0.25rem;
        }

        .add-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: var(--primary-color);
          color: var(--bg-color);
          font-weight: 800;
          font-size: 1.2rem;
        }

        .info-card {
          background: rgba(59, 130, 246, 0.05);
          border-color: rgba(59, 130, 246, 0.1);
        }
        .info-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #3b82f6;
          margin-bottom: 0.5rem;
        }
        .info-card p {
          font-size: 0.8rem;
          line-height: 1.4;
          color: var(--text-secondary);
        }
      `}</style>
        </div>
    );
};

export default FuelLog;
