import React, { useState } from 'react';
import { Trophy, Flame, Quote, Sword, CheckCircle2, Circle, Bell } from 'lucide-react';
import { StorageService } from '../services/StorageService';
import { NotificationService } from '../services/NotificationService';

const STOIC_QUOTES = [
  { text: "No man is more unhappy than he who never faces adversity. For he is not permitted to prove himself.", author: "Seneca" },
  { text: "Self-discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" }
];

const SPARTAN_TRIALS = [
  "WEEK OF FIRE: No caffeine after 12:00 PM.",
  "COLD RESOLVE: End every shower with 1 min cold water.",
  "DEEP WORK: 4 hours of code before first carb.",
  "TRUE WARRIOR: 20-hour fast on Sunday."
];

const ProgressSummary: React.FC = () => {
  const stats = StorageService.getStats();
  const streak = StorageService.getStreak();

  const weekNum = Math.floor(new Date().getTime() / (7 * 24 * 60 * 60 * 1000));
  const currentTrial = SPARTAN_TRIALS[weekNum % SPARTAN_TRIALS.length];
  const quote = STOIC_QUOTES[new Date().getDate() % STOIC_QUOTES.length];

  const [notifGranted, setNotifGranted] = useState(Notification.permission === 'granted');

  const handleRequestNotif = async () => {
    const granted = await NotificationService.requestPermission();
    setNotifGranted(granted);
    if (granted) {
      NotificationService.sendNotification('System Access Granted', {
        body: 'You will receive logical status updates regarding your fasting and hydration.'
      });
    }
  };

  const tasks = [
    { label: 'Protein Target', done: stats.lunchProtein },
    { label: 'No Carbs Needed', done: stats.noCarbs },
    { label: 'Workout Done', done: stats.workoutCompleted },
    { label: 'Hydration (4L)', done: stats.waterCount >= 8 }
  ];

  return (
    <div className="progress-summary glass-card">
      <div className="summary-header">
        <Trophy className="gold" size={18} />
        <div className="header-info">
          <h2>Daily Status</h2>
          <p>{new Date().toLocaleDateString('tr-TR')}</p>
        </div>
        {!notifGranted && (
          <button className="notif-req-btn" onClick={handleRequestNotif} title="Enable Status Updates">
            <Bell size={16} />
          </button>
        )}
        <div className="streak-badge">
          <Flame size={14} />
          <span>{streak} DAY STREAK</span>
        </div>
      </div>

      <div className="stoic-pulse">
        <Quote size={16} className="quote-icon" />
        <p>"{quote.text}"</p>
        <cite>— {quote.author}</cite>
      </div>

      <div className="trial-card">
        <div className="trial-header">
          <Sword size={14} className="crimson" />
          <span>WEEKLY SPARTAN TRIAL</span>
        </div>
        <p className="trial-text">{currentTrial}</p>
      </div>

      <div className="tasks-grid">
        {tasks.map((task, i) => (
          <div key={i} className={`task-item ${task.done ? 'completed' : ''}`}>
            {task.done ? (
              <CheckCircle2 size={16} className="status-icon done" />
            ) : (
              <Circle size={16} className="status-icon" />
            )}
            <span className="task-label">{task.label}</span>
          </div>
        ))}
      </div>

      <style>{`
                .progress-summary { display: flex; flex-direction: column; gap: 1rem; }
                .summary-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
                .header-info h2 { font-size: 1rem; margin: 0; color: #fff; }
                .header-info p { font-size: 0.7rem; color: var(--text-secondary); }
                
                .notif-req-btn {
                    margin-left: auto;
                    margin-right: 0.75rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--glass-border);
                    color: var(--primary-color);
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .streak-badge { 
                    display: flex; align-items: center; gap: 0.3rem; padding: 0.35rem 0.65rem; 
                    background: rgba(212, 175, 55, 0.1); border-radius: 2rem; color: var(--primary-color);
                    border: 1px solid rgba(212, 175, 55, 0.2);
                }
                .streak-badge span { font-size: 0.7rem; font-weight: 800; }

                .stoic-pulse {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid var(--glass-border);
                    padding: 1rem;
                    border-radius: 1rem;
                    position: relative;
                }
                .quote-icon { position: absolute; top: -8px; right: 8px; color: var(--primary-color); opacity: 0.2; }
                .stoic-pulse p { font-style: italic; font-size: 0.8rem; color: #fff; margin-bottom: 0.4rem; line-height: 1.4; }
                .stoic-pulse cite { font-size: 0.65rem; color: var(--primary-color); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }

                .trial-card {
                    background: rgba(178, 34, 34, 0.05);
                    border: 1px dashed var(--accent-color);
                    padding: 0.75rem 1rem;
                    border-radius: 1rem;
                }
                .trial-header { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.25rem; }
                .trial-header span { font-size: 0.6rem; font-weight: 800; color: var(--accent-color); letter-spacing: 0.1em; }
                .trial-text { font-size: 0.85rem; font-weight: 700; color: #fff; }

                .tasks-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
                .task-item {
                    display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem;
                    background: rgba(255, 255, 255, 0.03); border-radius: 0.75rem; border: 1px solid var(--glass-border);
                    transition: all 0.3s ease;
                }
                .task-item.completed { background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.2); }
                .status-icon { color: var(--text-secondary); opacity: 0.5; flex-shrink: 0; }
                .status-icon.done { color: #10b981; opacity: 1; }
                .task-label { font-size: 0.75rem; font-weight: 600; color: var(--text-primary); }
                .task-item.completed .task-label { color: #10b981; }
            `}</style>
    </div>
  );
};

export default ProgressSummary;
