import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Utensils } from 'lucide-react';

const WarriorClock: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState('');
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<'FASTING' | 'FEEDING'>('FASTING');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const day = now.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat

            // Define windows
            // Office: Mon-Wed (1, 2, 3) -> 11:30 to 20:00
            // Home: Thu-Fri (4, 5) -> 11:30 to 18:00
            // Weekend: 12:00 to 20:00 (Generic)

            let startHour = 11.5; // 11:30
            let endHour = 20;

            if ([1, 2, 3].includes(day)) {
                endHour = 20;
            } else if ([4, 5].includes(day)) {
                endHour = 18;
            }

            const currentHour = now.getHours() + now.getMinutes() / 60;

            if (currentHour >= startHour && currentHour < endHour) {
                setStatus('FEEDING');
                const remaining = endHour - currentHour;
                const total = endHour - startHour;
                setProgress((remaining / total) * 100);
                setTimeLeft(formatHours(remaining));
            } else {
                setStatus('FASTING');
                let nextStart = startHour;
                if (currentHour >= endHour) {
                    nextStart += 24;
                }
                const remaining = nextStart - currentHour;
                const total = 24 - (endHour - startHour);
                setProgress((remaining / total) * 100);
                setTimeLeft(formatHours(remaining));
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatHours = (h: number) => {
        const hours = Math.floor(h);
        const minutes = Math.floor((h - hours) * 60);
        const seconds = Math.floor(((h - hours) * 60 - minutes) * 60);
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <div className="warrior-clock glass-card">
            <div className="clock-header">
                {status === 'FASTING' ? (
                    <>
                        <Coffee className="status-icon coffee" />
                        <div className="status-text">
                            <h4>Fasting Mode</h4>
                            <p>Autophagy Active</p>
                        </div>
                    </>
                ) : (
                    <>
                        <Utensils className="status-icon meat" />
                        <div className="status-text">
                            <h4>Feeding Window</h4>
                            <p>Refueling Spartan</p>
                        </div>
                    </>
                )}
            </div>

            <div className="timer-display">
                <span className="time-value">{timeLeft}</span>
                <span className="time-label">{status === 'FASTING' ? 'Until Next Meal' : 'Until Kitchen Closes'}</span>
            </div>

            <div className="progress-container">
                <motion.div
                    className="progress-bar"
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - progress}%` }}
                    style={{
                        backgroundColor: status === 'FASTING' ? 'var(--primary-color)' : 'var(--accent-color)'
                    }}
                />
            </div>

            <div className="clock-footer">
                <span>Target: {status === 'FASTING' ? '11:30' : 'End'}</span>
                <span>Burn: Fat 🔥</span>
            </div>

            <style>{`
        .warrior-clock {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .clock-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .status-icon {
          width: 40px;
          height: 40px;
          padding: 8px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
        }
        .status-icon.coffee { color: var(--primary-color); }
        .status-icon.meat { color: var(--accent-color); }
        
        .status-text h4 { font-size: 1.1rem; }
        .status-text p { font-size: 0.8rem; color: var(--text-secondary); }

        .timer-display {
          text-align: center;
          padding: 1rem 0;
        }
        .time-value {
          display: block;
          font-size: 2.5rem;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
          color: #fff;
        }
        .time-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
        }

        .progress-container {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          border-radius: 3px;
        }

        .clock-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 600;
        }
      `}</style>
        </div>
    );
};

export default WarriorClock;
