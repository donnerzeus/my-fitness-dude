import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronRight, Dumbbell, RefreshCw, X, Check, Info } from 'lucide-react';
import { StorageService } from '../services/StorageService';

interface Exercise {
  id: string;
  name: string;
  duration: number; // Set time (average 45s for 10-12 reps)
  category: 'Push' | 'Pull' | 'Legs' | 'Rest';
}

const EXERCISE_LIBRARY: Exercise[] = [
  // PUSH
  { id: 'db-press', name: 'Dumbbell Flat Press', duration: 45, category: 'Push' },
  { id: 'db-incline', name: 'Dumbbell Incline Press', duration: 45, category: 'Push' },
  { id: 'db-shoulder', name: 'Seated DB Press', duration: 45, category: 'Push' },
  { id: 'db-lateral', name: 'DB Lateral Raise', duration: 40, category: 'Push' },
  { id: 'db-triceps', name: 'DB Overhead Extension', duration: 45, category: 'Push' },

  // PULL
  { id: 'db-row', name: 'Single Arm DB Row', duration: 50, category: 'Pull' },
  { id: 'db-pullover', name: 'Dumbbell Pullover', duration: 45, category: 'Pull' },
  { id: 'db-rearfly', name: 'DB Rear Delt Fly', duration: 40, category: 'Pull' },
  { id: 'db-curl', name: 'Dumbbell Curls', duration: 45, category: 'Pull' },
  { id: 'db-hammer', name: 'Dumbbell Hammer Curls', duration: 45, category: 'Pull' },

  // LEGS
  { id: 'db-goblet', name: 'DB Goblet Squat', duration: 50, category: 'Legs' },
  { id: 'db-rdl', name: 'DB Romanian Deadlift', duration: 50, category: 'Legs' },
  { id: 'db-split', name: 'Bulgarian Split Squat', duration: 60, category: 'Legs' },
  { id: 'db-calf', name: 'DB Calf Raise', duration: 40, category: 'Legs' },

  { id: 'rest', name: 'STRATEGIC REST', duration: 90, category: 'Rest' }
];

const INTENSITY_MODS = [
  { name: 'Slow Negatives', desc: '3 sec eccentric (lowering weight)', icon: '⬇️' },
  { name: 'Stretched Partials', desc: 'Add half-reps at muscle stretch point', icon: '📏' },
  { name: 'Pause at Bottom', desc: '2 sec hold at the hardest part', icon: '🛑' },
  { name: 'Unilateral Focus', desc: 'Work one limb at a time', icon: '🌓' }
];

const DEFAULT_CIRCUIT = ['db-press', 'db-row', 'db-goblet', 'db-shoulder', 'db-curl', 'rest'];

