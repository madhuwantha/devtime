import { useEffect, useState } from 'react';
import './App.css';
import MyProjects from './screens/MyProjects';
import MyTask from './screens/MyTask';
import { IsWorking, StartWork, StopWork } from '../wailsjs/go/main/App';


function App() {
  const [selectedTab, setSelectedTabState] = useState(0);
  const [isWorking, setIsWorkingState] = useState(false);

  function setSelectedTab(idx: number): void {
    setSelectedTabState(idx);
  }

  const startWorking = () => {
    StartWork().then((res) => {
      setIsWorkingState(res);
    });
  }
  const stopWorking = () => {
    StopWork().then((res) => {
      setIsWorkingState(res);
    });
  }
  const checkIsWorking = () => IsWorking();

  useEffect(() => {
    checkIsWorking().then((res) => {
      setIsWorkingState(res);
    });
  }, []);

  return (
    <main className="flex flex-col items-center justify-start h-screen">
      <div className="flex flex-col items-center justify-center w-screen">
        <h1 className="text-3xl font-boldr">Dev Time</h1>
        <div className="flex flex-row w-screen justify-between px-10">          
          <button disabled={isWorking} onClick={startWorking} type="button" className={'mt-2 px-4 py-2 bg-green-500 text-white rounded' + `${isWorking ? ' opacity-50 cursor-not-allowed' : ' cursor-pointer'}`}>Start Working</button>
          <button disabled={!isWorking} onClick={stopWorking} type="button" className={'mt-2 px-4 py-2 bg-red-500 text-white rounded' + `${!isWorking ? ' opacity-50 cursor-not-allowed' : ' cursor-pointer'}`}>Stop Working</button>
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
