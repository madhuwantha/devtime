import React from 'react';

interface Tab {
  name: string;
  icon: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  selectedTab: number;
  onTabSelect: (index: number) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  selectedTab,
  onTabSelect
}) => {
  return (
    <div className="flex border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10">
      {tabs.map((tab, idx) => (
        <button
          key={tab.name}
          className={`
            flex-1 flex flex-row items-center justify-center gap-2 py-2 px-1 transition-all duration-300 relative group
            ${idx === selectedTab
              ? "text-cyan-400 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }
          `}
          onClick={() => onTabSelect(idx)}
        >
          <span className="text-md">{tab.icon}</span>
          <span className="text-sm font-medium">{tab.name}</span>

          {/* Active Indicator */}
          {idx === selectedTab && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
          )}

          {/* Hover Effect */}
          <div className={`
            absolute inset-0 rounded-t-2xl transition-opacity duration-300
            ${idx === selectedTab
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20'
              : 'bg-white/5 opacity-0 group-hover:opacity-100'
            }
          `}></div>
        </button>
      ))}
    </div>
  );
};
