import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronRight, Dumbbell } from 'lucide-react';
import { StorageService } from '../services/StorageService';

interface Exercise {
    name: string;
    duration: number; // in seconds
    reps: number;
}

const CIRCUIT: Exercise[] = [
    { name: 'Goblet Squats (15kg)', duration: 45, reps: 0 },
    { name: 'Dumbbell Rows', duration: 45, reps: 0 },
    { name: 'Push Ups', duration: 45, reps: 0 },
    { name: 'Lunges (Each Leg)', duration: 45, reps: 0 },
    { name: 'Overhead Press', duration: 45, reps: 0 },
    { name: 'REST', duration: 90, reps: 0 },
];

const ArenaTimer: React.FC = () => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState(CIRCUIT[0].duration);
    const [isActive, setIsActive] = useState(false);
    const [round, setRound] = useState(1);
    const [repInputs, setRepInputs] = useState<number[]>(new Array(CIRCUIT.length).fill(0));

    useEffect(() => {
        let interval: any = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            nextExercise();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const nextExercise = () => {
        if (currentIdx < CIRCUIT.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setTimeLeft(CIRCUIT[currentIdx + 1].duration);
        } else {
            // Loop or Finish
            if (round < 4) {
                setRound(round + 1);
                setCurrentIdx(0);
                setTimeLeft(CIRCUIT[0].duration);
            } else {
                setIsActive(false);
                const stats = StorageService.getStats();
                StorageService.saveStats({ ...stats, workoutCompleted: true });
                alert('VICTORY! Workout Complete Spartan.');
            }
        }
    };

    const reset = () => {
        setIsActive(false);
        setCurrentIdx(0);
        setTimeLeft(CIRCUIT[0].duration);
        setRound(1);
    };

    const progress = (timeLeft / CIRCUIT[currentIdx].duration) * 100;

    return (
        <div className="arena-timer">
            <div className="section-title">
                <Dumbbell className="title-icon crimson" />
                <h2>The Arena</h2>
            </div>

            <div className="glass-card timer-card">
                <div className="timer-header">
                    <span className="round-badge">Round {round} / 4</span>
                    <span className="exercise-index">{currentIdx + 1} of {CIRCUIT.length}</span>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIdx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="current-exercise"
                    >
                        <h3>{CIRCUIT[currentIdx].name}</h3>
                    </motion.div>
                </AnimatePresence>

                <div className="main-clock">
                    <svg className="progress-ring" viewBox="0 0 100 100">
                        <circle className="ring-bg" cx="50" cy="50" r="45" />
                        <motion.circle
                            className="ring-progress"
                            cx="50" cy="50" r="45"
                            style={{
                                strokeDasharray: 283,
                                strokeDashoffset: (283 * progress) / 100,
                                stroke: CIRCUIT[currentIdx].name === 'REST' ? '#3b82f6' : 'var(--accent-color)'
                            }}
                        />
                    </svg>
                    <div className="clock-text">
                        <span className="time-big">{timeLeft}</span>
                        <span className="sec-label">SEC</span>
                    </div>
                </div>

                <div className="controls">
                    <button className="control-btn secondary" onClick={reset}>
                        <RotateCcw size={24} />
                    </button>
                    <button
                        className={`control-btn primary ${isActive ? 'active' : ''}`}
                        onClick={() => setIsActive(!isActive)}
                    >
                        {isActive ? <Pause size={32} /> : <Play size={32} />}
                    </button>
                    <button className="control-btn secondary" onClick={nextExercise}>
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div className="glass-card workout-log">
                <h3>Progressive Overload Log</h3>
                <div className="log-list">
                    {CIRCUIT.slice(0, 5).map((ex, i) => (
                        <div key={i} className="log-item">
                            <span>{ex.name}</span>
                            <input
                                type="number"
                                placeholder="Reps"
                                className="rep-input"
                                onChange={(e) => {
                                    const newReps = [...repInputs];
                                    newReps[i] = parseInt(e.target.value);
                                    setRepInputs(newReps);
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        .arena-timer {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .crimson { color: var(--accent-color); }

        .timer-card {
           display: flex;
           flex-direction: column;
           align-items: center;
           gap: 1.5rem;
           padding: 2rem 1.5rem !important;
        }

        .timer-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .round-badge {
          background: rgba(178, 34, 34, 0.1);
          color: var(--accent-color);
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
        }

        .current-exercise h3 {
          font-size: 1.5rem;
          text-align: center;
          color: #fff;
        }

        .main-clock {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .progress-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .ring-bg {
          fill: none;
          stroke: rgba(255, 255, 255, 0.05);
          stroke-width: 8;
        }

        .ring-progress {
          fill: none;
          stroke-width: 8;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.3s ease;
        }

        .clock-text {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .time-big {
          font-size: 4rem;
          font-weight: 800;
          color: #fff;
          line-height: 1;
        }
        .sec-label {
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          color: var(--text-secondary);
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .control-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .control-btn.primary {
          width: 64px;
          height: 64px;
          background: var(--accent-color);
          color: #fff;
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(178, 34, 34, 0.4);
        }

        .control-btn.primary.active {
          background: var(--surface-color);
          color: var(--accent-color);
          border: 2px solid var(--accent-color);
        }

        .workout-log h3 {
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .log-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .log-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .rep-input {
          width: 60px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          color: #fff;
          padding: 0.4rem;
          border-radius: 0.5rem;
          text-align: center;
        }
      `}</style>
        </div>
    );
};

export default ArenaTimer;
