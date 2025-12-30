import React from 'react';
import { TabNavigation } from './TabNavigation';
import MyProjects from '../../screens/MyProjects';
import MyTask from '../../screens/MyTask';
import Analytics from '../../screens/Analytics';

interface Tab {
  name: string;
  icon: string;
}

interface MainContentProps {
  tabs: Tab[];
  selectedTab: number;
  onTabSelect: (index: number) => void;
  isTabSelected: boolean;
}

export const MainContent: React.FC<MainContentProps> = ({
  tabs,
  selectedTab,
  onTabSelect,
  isTabSelected
}) => {
  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <MyProjects />;
      case 1:
        return <MyTask />;
      case 2:
        return <Analytics />;
      case 3:
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚙️</div>
            <h3 className="text-2xl font-semibold text-slate-200 mb-2">Settings</h3>
            <p className="text-slate-400">Settings panel coming soon...</p>
          </div>
        );
      default:
        return <MyProjects />;
    }
  };

  return (
    <main className={`relative z-10 px-1 pb-2 lg:px-12 main-content ${isTabSelected ? 'pt-1' : ''} flex-1 flex flex-col min-h-0 w-full`}>
      <div className="w-full h-full flex flex-col">
        <div className="bg-white/5 backdrop-blur-xl rounded-1xl border border-white/10 shadow-2xl overflow-hidden flex-1 flex flex-col min-h-0 w-full">
          <TabNavigation
            tabs={tabs}
            selectedTab={selectedTab}
            onTabSelect={onTabSelect}
          />
          
          <div className="p-3 flex-1 flex flex-col min-h-0 overflow-auto">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </main>
  );
};
