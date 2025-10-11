import { useState } from 'react';
import './App.css';
import { Header, MainContent, FloatingElements } from './components';
import { useWorkState } from './hooks';

function App() {
  const [selectedTab, setSelectedTabState] = useState(0);
  const [isTabSelected, setIsTabSelected] = useState(false);
  
  const {
    time,
    isWorking,
    isPaused,
    startWorking,
    stopWorking,
    pauseWorking,
    resumeWorking
  } = useWorkState();

  const setSelectedTab = (idx: number): void => {
    setSelectedTabState(idx);
    setIsTabSelected(true);
    // Scroll to top of the page to show full tab content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs = [
    { name: "Projects", icon: "📁" },
    { name: "Tasks", icon: "✅" },
    { name: "Analytics", icon: "📊" },
    { name: "Settings", icon: "⚙️" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Minimized Header - Shows when tabs are selected */}
      <Header
        isVisible={isTabSelected}
        isWorking={isWorking}
        isPaused={isPaused}
        time={time}
        onStart={startWorking}
        onStop={stopWorking}
        onPause={pauseWorking}
        onResume={resumeWorking}
        onExpand={() => setIsTabSelected(false)}
        size="minimized"
      />

      {/* Full Header - Shows when no tabs are selected */}
      <Header
        isVisible={!isTabSelected}
        isWorking={isWorking}
        isPaused={isPaused}
        time={time}
        onStart={startWorking}
        onStop={stopWorking}
        onPause={pauseWorking}
        onResume={resumeWorking}
        size="full"
      />

      {/* Main Content */}
      <MainContent
        tabs={tabs}
        selectedTab={selectedTab}
        onTabSelect={setSelectedTab}
        isTabSelected={isTabSelected}
      />

      {/* Floating Elements */}
      <FloatingElements />
    </div>
  );
}

export default App;