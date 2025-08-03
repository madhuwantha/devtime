import  { useState } from "react";
import { useMyTaskList } from "../hooks/useMyTaskList";



export default function MyTask() {
 const [expandedId, setExpandedId] = useState<string | null>(null);

 const { data } = useMyTaskList();
 return (
  <div>
   <ul className="list-none p-0">
    {data?.map((task) => (
     <li
      key={task.id}
      className="relative border border-gray-300 rounded-lg mb-1 pl-3.5 pr-3.5 pb-1 pt-1 cursor-pointer hover:shadow"
      onClick={() =>
       setExpandedId(expandedId === task.id ? null : task.id)
      }
     >
      <div>
       <strong className="text-lg">{task.name}</strong>
       {/* <div className="text-xs text-gray-500 mt-1">
        Allocated: {task.allocatedTime} | Used: {task.usedTime}
       </div> */}
      </div>

      <button
       className="absolute right-4 top-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm rsor-pointer"
       onClick={(e) => {
        e.stopPropagation();
        alert(`Started: ${task.name}`);
       }}
      >
       Start
      </button>
      {expandedId === task.id && (
       <div className="mt-2 text-gray-700">{task.description}</div>
      )}
     </li>
    ))}
   </ul>
  </div>
 );
}
