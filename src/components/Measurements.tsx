import React, { useState } from 'react';
import { Ruler, Scale, Save, TrendingDown } from 'lucide-react';
import { StorageService } from '../services/StorageService';

const Measurements: React.FC = () => {
    const stats = StorageService.getStats();
    const [weight, setWeight] = useState(stats.measurements?.weight || 0);
    const [waist, setWaist] = useState(stats.measurements?.waist || 0);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        StorageService.saveStats({
            ...stats,
            measurements: { weight, waist }
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="measurements glass-card">
            <div className="card-header">
                <TrendingDown className="icon gold" />
                <h3>Body Metrics</h3>
            </div>

            <div className="metrics-grid">
                <div className="metric-input">
                    <div className="input-label">
                        <Scale size={16} />
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
                        <Ruler size={16} />
                        <span>Waist (cm)</span>
                    </div>
                    <input
                        type="number"
                        value={waist || ''}
                        onChange={(e) => setWaist(parseFloat(e.target.value))}
                        placeholder="0.0"
                    />
                </div>
            </div>

            <button
                className={`save-btn ${saved ? 'success' : ''}`}
                onClick={handleSave}
            >
                <Save size={18} />
                <span>{saved ? 'Metrics Saved!' : 'Update Metrics'}</span>
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
        .metric-input {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .input-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          font-weight: 700;
        }
        .metric-input input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          color: #fff;
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-size: 1.1rem;
          font-weight: 700;
          width: 100%;
        }
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
