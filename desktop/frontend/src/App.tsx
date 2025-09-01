import { useEffect, useState } from 'react';
import { Transition } from 'react-transition-group';
import './App.css';
import MyProjects from './screens/MyProjects';
import MyTask from './screens/MyTask';
import { IsWorking, PauseWork, ResumeWork, StartWork, StopWork } from '../wailsjs/go/main/App';
import { EventsOn } from "../wailsjs/runtime/runtime";




function App() {
  const [time, setTime] = useState("00:00:00");

  const [selectedTab, setSelectedTabState] = useState(0);
  const [isWorking, setIsWorkingState] = useState(false);
  const [isPause, setIsPauseState] = useState(false);
  const [isTabSelected, setIsTabSelected] = useState(false);

  function setSelectedTab(idx: number): void {
    setSelectedTabState(idx);
    setIsTabSelected(true);
    // Scroll to top of the page to show full tab content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const startWorking = () => {
    StartWork().then((res) => {
      setIsWorkingState(res);
    });
  }
  
  const stopWorking = () => {
    StopWork().then((res) => {      
      setIsWorkingState(false);
    });
  }
  const pauseWorking = () => {
    PauseWork().then((res) => {      
      setIsWorkingState(false);
      setIsPauseState(true);
    });
  }
    const resumeWorking = () => {
    ResumeWork().then((res) => {
      setIsWorkingState(res);
      setIsPauseState(false);
    });
  }
  
  const checkIsWorking = () => IsWorking();

  useEffect(() => {
    checkIsWorking().then((res) => {
      setIsWorkingState(res);
    });

    EventsOn("workingTimer:update", (data: string) => {
      setTime(data);
    });

  }, []);

  const tabs = [
    { name: "Projects", icon: "📁" },
    { name: "Tasks", icon: "✅" },
    { name: "Profile", icon: "👤" },
    { name: "Settings", icon: "⚙️" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Minimized Header - Shows when tabs are selected */}
      <Transition in={isTabSelected} timeout={300} mountOnEnter unmountOnExit>
        {(state: string) => (
          <header className={`relative z-20 bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-lg transition-all duration-300 ease-in-out ${
            state === 'entering' ? 'opacity-0 transform -translate-y-4' : 
            state === 'exiting' ? 'opacity-0 transform -translate-y-4' : 
            'opacity-100 transform translate-y-0'
          }`}>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Logo and Title */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                    <span className="text-xl">⏱️</span>
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Dev Time
                  </h1>
                  {time !== "00:00:00" && <h2 className='relative group px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 active:scale-95'>{time}</h2>}
                </div>

                {/* Work Controls */}
                <div className="flex items-center gap-3">
                  {!isWorking && <button
                    disabled={isWorking}
                    onClick={startWorking}
                    className={`
                      relative group px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 active:scale-95
                      ${isWorking 
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50' 
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isWorking ? 'bg-slate-400' : 'bg-white'}`}></div>
                      Start
                    </span>
                  </button>}

                  {isWorking && !isPause && <button
                    disabled={isWorking}
                    onClick={pauseWorking}
                    className={`
                      relative group px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 active:scale-95
                      ${!isWorking
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${!isWorking ? 'bg-slate-400' : 'bg-white'}`}></div>
                      Pause
                    </span>
                  </button>}

                  {isPause && <button
                    disabled={isWorking}
                    onClick={resumeWorking}
                    className={`
                      relative group px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 active:scale-95
                      ${!isWorking
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${!isWorking ? 'bg-slate-400' : 'bg-white'}`}></div>
                      Resume
                    </span>
                  </button>}

                  {isWorking && !isPause && <button
                    disabled={!isWorking}
                    onClick={stopWorking}
                    className={`
                      relative group px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 active:scale-95
                      ${!isWorking 
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50' 
                        : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${!isWorking ? 'bg-slate-400' : 'bg-white'}`}></div>
                      Stop
                    </span>
                  </button>}

                  {/* Expand Header Button */}
                  <button
                    onClick={() => setIsTabSelected(false)}
                    className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-slate-200 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg"
                    title="Show full header"
                  >
                    <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </header>
        )}
      </Transition>

      {/* Header Section */}
      <Transition in={!isTabSelected} timeout={400} mountOnEnter unmountOnExit>
        {(state: string) => (
          <header className={`relative overflow-hidden transition-all duration-400 ease-in-out ${
            state === 'entering' ? 'opacity-0 transform translate-y-4' : 
            state === 'exiting' ? 'opacity-0 transform translate-y-4' : 
            'opacity-100 transform translate-y-0'
          }`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>
            
            <div className="relative z-10 px-6 py-8 lg:px-12 lg:py-12">
              <div className="max-w-7xl mx-auto">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl mb-4 shadow-2xl shadow-cyan-500/25">
                    <span className="text-3xl">⏱️</span>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Dev Time
                  </h1>
                  <p className="text-slate-300 text-lg mt-2">Track your development journey</p>                  
                </div>

                {/* Work Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  <button
                    disabled={isWorking}
                    onClick={startWorking}
                    className={`
                      relative group px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95
                      ${isWorking 
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50' 
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isWorking ? 'bg-slate-400' : 'bg-white'}`}></div>
                      Start Working
                    </span>
                    {!isWorking && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    )}
                  </button>

                  <button
                    disabled={!isWorking}
                    onClick={stopWorking}
                    className={`
                      relative group px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95
                      ${!isWorking 
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50' 
                        : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${!isWorking ? 'bg-slate-400' : 'bg-white'}`}></div>
                      Stop Working
                    </span>
                    {isWorking && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    )}
                  </button>
                </div>

                {/* Status Indicator */}
                <div className="flex justify-center">
                  <div className={`
                    flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-sm border
                    ${isWorking 
                      ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300' 
                      : 'bg-slate-500/20 border-slate-400/30 text-slate-300'
                    }
                  `}>
                    <div className={`
                      w-3 h-3 rounded-full animate-pulse
                      ${isWorking ? 'bg-emerald-400' : 'bg-slate-400'}
                    `}></div>
                    <span className="text-sm font-medium">
                      {isWorking ? 'Currently Working' : 'Not Working'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>
        )}
      </Transition>

      {/* Main Content */}
      <main className={`relative z-10 px-3 pb-12 lg:px-12 main-content ${isTabSelected ? 'pt-1' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.name}
                  className={`
                    flex-1 flex flex-col items-center gap-2 py-2 px-1 transition-all duration-300 relative group
                    ${idx === selectedTab
                      ? "text-cyan-400 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }
                  `}
                  onClick={() => setSelectedTab(idx)}
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

            {/* Tab Content */}
            <div className="p-3">
              {selectedTab === 0 && <MyProjects />}
              {selectedTab === 1 && <MyTask />}
              {selectedTab === 2 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👤</div>
                  <h3 className="text-2xl font-semibold text-slate-200 mb-2">Profile</h3>
                  <p className="text-slate-400">Profile settings coming soon...</p>
                </div>
              )}
              {selectedTab === 3 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⚙️</div>
                  <h3 className="text-2xl font-semibold text-slate-200 mb-2">Settings</h3>
                  <p className="text-slate-400">Settings panel coming soon...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Elements */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
}

export default App;
