import { useState } from "react";
import "./App.css";
import MyTask from "./screens/MyTask";
import MyProjects from "./screens/MyProjects";

function App() {


  const [selectedTab, setSelectedTabState] = useState(0);

  function setSelectedTab(idx: number): void {
    setSelectedTabState(idx);
  }
  return (
    <main className="flex flex-col items-center justify-start h-screen">       
    <div className="flex flex-col items-center justify-center w-screen">
      <h1 className="text-3xl font-boldr">Dev Time</h1> 
    </div>

    <div className="w-full max-w-xl bg-white rounded-lg shadow-lg">
      <div className="flex border-b">
        {["Tasks", "Projects", "Profile", "Setting"].map((tab, idx) => (
          <button
            key={tab}
            className={`flex-1 py-3 text-lg font-medium transition-colors ${
              idx === selectedTab
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
        {selectedTab === 0 && <MyTask />}
        {selectedTab === 1 && <MyProjects />}
      </div>
    </div>
    </main>
  );
}

export default App;
