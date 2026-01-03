import React from 'react';
import { History, TrendingUp, TrendingDown, Minus, FileDown } from 'lucide-react';
import { StorageService } from '../services/StorageService';

const HistoricalData: React.FC = () => {
  const history = StorageService.getHistory();

  const downloadBattleLog = () => {
    const fullData = {
      today: StorageService.getStats(),
      history: StorageService.getHistory(),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spartan-battle-log-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const calculateWeightDiff = (current: number, index: number) => {
    const previous = history[index + 1]?.measurements?.weight;
    if (!current || !previous) return null;
    const diff = current - previous;

    if (diff < 0) return { icon: <TrendingDown size={14} className="text-success" />, val: diff.toFixed(1) };
    if (diff > 0) return { icon: <TrendingUp size={14} className="text-danger" />, val: `+${diff.toFixed(1)}` };
    return { icon: <Minus size={14} />, val: "0" };
  };

  if (history.length === 0) {
    return (
      <div className="historical-data glass-card empty-state">
        <History size={48} className="gold opacity-20" />
        <p>No battles logged yet. Your history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="historical-data">
      <div className="section-title">
        <History className="gold" />
        <h2>Battle Log</h2>
        <button className="export-btn" onClick={downloadBattleLog} title="Export Battle Log">
          <FileDown size={18} />
        </button>
      </div>

      <div className="history-list">
        {history.map((day, i) => {
          const diff = calculateWeightDiff(day.measurements?.weight || 0, i);
          const isSuccessful = day.lunchProtein && day.noCarbs && day.workoutCompleted;

          return (
            <div key={i} className={`history-card glass-card ${isSuccessful ? 'perfect-day' : ''}`}>
              <div className="card-header">
                <span className="date-label">{new Date(day.date).toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                {isSuccessful && <div className="success-dot" title="Perfect Day"></div>}
              </div>

              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="m-label">Weight</span>
                  <div className="m-val-group">
                    <span className="m-val">{day.measurements?.weight || '--'}</span>
                    {diff && <span className="m-diff">{diff.icon} {diff.val}</span>}
                  </div>
                </div>

                <div className="metric-item">
                  <span className="m-label">Waist</span>
                  <span className="m-val">{day.measurements?.waist || '--'} cm</span>
                </div>

                <div className="metric-item">
                  <span className="m-label">Activity</span>
                  <div className="activity-icons">
                    <div className={`mini-btn ${day.lunchProtein ? 'active' : ''}`} title="Protein">P</div>
                    <div className={`mini-btn ${day.noCarbs ? 'active' : ''}`} title="No Carbs">C</div>
                    <div className={`mini-btn ${day.workoutCompleted ? 'active' : ''}`} title="Workout">W</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
                .historical-data { display: flex; flex-direction: column; gap: 1.25rem; }
                .empty-state { text-align: center; padding: 4rem 2rem !important; opacity: 0.6; }
                .section-title { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
                .export-btn {
                  margin-left: auto; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border);
                  color: var(--primary-color); width: 36px; height: 36px; border-radius: 10px;
                  display: flex; align-items: center; justify-content: center;
                }
                .history-list { display: flex; flex-direction: column; gap: 1rem; }
                .history-card { padding: 1.25rem !important; border-left: 4px solid transparent; }
                .history-card.perfect-day { border-left-color: var(--primary-color); background: rgba(212, 175, 55, 0.05); }
                .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .date-label { font-size: 0.85rem; font-weight: 700; color: var(--text-primary); }
                .success-dot { width: 8px; height: 8px; background: var(--primary-color); border-radius: 50%; box-shadow: 0 0 10px var(--primary-color); }
                
                .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 0.75rem; }
                .metric-item { display: flex; flex-direction: column; gap: 0.2rem; }
                .m-label { font-size: 0.6rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700; }
                .m-val { font-size: 0.9rem; font-weight: 800; color: #fff; }
                .m-val-group { display: flex; align-items: center; gap: 0.4rem; }
                .m-diff { display: flex; align-items: center; font-size: 0.65rem; font-weight: 700; }
                .activity-icons { display: flex; gap: 0.25rem; }
                .mini-btn {
                    width: 20px; height: 20px; border-radius: 4px; border: 1px solid var(--glass-border);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.6rem; font-weight: 900; color: var(--text-secondary);
                }
                .mini-btn.active { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); }
                .text-success { color: #10b981; }
                .text-danger { color: var(--accent-color); }
            `}</style>
    </div>
  );
};

export default HistoricalData;
