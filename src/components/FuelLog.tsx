import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Droplets, Info, Flame } from 'lucide-react';
import type { DailyStats } from '../services/StorageService';
import { NotificationService } from '../services/NotificationService';

interface FuelLogProps {
  stats: DailyStats;
  updateStats: (updates: Partial<DailyStats>) => void;
}

const FuelLog: React.FC<FuelLogProps> = ({ stats, updateStats }) => {
  const { lunchProtein, noCarbs, waterCount, sodaCount, supplements } = stats;

  const toggleSupplement = (name: string) => {
    const newSupps = (supplements || []).includes(name)
      ? supplements.filter(s => s !== name)
      : [...(supplements || []), name];
    updateStats({ supplements: newSupps });
  };

  const handleWaterUpdate = (newCount: number) => {
    updateStats({ waterCount: newCount });
    if (newCount > waterCount) {
      NotificationService.remindHydration(newCount);
    }
  };

  const SUPP_LIST = [
    { id: 'multi', name: 'Multivitamin', icon: '💊' },
    { id: 'zma', name: 'ZMA / Magnezyum', icon: '🌙' },
    { id: 'vitd', name: 'Vitamin D3', icon: '☀️' },
    { id: 'protein', name: 'Protein Powder', icon: '🥤' }
  ];

  return (
    <div className="fuel-log">
      <div className="section-title">
        <Flame className="crimson" />
        <h2>Fuel Status</h2>
      </div>

      <div className="glass-card main-fuel-card">
        <div className="fuel-toggle-group">
          <button
            className={`fuel-btn ${lunchProtein ? 'active' : ''}`}
            onClick={() => updateStats({ lunchProtein: !lunchProtein })}
          >
            <div className="btn-icon">🍗</div>
            <div className="btn-text">
              <span>Protein Obtained</span>
              <p>Lunch protein source</p>
            </div>
            {lunchProtein ? <Check className="status-icon" /> : <X className="status-icon x" />}
          </button>

          <button
            className={`fuel-btn ${noCarbs ? 'active' : ''}`}
            onClick={() => updateStats({ noCarbs: !noCarbs })}
          >
            <div className="btn-icon">🍚</div>
            <div className="btn-text">
              <span>No Carbs</span>
              <p>Pilav-free lunch</p>
            </div>
            {noCarbs ? <Check className="status-icon" /> : <X className="status-icon x" />}
          </button>
        </div>
      </div>

      <div className="glass-card water-card">
        <div className="water-header">
          <div className="header-info" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative', width: 22, height: 22 }}>
              <img src="/favicon.png" alt="" style={{ width: 18, height: 18, filter: 'hue-rotate(180deg)', position: 'absolute', top: 2, left: 0 }} />
              <Droplets className="blue" size={14} style={{ position: 'absolute', bottom: 0, right: 0 }} />
            </div>
            <h3>Hydration Status</h3>
          </div>
          <span className="water-count-text">{(waterCount * 0.5).toFixed(1)}L / 4.0L</span>
        </div>

        <div className="hydration-tank-container">
          <div className="tank-wall">
            <motion.div
              className="water-level"
              initial={{ height: 0 }}
              animate={{ height: `${(waterCount / 8) * 100}%` }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className="wave"></div>
            </motion.div>
          </div>
          <div className="glasses-grid">
            {[...Array(8)].map((_, i) => (
              <button
                key={i}
                className={`glass-btn ${i < waterCount ? 'full' : ''}`}
                onClick={() => handleWaterUpdate(i + 1 === waterCount ? i : i + 1)}
              >
                <Droplets size={20} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card stat-mini">
        <div className="stat-info">
          <h4>Soda (Maden Suyu)</h4>
          <div className="counter">
            <span className="count-num">{sodaCount}</span>
            <span className="count-label">bottles</span>
          </div>
        </div>
        <button className="add-btn" onClick={() => updateStats({ sodaCount: sodaCount + 1 })}>+</button>
      </div>

      <div className="glass-card supplement-card">
        <h3>Daily Supplements</h3>
        <div className="supp-grid">
          {SUPP_LIST.map(supp => (
            <button
              key={supp.id}
              className={`supp-btn ${(supplements || []).includes(supp.id) ? 'active' : ''}`}
              onClick={() => toggleSupplement(supp.id)}
            >
              <span className="supp-icon">{supp.icon}</span>
              <span className="supp-name">{supp.name}</span>
              {(supplements || []).includes(supp.id) && <Check size={14} className="check-mark" />}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card info-card">
        <div className="info-header">
          <Info size={16} />
          <h4>Pro Tip</h4>
        </div>
        <p>Maden suyu elektrolit dengesi için kritiktir. Özellikle ofis günlerinde ihmal etme Spartan.</p>
      </div>

      <style>{`
                .fuel-log { display: flex; flex-direction: column; gap: 1.25rem; }
                .section-title { display: flex; align-items: center; gap: 0.75rem; color: #fff; }
                .crimson { color: var(--accent-color); }
                .blue { color: #3b82f6; }
                
                .fuel-toggle-group { display: flex; flex-direction: column; gap: 1rem; }
                .fuel-btn {
                    display: flex; align-items: center; gap: 1rem; background: rgba(255, 255, 255, 0.02);
                    border: 1px solid var(--glass-border); border-radius: 1rem; padding: 1.25rem; color: #fff; text-align: left;
                }
                .fuel-btn.active { background: rgba(212, 175, 55, 0.1); border-color: var(--primary-color); }
                .btn-text span { display: block; font-weight: 700; font-size: 1rem; }
                .btn-text p { font-size: 0.75rem; color: var(--text-secondary); }
                .status-icon { margin-left: auto; color: #10b981; }
                .status-icon.x { color: var(--accent-color); opacity: 0.3; }

                .water-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .water-count-text { font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); }
                .hydration-tank-container { display: flex; gap: 1rem; align-items: center; }
                .tank-wall {
                    width: 50px; height: 100px; border: 2px solid rgba(59, 130, 246, 0.3); border-radius: 0.75rem;
                    position: relative; overflow: hidden; background: rgba(255, 255, 255, 0.02);
                }
                .water-level {
                    position: absolute; bottom: 0; left: 0; width: 100%;
                    background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
                }
                .wave {
                    position: absolute; top: -10px; left: 0; width: 200%; height: 20px;
                    background: rgba(255, 255, 255, 0.1); border-radius: 40%; animation: wave 3s infinite linear;
                }
                @keyframes wave {
                    0% { transform: translateX(0) rotate(0deg); }
                    100% { transform: translateX(-50%) rotate(360deg); }
                }
                .glasses-grid { flex: 1; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
                .glass-btn {
                    aspect-ratio: 1; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--glass-border);
                    border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: rgba(255, 255, 255, 0.1);
                }
                .glass-btn.full { background: rgba(59, 130, 246, 0.1); border-color: #3b82f6; color: #3b82f6; }

                .stat-mini { display: flex; justify-content: space-between; align-items: center; }
                .count-num { font-size: 1.5rem; font-weight: 800; color: var(--primary-color); }
                .count-label { font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; }
                .add-btn { width: 40px; height: 40px; border-radius: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border); color: #fff; }

                .supp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
                .supp-btn {
                    background: rgba(255, 255, 255, 0.02); border: 1px solid var(--glass-border); color: var(--text-secondary);
                    padding: 0.75rem; border-radius: 0.75rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 600;
                }
                .supp-btn.active { background: rgba(212, 175, 55, 0.1); border-color: var(--primary-color); color: var(--primary-color); }
                .info-card { background: rgba(59, 130, 246, 0.05); border-color: rgba(59, 130, 246, 0.1); }
            `}</style>
    </div>
  );
};

export default FuelLog;
