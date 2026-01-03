import React, { useState } from 'react';
import { Ruler, Scale, Save, TrendingDown, Moon, Bed } from 'lucide-react';
import { StorageService } from '../services/StorageService';

const Measurements: React.FC = () => {
  const stats = StorageService.getStats();
  const [weight, setWeight] = useState(stats.measurements?.weight || 0);
  const [waist, setWaist] = useState(stats.measurements?.waist || 0);
  const [neck, setNeck] = useState(stats.measurements?.neck || 38);
  const [height, setHeight] = useState(stats.measurements?.height || 180);
  const [sleep, setSleep] = useState(stats.sleepHours || 0);
  const [saved, setSaved] = useState(false);

  const calculateBodyFat = () => {
    if (!waist || !neck || !height) return null;
    // US Navy Formula for Men
    const bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    return bf.toFixed(1);
  };

  const bodyFat = calculateBodyFat();

  const handleSave = () => {
    StorageService.saveStats({
      ...stats,
      sleepHours: sleep,
      measurements: { weight, waist, neck, height }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="measurements glass-card">
      <div className="card-header">
        <TrendingDown className="icon gold" size={16} />
        <h3>Body & Sleep Metrics</h3>
      </div>

      <div className="metrics-grid">
        <div className="metric-input">
          <div className="input-label">
            <Scale size={12} />
            <span>Weight (kg)</span>
          </div>
          <input
            type="number"
            value={weight || ''}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
            placeholder="0.0"
          />
        </div>

        <div className="metric-input">
          <div className="input-label">
            <Ruler size={12} />
            <span>Waist (cm)</span>
          </div>
          <input
            type="number"
            value={waist || ''}
            onChange={(e) => setWaist(parseFloat(e.target.value))}
            placeholder="0.0"
          />
        </div>

        <div className="metric-input">
          <div className="input-label">
            <TrendingDown size={12} />
            <span>Neck (cm)</span>
          </div>
          <input
            type="number"
            value={neck || ''}
            onChange={(e) => setNeck(parseFloat(e.target.value))}
            placeholder="38.0"
          />
        </div>

        <div className="metric-input">
          <div className="input-label">
            <Ruler size={12} />
            <span>Height (cm)</span>
          </div>
          <input
            type="number"
            value={height || ''}
            onChange={(e) => setHeight(parseFloat(e.target.value))}
            placeholder="180.0"
          />
        </div>

        {bodyFat && (
          <div className="bf-display full-width">
            <span className="bf-label">Estimated Body Fat (Navy Method)</span>
            <span className="bf-val">{bodyFat}%</span>
          </div>
        )}

        <div className="metric-input full-width">
          <div className="input-label">
            <Moon size={12} />
            <span>Sleep Duration (Hours)</span>
          </div>
          <div className="sleep-selector">
            <Bed size={16} className={sleep >= 7 ? 'text-success' : 'text-warning'} />
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={sleep}
              onChange={(e) => setSleep(parseFloat(e.target.value))}
            />
            <span className="sleep-val">{sleep}h</span>
          </div>
        </div>
      </div>

      <button
        className={`save-btn ${saved ? 'success' : ''}`}
        onClick={handleSave}
      >
        <Save size={16} />
        <span>{saved ? 'Progress Logged!' : 'Update Metrics'}</span>
      </button>

      <style>{`
        .measurements {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .full-width {
          grid-column: span 2;
        }
        .metric-input {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .input-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          font-weight: 700;
        }
        .metric-input input[type="number"] {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          color: #fff;
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-size: 1.1rem;
          font-weight: 700;
          width: 100%;
        }
        .sleep-selector {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.03);
          padding: 0.75rem;
          border-radius: 1rem;
        }
        .sleep-selector input {
          flex: 1;
          accent-color: var(--primary-color);
        }
        .sleep-val {
          font-weight: 800;
          min-width: 40px;
          text-align: right;
          color: var(--primary-color);
        }
        .text-success { color: #22c55e; }
        .text-warning { color: #f59e0b; }
        .save-btn {
          background: var(--surface-color);
          border: 1px solid var(--primary-color);
          color: var(--primary-color);
          padding: 0.8rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 700;
          margin-top: 0.5rem;
        }
        .save-btn.success {
          background: var(--primary-color);
          color: var(--bg-color);
        }
      `}</style>
    </div>
  );
};

export default Measurements;
