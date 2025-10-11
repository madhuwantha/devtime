import { useEffect, useState } from "react";
import { useMyTaskList } from "../hooks/useMyTaskList";
import { StartTask, StopTask, GetProjects } from "../../wailsjs/go/main/App";
import { entity } from "../../wailsjs/go/models";
import { EventsOn } from "../../wailsjs/runtime/runtime";

// Direct call to Go function for CreateTask
const CreateTask = (name: string, projectId: string): Promise<void> => {
  return (window as any).go.main.App.CreateTask(name, projectId);
};

export default function MyTask() {
  const [time, setTime] = useState("00:00:01");
  const [taskTimeMap, setTaskTimeMap] = useState<Map<string, string>>(new Map());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [startingTask, setStartingTask] = useState<entity.Task|null>(null);
  const { tasks, activeTask, setActiveTask, getTasks } = useMyTaskList();
  const [confirmation, setConfirmation] = useState(false);
  const [projects, setProjects] = useState<entity.Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  useEffect(() => {
    GetProjects()
      .then((projects) => setProjects(projects))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  useEffect(() => {
    if(selectedProjectId){
      getTasks(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim() || !selectedProjectId) {
      return;
    }

    setIsCreatingTask(true);
    try {
      await CreateTask(newTaskName.trim(), selectedProjectId);
      setNewTaskName("");
      setShowAddTask(false);
      getTasks(selectedProjectId); // Refresh tasks
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsCreatingTask(false);
    }
  };

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

  useEffect(()=> {
    console.log(taskTimeMap);
  }, [taskTimeMap])

  const start = (task: entity.Task) => {
    StartTask(task.ProjectId, task.TaskId)
      .then((response) => {
        console.log("Task started successfully:", response);
        setActiveTask(previous => {          
          return previous = task;
        })
        EventsOn(`tasktimer:update:${task.TaskId}`, (data: string) => {
          setTaskTimeMap((prev) => {
            const updatedMap = new Map(prev); // ✅ Create a new Map instance
            updatedMap.set(task.TaskId, data);
            return updatedMap;
          });
        });

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

  const displayedTasks = selectedProjectId
    ? tasks.filter((t) => t.ProjectId === selectedProjectId)
    : tasks;

  if (!tasks || tasks.length === 0) {
    return (
      <div className="space-y-4">
        {/* Project Selection and Add Task Button */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <label className="text-slate-300 text-sm">Project</label>
            <div className="relative">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="appearance-none px-3 pr-8 py-2 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm text-slate-200 rounded-xl text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="">All Projects</option>
                {projects.map((p) => (
                  <option key={p.ProjectId} value={p.ProjectId}>
                    {p.Name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Add Task Button - Only show when project is selected */}
          {selectedProjectId && (
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Add Task
            </button>
          )}
        </div>

        {/* Inline Task Creation Form */}
        {showAddTask && selectedProjectId && (
          <div className="mb-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
            <form onSubmit={handleCreateTask} className="flex items-center gap-3">
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Enter task name"
                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm text-slate-200 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-slate-500"
                required
                autoFocus
              />
              <button
                type="submit"
                disabled={isCreatingTask || !newTaskName.trim()}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isCreatingTask ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Adding...
                  </div>
                ) : (
                  "Add"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddTask(false);
                  setNewTaskName("");
                }}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* No Tasks Message */}
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-slate-500 to-slate-600 rounded-2xl mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h3 className="text-2xl font-semibold text-slate-200 mb-2">No Tasks Found</h3>
          <p className="text-slate-400 mb-6">
            {selectedProjectId 
              ? "Start by creating your first task for this project" 
              : "Select a project to create tasks"
            }
          </p>
          {!selectedProjectId && (
            <p className="text-slate-500 text-sm">Choose a project from the dropdown above to get started</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Header */}
      {/* <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-1">My Tasks</h2>
          <p className="text-slate-400">Manage and track your development tasks</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25 flex items-center gap-2">
          <span className="text-lg">+</span>
          New Task
        </button>
      </div> */}

      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <label className="text-slate-300 text-sm">Project</label>
          <div className="relative">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="appearance-none px-3 pr-8 py-2 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm text-slate-200 rounded-xl text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.ProjectId} value={p.ProjectId}>
                  {p.Name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Add Task Button - Only show when project is selected */}
        {selectedProjectId && (
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25 flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Add Task
          </button>
        )}
      </div>

      {/* Inline Task Creation Form */}
      {showAddTask && selectedProjectId && (
        <div className="mb-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
          <form onSubmit={handleCreateTask} className="flex items-center gap-3">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Enter task name"
              className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm text-slate-200 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-slate-500"
              required
              autoFocus
            />
            <button
              type="submit"
              disabled={isCreatingTask || !newTaskName.trim()}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isCreatingTask ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Adding...
                </div>
              ) : (
                "Add"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddTask(false);
                setNewTaskName("");
              }}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

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
      <div className="space-y-1">
        {displayedTasks.map((task) => (
          <div
            key={task.TaskId}
            className={`
              group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer
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
            {/* Task Header - Minimal */}
            <div className="px-2 py-1 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 mr-3">
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0
                  ${activeTask && activeTask.TaskId === task.TaskId
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                    : expandedId === task.TaskId
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                    : 'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-300 group-hover:from-slate-500 group-hover:to-slate-600'
                  }
                `}>
                  {task.Name.charAt(0).toUpperCase()}
                </div>
                <h3 className={`
                  text-base font-medium transition-colors duration-300 truncate
                  ${activeTask && activeTask.TaskId === task.TaskId 
                    ? 'text-emerald-300' 
                    : expandedId === task.TaskId 
                    ? 'text-cyan-300' 
                    : 'text-slate-100'
                  }
                `}>
                  {task.Name}                  
                </h3>
                {taskTimeMap && taskTimeMap.get(task.TaskId) && <h2 className='relative group px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 active:scale-95'>{taskTimeMap.get(task.TaskId)}</h2>}
              </div>
              
              {/* Action Button */}
              {activeTask && activeTask.TaskId === task.TaskId ? (
                <button
                  className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg text-xs font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-rose-500/25 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    stopTask();
                  }}
                >
                  Stop
                </button>
              ) : (
                <button
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-xs font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    startTaskHandle(task);
                  }}
                >
                  Start
                </button>
              )}
            </div>

            {/* Expanded Content */}
            {expandedId === task.TaskId && (
              <div className="border-t border-white/10 bg-gradient-to-r from-white/5 to-white/10">
                <div className="p-4 space-y-3">
                  {/* Task Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-slate-300 font-medium text-xs uppercase tracking-wider">Task Information</h4>
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Name:</span>
                          <span className="text-slate-200 font-medium text-sm">{task.Name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Task ID:</span>
                          <span className="text-slate-200 font-mono text-xs">{task.TaskId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Project ID:</span>
                          <span className="text-slate-200 font-mono text-xs">{task.ProjectId}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-slate-300 font-medium text-xs uppercase tracking-wider">Quick Actions</h4>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-xs font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                          Edit
                        </button>
                        <button className="px-3 py-1.5 bg-gradient-to-r from-slate-600 to-slate-700 text-slate-200 rounded-lg text-xs font-medium hover:from-slate-500 hover:to-slate-600 transition-all duration-300 transform hover:scale-105">
                          View Project
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-white/10">
                    {activeTask && activeTask.TaskId === task.TaskId ? (
                      <button 
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-rose-500/25"
                        onClick={() => stopTask()}
                      >
                        Stop Task
                      </button>
                    ) : (
                      <button 
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25"
                        onClick={() => startTaskHandle(task)}
                      >
                        Start Task
                      </button>
                    )}
                    <button className="px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-slate-200 rounded-lg text-sm font-medium hover:from-slate-500 hover:to-slate-600 transition-all duration-300 transform hover:scale-105">
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


