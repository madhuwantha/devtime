import {useState} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import {Greet} from "../wailsjs/go/main/App";
import MyProjects from './screens/MyProjects';
import MyTask from './screens/MyTask';

// function App() {
//     const [resultText, setResultText] = useState("Please enter your name below 👇");
//     const [name, setName] = useState('');
//     const updateName = (e: any) => setName(e.target.value);
//     const updateResultText = (result: string) => setResultText(result);

//     function greet() {
//         Greet(name).then(updateResultText);
//     }

//     return (
//         <div id="App">
//             <button className="bg-red-500">BCD</button>
//             {/* <img src={logo} id="logo" alt="logo"/>
//             <div id="result" className="result">{resultText}</div>
//             <div id="input" className="input-box">
//                 <input id="name" className="input" onChange={updateName} autoComplete="off" name="input" type="text"/>
//                 <button className="btn" onClick={greet}>Greet</button>
//             </div> */}
//         </div>
//     )
// }

function App() {


  const [selectedTab, setSelectedTabState] = useState(0);

  function setSelectedTab(idx: number): void {
    setSelectedTabState(idx);
  }

  async function runMyCli() {
    try {
      const result = await invoke<string>('run_cli_command', {
        args: ['test']
      })
      console.log('CLI Output:', result)
    } catch (error) {
      console.error('CLI Error:', error)
    }
  }


  return (
    <main className="flex flex-col items-center justify-start h-screen">       
    <div className="flex flex-col items-center justify-center w-screen">
      <h1 className="text-3xl font-boldr">Dev Time</h1> 
      <button onClick={runMyCli} className="bg-green-200 py-1 px-3 round">Test</button>
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

export default App
