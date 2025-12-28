import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronRight, Dumbbell, RefreshCw, X, Check } from 'lucide-react';
import { StorageService } from '../services/StorageService';

interface Exercise {
  id: string;
  name: string;
  duration: number;
  category: 'Legs' | 'Push' | 'Pull' | 'Core' | 'Rest';
}

const EXERCISE_LIBRARY: Exercise[] = [
  { id: 'squat', name: 'Goblet Squats (15kg)', duration: 45, category: 'Legs' },
  { id: 'lunge', name: 'Dumbbell Lunges', duration: 45, category: 'Legs' },
  { id: 'rdl', name: 'Romanian Deadlifts', duration: 45, category: 'Legs' },
  { id: 'press', name: 'Overhead Press', duration: 45, category: 'Push' },
  { id: 'pushup', name: 'Push Ups (Weighted)', duration: 45, category: 'Push' },
  { id: 'floor', name: 'Floor Press', duration: 45, category: 'Push' },
  { id: 'row', name: 'Dumbbell Rows', duration: 45, category: 'Pull' },
  { id: 'renegade', name: 'Renegade Rows', duration: 45, category: 'Pull' },
  { id: 'woodchop', name: 'DB Woodchops', duration: 45, category: 'Core' },
  { id: 'plankrow', name: 'Plank Rows', duration: 45, category: 'Core' },
  { id: 'rest', name: 'REST', duration: 90, category: 'Rest' }
];

const DEFAULT_CIRCUIT = ['squat', 'row', 'pushup', 'lunge', 'press', 'rest'];

const ArenaTimer: React.FC = () => {
  const stats = StorageService.getStats();
  const [circuitIds, setCircuitIds] = useState<string[]>(stats.customWorkout || DEFAULT_CIRCUIT);
  const [isSwappingIdx, setIsSwappingIdx] = useState<number | null>(null);

  const currentCircuit = circuitIds.map(id => EXERCISE_LIBRARY.find(ex => ex.id === id)!);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(currentCircuit[0].duration);
  const [isActive, setIsActive] = useState(false);
  const [round, setRound] = useState(1);

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
    if (currentIdx < currentCircuit.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setTimeLeft(currentCircuit[currentIdx + 1].duration);
    } else {
      if (round < 4) {
        setRound(round + 1);
        setCurrentIdx(0);
        setTimeLeft(currentCircuit[0].duration);
      } else {
        setIsActive(false);
        const currentStats = StorageService.getStats();
        StorageService.saveStats({ ...currentStats, workoutCompleted: true });
        alert('VICTORY! Workout Complete Spartan.');
      }
    }
  };

  const reset = () => {
    setIsActive(false);
    setCurrentIdx(0);
    setTimeLeft(currentCircuit[0].duration);
    setRound(1);
  };

  const swapExercise = (newId: string) => {
    if (isSwappingIdx !== null) {
      const newCircuit = [...circuitIds];
      newCircuit[isSwappingIdx] = newId;
      setCircuitIds(newCircuit);
      StorageService.saveStats({ ...stats, customWorkout: newCircuit });

      if (isSwappingIdx === currentIdx) {
        setTimeLeft(EXERCISE_LIBRARY.find(ex => ex.id === newId)?.duration || 45);
      }
      setIsSwappingIdx(null);
    }
  };

  const progress = (timeLeft / currentCircuit[currentIdx].duration) * 100;

  return (
    <div className="arena-timer">
      <div className="section-title">
        <Dumbbell className="title-icon crimson" />
        <h2>The Arena</h2>
      </div>

      {!isActive && isSwappingIdx === null && (
        <div className="glass-card circuit-preview">
          <h3>Today's Circuit</h3>
          <div className="preview-list">
            {currentCircuit.map((ex, i) => (
              <div key={i} className="preview-item">
                <span>{ex.name}</span>
                <button className="swap-btn-mini" onClick={() => setIsSwappingIdx(i)}>
                  <RefreshCw size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isSwappingIdx !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card library-modal"
        >
          <div className="modal-header">
            <h3>Choose Alternative</h3>
            <button onClick={() => setIsSwappingIdx(null)}><X size={20} /></button>
          </div>
          <div className="library-list">
            {EXERCISE_LIBRARY.filter(ex => ex.category !== 'Rest').map(ex => (
              <button key={ex.id} className="lib-item" onClick={() => swapExercise(ex.id)}>
                <div className="lib-info">
                  <span className="lib-name">{ex.name}</span>
                  <span className="lib-cat">{ex.category}</span>
                </div>
                <Check size={18} className="gold" />
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="glass-card timer-card">
        <div className="timer-header">
          <span className="round-badge">Round {round} / 4</span>
          <span className="exercise-index">{currentIdx + 1} of {currentCircuit.length}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="current-exercise"
          >
            <h3>{currentCircuit[currentIdx].name}</h3>
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
                stroke: currentCircuit[currentIdx].name === 'REST' ? '#3b82f6' : 'var(--accent-color)'
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

      <style>{`
        .arena-timer { display: flex; flex-direction: column; gap: 1.25rem; }
        .crimson { color: var(--accent-color); }
        .circuit-preview h3 { font-size: 0.9rem; margin-bottom: 1rem; }
        .preview-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .preview-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 0.6rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .swap-btn-mini {
          background: none;
          border: none;
          color: var(--primary-color);
          opacity: 0.6;
        }
        .library-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 400px;
          z-index: 100;
          background: #1a1a1d !important;
          border: 1px solid var(--primary-color) !important;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .modal-header h3 { font-size: 1.1rem; }
        .library-list { display: flex; flex-direction: column; gap: 0.75rem; max-height: 300px; overflow-y: auto; }
        .lib-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          border: none;
          padding: 1rem;
          border-radius: 0.75rem;
          text-align: left;
        }
        .lib-info { display: flex; flex-direction: column; }
        .lib-name { font-size: 0.9rem; font-weight: 700; color: #fff; }
        .lib-cat { font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; }

        .timer-card { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; padding: 2rem 1.5rem !important; }
        .timer-header { width: 100%; display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); }
        .round-badge { background: rgba(178, 34, 34, 0.1); color: var(--accent-color); padding: 0.25rem 0.75rem; border-radius: 1rem; }
        .current-exercise h3 { font-size: 1.5rem; text-align: center; color: #fff; }
        .main-clock { position: relative; width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; }
        .progress-ring { position: absolute; width: 100%; height: 100%; transform: rotate(-90deg); }
        .ring-bg { fill: none; stroke: rgba(255, 255, 255, 0.05); stroke-width: 8; }
        .ring-progress { fill: none; stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 0.3s ease; }
        .clock-text { display: flex; flex-direction: column; align-items: center; }
        .time-big { font-size: 4rem; font-weight: 800; color: #fff; line-height: 1; }
        .sec-label { font-size: 0.8rem; letter-spacing: 0.2em; color: var(--text-secondary); }
        .controls { display: flex; align-items: center; gap: 1.5rem; }
        .control-btn { background: none; border: none; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; }
        .control-btn.primary { width: 64px; height: 64px; background: var(--accent-color); color: #fff; border-radius: 50%; box-shadow: 0 0 20px rgba(178, 34, 34, 0.4); }
        .control-btn.primary.active { background: var(--surface-color); color: var(--accent-color); border: 2px solid var(--accent-color); }
      `}</style>
    </div>
  );
};

export default ArenaTimer;
