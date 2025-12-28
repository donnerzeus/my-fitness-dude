import { Trophy, CheckCircle2, Circle, Flame } from 'lucide-react';
import { StorageService } from '../services/StorageService';

const ProgressSummary: React.FC = () => {
    const stats = StorageService.getStats();
    const streak = StorageService.getStreak();

    const tasks = [
        { label: 'Protein Target', done: stats.lunchProtein },
        { label: 'Low Carb Lunch', done: stats.noCarbs },
        { label: 'Daily Workout', done: stats.workoutCompleted },
        { label: 'Hydration 4L', done: stats.waterCount >= 8 }, // 8 * 0.5L
    ];

    return (
        <div className="progress-summary glass-card">
            <div className="summary-header">
                <div className="streak-badge">
                    <Flame size={20} fill="var(--primary-color)" />
                    <span>{streak} DAY STREAK</span>
                </div>
                <Trophy className="gold" size={24} />
            </div>

            <div className="task-list">
                {tasks.map((task, i) => (
                    <div key={i} className={`task-item ${task.done ? 'completed' : ''}`}>
                        {task.done ? (
                            <CheckCircle2 size={18} className="done-icon" />
                        ) : (
                            <Circle size={18} className="todo-icon" />
                        )}
                        <span>{task.label}</span>
                    </div>
                ))}
            </div>

            <style>{`
        .progress-summary {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .streak-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(212, 175, 55, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          color: var(--primary-color);
          font-weight: 800;
          font-size: 0.8rem;
          border: 1px solid rgba(212, 175, 55, 0.2);
        }
        .task-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .task-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 0.75rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
          transition: all 0.3s ease;
        }
        .task-item.completed {
          background: rgba(34, 197, 94, 0.05);
          color: #fff;
        }
        .done-icon { color: #22c55e; }
        .todo-icon { color: var(--text-secondary); opacity: 0.5; }
      `}</style>
        </div>
    );
};

export default ProgressSummary;
