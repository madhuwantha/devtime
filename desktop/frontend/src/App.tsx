import { useState, useEffect } from 'react';
import './App.css';
import { Header, MainContent, FloatingElements } from './components';
import { useWorkState } from './hooks';
import Setup from './screens/Setup';
import { IsDBInitialized } from './wailsjs/go/main/App';

function App() {
  const [isDBInitialized, setIsDBInitialized] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkDBStatus();
  }, []);

  const checkDBStatus = async () => {
    try {
      const initialized = await IsDBInitialized();
      setIsDBInitialized(initialized);
    } catch (err) {
      console.error('Failed to check DB status:', err);
      setIsDBInitialized(false);
    } finally {
      setIsChecking(false);
    }
  };

  // Show setup screen if DB is not initialized
  if (isChecking || !isDBInitialized) {
    return <Setup />;
  }
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Minimized Header - Shows when tabs are selected */}
      <Header
        isVisible={true}
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
      {/* <Header
        isVisible={!isTabSelected}
        isWorking={isWorking}
        isPaused={isPaused}
        time={time}
        onStart={startWorking}
        onStop={stopWorking}
        onPause={pauseWorking}
        onResume={resumeWorking}
        size="full"
      /> */}

      {/* Main Content */}
      <MainContent
        tabs={tabs}
        selectedTab={selectedTab}
        onTabSelect={setSelectedTab}
        isTabSelected={true}
      />

      {/* Floating Elements */}
      <FloatingElements />
    </div>
  );
}

export default App;