import { useEffect, useState } from "react";
import { useMyTaskList } from "../hooks/useMyTaskList";
import { GetTasks, StartTask, StopTask } from "../../wailsjs/go/main/App";
import { entity } from "../../wailsjs/go/models";

export default function MyTask() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [startingTask, setStartingTask] = useState<entity.Task|null>(null);
  const { tasks, activeTask, setActiveTask } = useMyTaskList();
  const [confirmation, setConfirmation] = useState(false);

  const startTaskHandle = (task: entity.Task) => {
    setStartingTask(task);
    if (activeTask && task.TaskId !== activeTask?.TaskId) {
      setConfirmation(true);     
    } else {
      start(task);
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

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-slate-500 to-slate-600 rounded-2xl mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h3 className="text-2xl font-semibold text-slate-200 mb-2">No Tasks Found</h3>
        <p className="text-slate-400 mb-6">Start by creating your first task</p>
        <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25">
          Create Task
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-1">My Tasks</h2>
          <p className="text-slate-400">Manage and track your development tasks</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25 flex items-center gap-2">
          <span className="text-lg">+</span>
          New Task
        </button>
      </div>

      {/* Active Task Banner */}
      {activeTask && (
        <div className="p-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white text-xl font-bold animate-pulse">
                ⏱️
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-300">Currently Working On</h3>
                <p className="text-emerald-200">{activeTask.Name}</p>
              </div>
            </div>
            <button
              onClick={() => stopTask()}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-rose-500/25"
            >
              Stop Task
            </button>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.TaskId}
            className={`
              group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
              ${expandedId === task.TaskId 
                ? 'ring-2 ring-cyan-400/50 bg-white/10 shadow-lg shadow-cyan-500/20' 
                : 'hover:bg-white/10 hover:border-white/20 hover:shadow-lg'
              }
              ${activeTask && activeTask.TaskId === task.TaskId ? 'ring-2 ring-emerald-400/50 bg-emerald-500/10' : ''}
            `}
            onClick={() =>
              setExpandedId(expandedId === task.TaskId ? null : task.TaskId)
            }
          >
            {/* Task Header */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold
                    ${activeTask && activeTask.TaskId === task.TaskId
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                      : expandedId === task.TaskId
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                      : 'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-300 group-hover:from-slate-500 group-hover:to-slate-600'
                    }
                  `}>
                    {task.Name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className={`
                      text-xl font-semibold transition-colors duration-300
                      ${activeTask && activeTask.TaskId === task.TaskId 
                        ? 'text-emerald-300' 
                        : expandedId === task.TaskId 
                        ? 'text-cyan-300' 
                        : 'text-slate-100'
                      }
                    `}>
                      {task.Name}
                    </h3>
                    <p className="text-slate-400 text-sm">Task ID: {task.TaskId}</p>
                    <p className="text-slate-400 text-sm">Project ID: {task.ProjectId}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Task Status Indicator */}
                  {activeTask && activeTask.TaskId === task.TaskId && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-emerald-300 text-sm font-medium">Active</span>
                    </div>
                  )}
                  
                  {/* Action Button */}
                  {activeTask && activeTask.TaskId === task.TaskId ? (
                    <button
                      className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-rose-500/25"
                      onClick={(e) => {
                        e.stopPropagation();
                        stopTask();
                      }}
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25"
                      onClick={(e) => {
                        e.stopPropagation();
                        startTaskHandle(task);
                      }}
                    >
                      Start
                    </button>
                  )}
                  
                  {/* Expand/Collapse Indicator */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                    ${expandedId === task.TaskId 
                      ? 'bg-cyan-500/20 text-cyan-400 rotate-180' 
                      : 'bg-slate-600/50 text-slate-400 group-hover:bg-slate-500/50'
                    }
                  `}>
                    <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === task.TaskId && (
              <div className="border-t border-white/10 bg-gradient-to-r from-white/5 to-white/10">
                <div className="p-6 space-y-4">
                  {/* Task Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-slate-300 font-medium text-sm uppercase tracking-wider">Task Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Name:</span>
                          <span className="text-slate-200 font-medium">{task.Name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Task ID:</span>
                          <span className="text-slate-200 font-mono text-sm">{task.TaskId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Project ID:</span>
                          <span className="text-slate-200 font-mono text-sm">{task.ProjectId}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-slate-300 font-medium text-sm uppercase tracking-wider">Quick Actions</h4>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-slate-200 rounded-lg text-sm font-medium hover:from-slate-500 hover:to-slate-600 transition-all duration-300 transform hover:scale-105">
                          View Project
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    {activeTask && activeTask.TaskId === task.TaskId ? (
                      <button 
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-rose-500/25"
                        onClick={() => stopTask()}
                      >
                        Stop Task
                      </button>
                    ) : (
                      <button 
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25"
                        onClick={() => startTaskHandle(task)}
                      >
                        Start Task
                      </button>
                    )}
                    <button className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-slate-200 rounded-xl font-medium hover:from-slate-500 hover:to-slate-600 transition-all duration-300 transform hover:scale-105">
                      Archive
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-cyan-400">{tasks.length}</div>
            <div className="text-slate-400 text-sm">Total Tasks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">{activeTask ? 1 : 0}</div>
            <div className="text-slate-400 text-sm">Active Tasks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">{tasks.length - (activeTask ? 1 : 0)}</div>
            <div className="text-slate-400 text-sm">Available</div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Close button */}
            <button
              onClick={() => setConfirmation(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Modal Content */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                ⚠️
              </div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Task Switch Confirmation</h2>
              <p className="text-slate-400 leading-relaxed">
                You are currently working on <span className="text-emerald-300 font-medium">{activeTask?.Name}</span>. 
                To start <span className="text-cyan-300 font-medium">{startingTask?.Name}</span>, the current task will be stopped.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmation(false)}
                className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmation(false);       
                  if(startingTask){
                    stopCurrentAndStartNewTask(startingTask);    
                  }     
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25"
              >
                Switch Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


