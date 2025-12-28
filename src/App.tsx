import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, LayoutDashboard, Utensils, Zap } from 'lucide-react';
import './App.css';

// Components (We will create these next)
import WarriorClock from './components/WarriorClock';
import FuelLog from './components/FuelLog';
import ArenaTimer from './components/ArenaTimer';

type Tab = 'dashboard' | 'fuel' | 'arena';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="logo-section">
          <Shield className="logo-icon" />
          <h1>PROJECT SPARTAN</h1>
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
              <div className="dashboard-grid">
                <div className="quick-stats glass-card">
                  <h3>Daily Status</h3>
                  <div className="stat-row">
                    <Activity size={20} className="icon gold" />
                    <span>Zinciri Kırma: 7 Gün</span>
                  </div>
                </div>
              </div>
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
