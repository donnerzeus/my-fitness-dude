import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, LayoutDashboard, Utensils, Zap } from 'lucide-react';
import './App.css';

// Components (We will create these next)
import WarriorClock from './components/WarriorClock';
import FuelLog from './components/FuelLog';
import ArenaTimer from './components/ArenaTimer';
import ProgressSummary from './components/ProgressSummary';
import Measurements from './components/Measurements';
import MealPrep from './components/MealPrep';

type Tab = 'dashboard' | 'fuel' | 'arena';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Günaydın Spartan";
    if (hour < 18) return "Tünaydın Spartan";
    return "İyi Akşamlar Spartan";
  };

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="logo-section">
          <Shield className="logo-icon" />
          <div className="title-stack">
            <h1>PROJECT SPARTAN</h1>
            <span className="greeting">{getGreeting()}</span>
          </div>
        </div>
        <div className="day-badge">
          {new Date().toLocaleDateString('tr-TR', { weekday: 'long' })}
        </div>
      </header>

      <main className="content-area">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="tab-content"
            >
              <WarriorClock />
              <ProgressSummary />
              <Measurements />
            </motion.div>
          )}

          {activeTab === 'fuel' && (
            <motion.div
              key="fuel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="tab-content"
            >
              <FuelLog />
              <MealPrep />
            </motion.div>
          )}

          {activeTab === 'arena' && (
            <motion.div
              key="arena"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="tab-content"
            >
              <ArenaTimer />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <nav className="bottom-nav">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard />
          <span>Dashboard</span>
        </button>
        <button
          className={activeTab === 'fuel' ? 'active' : ''}
          onClick={() => setActiveTab('fuel')}
        >
          <Utensils />
          <span>Fuel</span>
        </button>
        <button
          className={activeTab === 'arena' ? 'active' : ''}
          onClick={() => setActiveTab('arena')}
        >
          <Zap />
          <span>Arena</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
