import { useState } from 'react';
import './App.css';
import MyProjects from './screens/MyProjects';
import MyTask from './screens/MyTask';
import { StartWork, StopWork } from '../wailsjs/go/main/App';


function App() {
  const [selectedTab, setSelectedTabState] = useState(0);

  function setSelectedTab(idx: number): void {
    setSelectedTabState(idx);
  }

  const startWorking = () => StartWork();
  const stopWorking = () => StopWork();

  return (
    <main className="flex flex-col items-center justify-start h-screen">
      <div className="flex flex-col items-center justify-center w-screen">
        <h1 className="text-3xl font-boldr">Dev Time</h1>
        <div className="flex flex-row w-screen justify-between px-10">          
          <button onClick={startWorking} type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Start Working</button>
          <button onClick={stopWorking} type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Stop Working</button>
        </div>
      </div>

      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg">
        <div className="flex border-b">
          {["Projects", "Tasks", "Profile", "Setting"].map((tab, idx) => (
            <button
              key={tab}
              className={`flex-1 py-3 text-lg font-medium transition-colors ${idx === selectedTab
                  ? "border-b-2 border-amber-600 text-amber-700"
                  : "text-gray-500 hover:text-amber-600"
                }`}
              onClick={() => setSelectedTab(idx)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-6">
          {selectedTab === 0 && <MyProjects />}
          {selectedTab === 1 && <MyTask />}
        </div>
      </div>
    </main>
  );
}

export default App
