import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Flame } from 'lucide-react';

const WarriorClock: React.FC = () => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const day = now.getDay(); // 0 is Sunday, 1-5 is Mon-Fri
    const isSabanciDay = day >= 1 && day <= 5;

    // Fasting rules
    // Sabanci: Start 20:00 (prev day) -> End 11:30 (15.5h)
    // Home: Start 21:00 (prev day) -> End 12:00 (15h)

    const targetHour = isSabanciDay ? 11.5 : 12;
    const feastEndHour = isSabanciDay ? 20 : 21;

    const currentHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

    let status: 'FASTING' | 'FEEDING' = 'FASTING';
    let remainingSeconds = 0;
    let progress = 0;

    if (currentHour >= targetHour && currentHour < feastEndHour) {
        status = 'FEEDING';
        const totalFeast = feastEndHour - targetHour;
        const elapsed = currentHour - targetHour;
        remainingSeconds = (feastEndHour - currentHour) * 3600;
        progress = (elapsed / totalFeast) * 100;
    } else {
        status = 'FASTING';
        if (currentHour < targetHour) {
            remainingSeconds = (targetHour - currentHour) * 3600;
            const totalFast = (24 - feastEndHour) + targetHour;
            const elapsed = (24 - feastEndHour) + currentHour;
            progress = (elapsed / totalFast) * 100;
        } else {
            remainingSeconds = (24 - currentHour + targetHour) * 3600;
            const totalFast = (24 - feastEndHour) + targetHour;
            const elapsed = currentHour - feastEndHour;
            progress = (elapsed / totalFast) * 100;
        }
    }

    // Autophagy calc: roughly fasting for 14+ hours
    // Hard to calculate exactly from 'now' without knowing when they actually stopped eating last night,
    // so we use the 'elapsed' fasting time from the schedule.
    const fastingElapsed = status === 'FASTING' ? (progress / 100) * ((24 - feastEndHour) + targetHour) : 0;
    const isPeakAutophagy = status === 'FASTING' && fastingElapsed >= 14;

    return (
        <div className="warrior-clock glass-card">
            <div className="clock-header">
                <div className="header-left">
                    <Shield className="gold" size={18} />
                    <h3>Warrior Clock</h3>
                </div>
                <AnimatePresence>
                    {isPeakAutophagy && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="autophagy-badge"
                        >
                            <Flame size={14} /> AUTOPHAGY ACTIVE
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="clock-visual">
                <svg viewBox="0 0 100 100">
                    <circle className="bg" cx="50" cy="50" r="45" />
                    <motion.circle
                        className={`progress ${status === 'FEEDING' ? 'feeding' : 'fasting'}`}
                        cx="50" cy="50" r="45"
                        style={{
                            strokeDasharray: 283,
                            strokeDashoffset: 283 - (283 * Math.min(progress, 100)) / 100
                        }}
                    />
                    {isPeakAutophagy && (
                        <motion.circle
                            cx="50" cy="50" r="45"
                            className="heat-ring"
                            animate={{
                                strokeOpacity: [0.1, 0.4, 0.1],
                                scale: [1, 1.05, 1],
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                    )}
                </svg>
                <div className="clock-content">
                    <span className="time-remaining">
                        {Math.floor(remainingSeconds / 3600)}h {Math.floor((remainingSeconds % 3600) / 60)}m
                    </span>
                    <span className="phase-label">Remaining {status === 'FEEDING' ? 'Feeding' : 'Fasting'}</span>
                </div>
            </div>

            <style>{`
                .warrior-clock {
                  display: flex;
                  flex-direction: column;
                  gap: 1.5rem;
                }
                .clock-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 2rem;
                }
                .header-left {
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                }
                .autophagy-badge {
                  background: rgba(178, 34, 34, 0.2);
                  border: 1px solid var(--accent-color);
                  color: #ff4d4d;
                  font-size: 0.65rem;
                  font-weight: 800;
                  padding: 0.35rem 0.65rem;
                  border-radius: 2rem;
                  display: flex;
                  align-items: center;
                  gap: 0.3rem;
                  letter-spacing: 0.05em;
                  box-shadow: 0 0 15px rgba(178, 34, 34, 0.3);
                }
                .clock-visual {
                  position: relative;
                  width: 200px;
                  height: 200px;
                  margin: 0 auto;
                }
                svg {
                  width: 100%;
                  height: 100%;
                  transform: rotate(-90deg);
                }
                .bg {
                  fill: none;
                  stroke: rgba(255, 255, 255, 0.03);
                  stroke-width: 6;
                }
                .progress {
                  fill: none;
                  stroke-width: 6;
                  stroke-linecap: round;
                  transition: stroke-dashoffset 0.5s ease;
                }
                .progress.fasting {
                  stroke: var(--primary-color);
                }
                .progress.feeding {
                  stroke: #10b981;
                }
                .heat-ring {
                  fill: none;
                  stroke: var(--accent-color);
                  stroke-width: 2;
                  stroke-dasharray: 4, 2;
                }
                .clock-content {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  text-align: center;
                }
                .time-remaining {
                  display: block;
                  font-size: 2.5rem;
                  font-weight: 800;
                  color: #fff;
                  line-height: 1;
                  margin-bottom: 0.25rem;
                }
                .phase-label {
                  font-size: 0.75rem;
                  text-transform: uppercase;
                  letter-spacing: 0.1em;
                  color: var(--text-secondary);
                  font-weight: 600;
                }
            `}</style>
        </div>
    );
};

export default WarriorClock;
