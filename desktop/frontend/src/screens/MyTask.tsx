import  { useEffect, useState } from "react";
import { useMyTaskList } from "../hooks/useMyTaskList";
import { GetTasks } from "../../wailsjs/go/main/App";
import { entity } from "../../wailsjs/go/models";



export default function MyTask() {
 const [expandedId, setExpandedId] = useState<string | null>(null);
 const [data, setData] = useState<entity.Task[]>([]);

//  const { data } = useMyTaskList();


  useEffect(() => {
    GetTasks().then((tasks) => {      
      setData(tasks);
    }).catch((error) => {
      console.error("Error fetching projects:", error);
    });
  }, []);


 return (
  <div>
   <ul className="list-none p-0">
    {data?.map((task) => (
     <li
      key={task.TaskId}
      className="relative border border-gray-300 rounded-lg mb-1 pl-3.5 pr-3.5 pb-1 pt-1 cursor-pointer hover:shadow"
      onClick={() =>
       setExpandedId(expandedId === task.TaskId ? null : task.TaskId)
      }
     >
      <div>
       <strong className="text-lg">{task.Name}</strong>
       {/* <div className="text-xs text-gray-500 mt-1">
        Allocated: {task.allocatedTime} | Used: {task.usedTime}
       </div> */}
      </div>

      <button
       className="absolute right-4 top-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm rsor-pointer"
       onClick={(e) => {
        e.stopPropagation();
        console.log("Start task clicked", task);
       }}
      >
       Start
      </button>
      {expandedId === task.TaskId && (
       <div className="mt-2 text-gray-700">{task.Name}</div>
      )}
     </li>
    ))}
   </ul>
  </div>
 );
}
