import React from 'react';
import { Layers, Cpu, BarChart3, CheckCircle2, Briefcase } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'overview', label: '1. Tổng quan & Thiết kế', icon: Layers },
    { id: 'matching', label: '2. AI CV Matching', icon: Cpu },
    { id: 'bi', label: '3. Dashboard BI', icon: BarChart3 },
    { id: 'testing', label: '4. Kiểm thử & Đánh giá', icon: CheckCircle2 },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Tiêu đề */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-slate-800 tracking-tight">SmartHire Mini</span>
                <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-full">
                  Group 8
                </span>
              </div>
              <p className="text-xs text-slate-500">Hệ thống tìm việc thông minh tích hợp AI & BI</p>
            </div>
          </div>

          {/* 4 Tabs điều hướng theo 4 màn hình */}
          <nav className="flex space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="hidden md:inline">{item.label}</span>
                  <span className="md:hidden">{item.label.split('.')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

