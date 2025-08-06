import { useEffect, useState } from "react";
import { useMyTaskList } from "../hooks/useMyTaskList";
import { GetTasks, StartTask, StopTask } from "../../wailsjs/go/main/App";
import { entity } from "../../wailsjs/go/models";



export default function MyTask() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { tasks, activeTask, loading } = useMyTaskList();

  const startTask = (task: entity.Task) => {
    StartTask(task.ProjectId, task.TaskId)
      .then((response) => {
        console.log("Task started successfully:", response);
      })
      .catch((error) => {
        console.error("Error starting task:", error);
      });
  }

  const stopTask = () => {
    StopTask()
      .then((response) => {
        console.log("Task stopped successfully:", response);
      })
      .catch((error) => {
        console.error("Error stopping task:", error);
      });
  }


  return (
    <div>
      <ul className="list-none p-0">
        {tasks?.map((task) => (
          <li
            key={task.TaskId}
            className="relative border border-gray-300 rounded-lg mb-1 pl-3.5 pr-3.5 pb-1 pt-1 cursor-pointer hover:shadow"
            onClick={() =>
              setExpandedId(expandedId === task.TaskId ? null : task.TaskId)
            }
          >
            <div>
              <strong className="text-lg">{task.Name}</strong>
            </div>

            <button
              className="absolute right-4 top-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm rsor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                startTask(task);
              }}
            >
              Start
            </button>
            {(activeTask && activeTask.TaskId === task.TaskId) && <button
              className="absolute right-4 top-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm rsor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                stopTask();
              }}
            >
              Stop
            </button>}


            {expandedId === task.TaskId && (
              <div className="mt-2 text-gray-700">{task.Name}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
