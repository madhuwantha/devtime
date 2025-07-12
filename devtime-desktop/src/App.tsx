import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import MyTask from "./screens/MyTask";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

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
      </div>
    </div>


      
      
      
      {/* <h1>Welcome to</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p> */}
    </main>
  );
}

export default App;