const ArenaTimer: React.FC = () => {
  const stats = StorageService.getStats();
  const [circuitIds, setCircuitIds] = useState<string[]>(stats.customWorkout || DEFAULT_CIRCUIT);
  const [isSwappingIdx, setIsSwappingIdx] = useState<number | null>(null);

  const currentCircuit = circuitIds.map(id => EXERCISE_LIBRARY.find(ex => ex.id === id)!);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(currentCircuit[0].duration);
  const [isActive, setIsActive] = useState(false);
  const [round, setRound] = useState(1);
  const [currentReps, setCurrentReps] = useState<string>('');

  const exerciseReps = stats.exerciseReps || {};
  const currentExercise = currentCircuit[currentIdx];
  const previousRecord = exerciseReps[currentExercise.id] || 0;

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
    if (currentReps && !isNaN(parseInt(currentReps))) {
      const reps = parseInt(currentReps);
      const newReps = { ...exerciseReps };
      if (reps > (newReps[currentExercise.id] || 0)) {
        newReps[currentExercise.id] = reps;
        StorageService.saveStats({ ...stats, exerciseReps: newReps });
      }
    }
    setCurrentReps('');

    if (currentIdx < currentCircuit.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setTimeLeft(currentCircuit[currentIdx + 1].duration);
    } else {
      if (round < 3) {
        setRound(round + 1);
        setCurrentIdx(0);
        setTimeLeft(currentCircuit[0].duration);
      } else {
        setIsActive(false);
        const currentStats = StorageService.getStats();
        StorageService.saveStats({ ...currentStats, workoutCompleted: true });
        alert('WARRIOR VICTORIOUS! Mechanical Tension applied.');
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
        <h2>Hypertrophy Arena</h2>
      </div>

      <div className="glass-card hypertrophy-tip">
        <Info size={16} className="gold" />
        <p><strong>Guray Max Logic:</strong> Focus on Mechanical Tension. Leave 0-1 reps in reserve (RIR).</p>
      </div>

      <div className="intensity-modifiers">
        {INTENSITY_MODS.map((mod, i) => (
          <div key={i} className="mod-pill" title={mod.desc}>
            <span>{mod.icon}</span>
            <label>{mod.name}</label>
          </div>
        ))}
      </div>

      {!isActive && isSwappingIdx === null && (
        <div className="glass-card circuit-preview">
          <div className="preview-header">
            <h3>Current Battle Plan (DB + Bench)</h3>
            <span className="total-rounds">3 Rounds Total</span>
          </div>
          <div className="preview-list">
            {currentCircuit.map((ex, i) => (
              <div key={i} className="preview-item">
                <div className="p-item-left">
                  <span className="cat-tag">{ex.category}</span>
                  <span>{ex.name}</span>
                </div>
                <button className="swap-btn-mini" onClick={() => setIsSwappingIdx(i)}>
                  <RefreshCw size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {isSwappingIdx !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="modal-overlay" onClick={() => setIsSwappingIdx(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card library-modal"
            >
              <div className="modal-header">
                <h3>Choose Movement</h3>
                <button className="close-btn" onClick={() => setIsSwappingIdx(null)}><X size={20} /></button>
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
          </>
        )}
      </AnimatePresence>

      <div className="glass-card timer-card">
        <div className="timer-header">
          <span className="round-badge">Set {round} / 3</span>
          <span className="exercise-index">{currentIdx + 1} of {currentCircuit.length}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
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
                stroke: currentExercise.category === 'Rest' ? '#3b82f6' : 'var(--accent-color)'
              }}
            />
          </svg>
          <div className="clock-text">
            <span className="time-big">{timeLeft}</span>
            <span className="sec-label">SEC</span>
          </div>
        </div>

        {currentExercise.category !== 'Rest' && (
          <div className="ghost-tracker">
            <div className="record-box">
              <span className="record-label">MAX TENSION REPS</span>
              <span className="record-val">{previousRecord} REPS</span>
            </div>
            <div className="rep-input-area">
              <input
                type="number"
                placeholder="REPS"
                value={currentReps}
                onChange={(e) => setCurrentReps(e.target.value)}
                className="rep-input"
              />
            </div>
          </div>
        )}

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
        .hypertrophy-tip { display: flex; align-items: flex-start; gap: 0.75rem; background: rgba(212, 175, 55, 0.05); border: 1px dashed var(--primary-color); }
        .hypertrophy-tip p { font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4; }
        
        .intensity-modifiers { display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem; }
        .mod-pill {
            flex-shrink: 0; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border);
            padding: 0.4rem 0.8rem; border-radius: 2rem; display: flex; align-items: center; gap: 0.4rem;
        }
        .mod-pill span { font-size: 0.8rem; }
        .mod-pill label { font-size: 0.65rem; font-weight: 700; color: var(--text-secondary); white-space: nowrap; }
        
        .preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .preview-header h3 { font-size: 0.9rem; color: #fff; }
        .total-rounds { font-size: 0.7rem; font-weight: 800; color: var(--primary-color); }
        
        .preview-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .preview-item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.75rem; background: rgba(255, 255, 255, 0.03); border-radius: 0.75rem;
        }
        .p-item-left { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; color: #fff; }
        .cat-tag { 
            font-size: 0.6rem; font-weight: 800; padding: 0.2rem 0.5rem; 
            background: rgba(255,255,255,0.05); border-radius: 4px; color: var(--text-secondary);
        }
        
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px); z-index: 99; }
        .library-modal {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) !important;
          width: 92%; max-width: 400px; max-height: 80vh; z-index: 100;
          background: #0c0e0e !important; border: 1px solid var(--primary-color) !important;
          padding: 1.5rem !important; display: flex; flex-direction: column; box-shadow: 0 0 50px rgba(212, 175, 55, 0.15);
        }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .modal-header h3 { font-size: 1.1rem; color: var(--primary-color); font-weight: 800; text-transform: uppercase; }
        .close-btn { background: none; border: none; color: var(--text-secondary); }
        .library-list { display: flex; flex-direction: column; gap: 0.75rem; overflow-y: auto; flex: 1; }
        .lib-item {
          display: flex; justify-content: space-between; align-items: center;
          background: rgba(255, 255, 255, 0.03); border: 1px solid var(--glass-border);
          padding: 1rem; border-radius: 0.75rem; text-align: left;
        }
        .lib-name { font-size: 0.9rem; font-weight: 700; color: #fff; display: block; }
        .lib-cat { font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; }

        .timer-card { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; padding: 2.5rem 1.5rem !important; }
        .round-badge { background: rgba(178, 34, 34, 0.1); color: var(--accent-color); padding: 0.35rem 0.85rem; border-radius: 2rem; border: 1px solid rgba(178, 34, 34, 0.2); }
        .current-exercise h3 { font-size: 1.75rem; text-align: center; color: #fff; font-weight: 800; letter-spacing: -0.02em; }
        .main-clock { position: relative; width: 220px; height: 220px; display: flex; align-items: center; justify-content: center; }
        .progress-ring { position: absolute; width: 100%; height: 100%; transform: rotate(-90deg); }
        .ring-bg { fill: none; stroke: rgba(255, 255, 255, 0.03); stroke-width: 6; }
        .ring-progress { fill: none; stroke-width: 6; stroke-linecap: round; transition: stroke-dashoffset 0.5s ease; }
        .time-big { font-size: 4.5rem; font-weight: 900; color: #fff; line-height: 1; margin-bottom: -5px; }
        .sec-label { font-size: 0.9rem; letter-spacing: 0.3em; color: var(--text-secondary); font-weight: 700; }

        .ghost-tracker {
          width: 100%; display: flex; justify-content: space-between; align-items: center;
          padding: 1.25rem; background: rgba(212, 175, 55, 0.03); border-radius: 1rem; border: 1px dashed rgba(212, 175, 55, 0.2);
        }
        .record-label { font-size: 0.65rem; font-weight: 800; color: var(--primary-color); letter-spacing: 0.1em; display: block; margin-bottom: 0.2rem; }
        .record-val { font-size: 1.25rem; font-weight: 900; color: #fff; }
        .rep-input {
          width: 80px; background: rgba(0,0,0,0.3); border: 1px solid var(--primary-color);
          border-radius: 0.75rem; color: #fff; padding: 0.75rem; text-align: center; font-weight: 900; font-size: 1.5rem;
        }

        .controls { display: flex; align-items: center; gap: 2rem; }
        .control-btn { background: none; border: none; color: var(--text-secondary); transition: all 0.2s ease; }
        .control-btn.primary { 
            width: 72px; height: 72px; background: var(--primary-color); color: #000; 
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            box-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
        }
        .control-btn.primary.active { background: #000; color: var(--primary-color); border: 3px solid var(--primary-color); }
      `}</style>
    </div>
  );
};

export default ArenaTimer;
