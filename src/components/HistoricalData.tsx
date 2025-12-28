import { History, Calendar, ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { StorageService } from '../services/StorageService';

const HistoricalData: React.FC = () => {
    const history = StorageService.getHistory();

    if (history.length === 0) {
        return (
            <div className="historical-data glass-card">
                <div className="empty-state">
                    <History className="icon gold" size={24} />
                    <p>No historical data yet. History starts tomorrow!</p>
                </div>
            </div>
        );
    }

    const getWeightChange = (index: number) => {
        if (index === history.length - 1) return null;
        const current = history[index].measurements?.weight;
        const previous = history[index + 1].measurements?.weight;

        if (!current || !previous) return null;
        const diff = current - previous;

        if (diff < 0) return { icon: <ArrowDownRight size={14} className="text-success" />, val: diff.toFixed(1) };
        if (diff > 0) return { icon: <ArrowUpRight size={14} className="text-danger" />, val: `+${diff.toFixed(1)}` };
        return { icon: <Minus size={14} />, val: "0" };
    };

    return (
        <div className="historical-data">
            <div className="section-title">
                <Calendar className="title-icon gold" />
                <h2>History & Trends</h2>
            </div>

            <div className="history-list">
                {history.map((day, i) => {
                    const weightChange = getWeightChange(i);
                    const isSuccessful = day.lunchProtein && day.noCarbs && day.workoutCompleted;

                    return (
                        <div key={i} className={`history-card glass-card ${isSuccessful ? 'perfect-day' : ''}`}>
                            <div className="history-date">
                                <span className="date-label">{new Date(day.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
                                {isSuccessful && <div className="success-dot" />}
                            </div>

                            <div className="history-metrics">
                                <div className="metric-item">
                                    <span className="m-label">Weight</span>
                                    <div className="m-val-group">
                                        <span className="m-val">{day.measurements?.weight || '-'} kg</span>
                                        {weightChange && (
                                            <div className="m-diff">
                                                {weightChange.icon}
                                                <span>{weightChange.val}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="metric-item">
                                    <span className="m-label">Sleep</span>
                                    <span className="m-val">{day.sleepHours || '0'}h</span>
                                </div>

                                <div className="metric-item">
                                    <span className="m-label">Status</span>
                                    <div className="status-icons">
                                        <div className={`mini-status ${day.lunchProtein ? 'active' : ''}`} title="Protein">P</div>
                                        <div className={`mini-status ${day.noCarbs ? 'active' : ''}`} title="No Carbs">C</div>
                                        <div className={`mini-status ${day.workoutCompleted ? 'active' : ''}`} title="Workout">W</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
        .historical-data {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .empty-state {
          text-align: center;
          padding: 2rem 1rem;
          color: var(--text-secondary);
        }
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .history-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1rem !important;
        }
        .perfect-day {
          border-left: 3px solid var(--primary-color);
          background: rgba(212, 175, 55, 0.05);
        }
        .history-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 50px;
        }
        .date-label {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .success-dot {
          width: 6px;
          height: 6px;
          background: var(--primary-color);
          border-radius: 50%;
          margin-top: 0.4rem;
          box-shadow: 0 0 8px var(--primary-color);
        }
        .history-metrics {
          flex: 1;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1.5fr;
          gap: 1rem;
        }
        .metric-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .m-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          color: var(--text-secondary);
          font-weight: 700;
        }
        .m-val {
          font-size: 0.9rem;
          font-weight: 700;
          color: #fff;
        }
        .m-val-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .m-diff {
          display: flex;
          align-items: center;
          font-size: 0.7rem;
          font-weight: 600;
        }
        .status-icons {
          display: flex;
          gap: 0.25rem;
        }
        .mini-status {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          font-size: 0.6rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--glass-border);
        }
        .mini-status.active {
          background: var(--primary-color);
          color: var(--bg-color);
          border-color: var(--primary-color);
        }
        .text-success { color: #22c55e; }
        .text-danger { color: var(--accent-color); }
      `}</style>
        </div>
    );
};

export default HistoricalData;
