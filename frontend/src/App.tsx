import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewTab } from './components/OverviewTab';
import { MatchingTab } from './components/MatchingTab';
import { DashboardTab } from './components/DashboardTab';
import { TestingTab } from './components/TestingTab';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'matching' && <MatchingTab />}
        {activeTab === 'bi' && <DashboardTab />}
        {activeTab === 'testing' && <TestingTab />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SmartHire Mini — Dự án Thực hành TH3 — Group 8</span>
          <span>FastAPI + SQLite + Scikit-learn + React TypeScript + Recharts</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

