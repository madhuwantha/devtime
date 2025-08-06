import { useEffect, useState } from "react";
import { useMyTaskList } from "../hooks/useMyTaskList";
import { GetTasks, StartTask, StopTask } from "../../wailsjs/go/main/App";
import { entity } from "../../wailsjs/go/models";



export default function MyTask() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [startingTask, setStartingTask] = useState<entity.Task|null>(null);
  const { tasks, activeTask, setActiveTask } = useMyTaskList();

  const [confiramtion, setConfirmation] = useState(false)

  const startTaskHandle = (task: entity.Task) => {
    setStartingTask(task);
    if (activeTask && task.TaskId !== activeTask?.TaskId) {
      setConfirmation(true);     
    } else {
      start(task)
    }
  }

  const stopCurrentAndStartNewTask = (task: entity.Task) => {
    stopTask().then((response) => {
      if (response) {
        start(task);
      }
    })
  }


  const start = (task: entity.Task) => {
    StartTask(task.ProjectId, task.TaskId)
      .then((response) => {
        console.log("Task started successfully:", response);
        setActiveTask(previous => {          
          return previous = task;
        })
      })
      .catch((error) => {
        console.error("Error starting task:", error);
      }).finally(() => {
        setStartingTask(null);
      })
  }

  const stopTask = async () => {
    return await new Promise((resolve) => {
      StopTask()
      .then((response) => {
        console.log("Task stopped successfully:", response);
        setActiveTask(previous => {
          return null
        })
        resolve(true);
      })
      .catch((error) => {
        console.error("Error stopping task:", error);
        resolve(false);
      });
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
                startTaskHandle(task);
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


      {confiramtion && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          {/* Modal Box */}
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Popup Title</h2>
            <p className="text-gray-700 mb-4">
              You are currently doing {activeTask?.Name}. To start this task, the current active task should be stopped. Do you want to continue?
            </p>
            {/* Close button (X) */}
            <button
              onClick={() => setConfirmation(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
           
            <button
              onClick={() => setConfirmation(false)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
            >
              Close
            </button>
            <button
              onClick={() => {
                setConfirmation(false);       
                if(startingTask){
                  stopCurrentAndStartNewTask(startingTask);    
                }     
              }}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
            >
              Ok
            </button>
          </div>
        </div>
      )}


    </div>
  );
}


