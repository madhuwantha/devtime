import { useEffect, useState } from "react";
import { useMyTaskList } from "../hooks/useMyTaskList";
import { StartTask, StopTask, GetProjects } from "../../wailsjs/go/main/App";
import { entity } from "../../wailsjs/go/models";
import { EventsOn } from "../../wailsjs/runtime/runtime";
import {
  ProjectSelector,
  TaskCreationForm,
  TaskItem,
  ActiveTaskBanner,
  ConfirmationModal,
  Button
} from "../components";

// Direct call to Go function for CreateTask
const CreateTask = (name: string, projectId: string): Promise<void> => {
  return (window as any).go.main.App.CreateTask(name, projectId);
};

export default function MyTask() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [startingTask, setStartingTask] = useState<entity.Task | null>(null);
  const { tasks, activeTask, setActiveTask, getTasks } = useMyTaskList();
  const [confirmation, setConfirmation] = useState(false);
  const [projects, setProjects] = useState<entity.Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskTimeMap, setTaskTimeMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    GetProjects()
      .then((projects) => setProjects(projects))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
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
      getTasks(selectedProjectId);
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
  };

  const stopCurrentAndStartNewTask = (task: entity.Task) => {
    stopTask().then((response) => {
      if (response) {
        start(task);
      }
    });
  };

  const start = (task: entity.Task) => {
    StartTask(task.ProjectId, task.TaskId)
      .then((response) => {
        console.log("Task started successfully:", response);
        setActiveTask(previous => {
          return previous = task;
        });
        EventsOn(`tasktimer:update:${task.TaskId}`, (data: string) => {
          setTaskTimeMap((prev) => {
            const updatedMap = new Map(prev);
            updatedMap.set(task.TaskId, data);
            return updatedMap;
          });
        });
      })
      .catch((error) => {
        console.error("Error starting task:", error);
      })
      .finally(() => {
        setStartingTask(null);
      });
  };

  const stopTask = async () => {
    return await new Promise((resolve) => {
      StopTask()
        .then((response) => {
          console.log("Task stopped successfully:", response);
          setActiveTask(previous => {
            return null;
          });
          resolve(true);
        })
        .catch((error) => {
          console.error("Error stopping task:", error);
          resolve(false);
        });
    });
  };

  const displayedTasks = selectedProjectId
    ? tasks.filter((t) => t.ProjectId === selectedProjectId)
    : tasks;

  const renderEmptyState = () => (
    <div className="space-y-4">
      {/* Project Selection and Add Task Button */}
      <div className="flex items-center justify-between mb-1">
        <ProjectSelector
          projects={projects}
          selectedProjectId={selectedProjectId}
          onProjectChange={setSelectedProjectId}
        />
        
        {selectedProjectId && (
          <Button
            variant="success"
            size="sm"
            onClick={() => setShowAddTask(!showAddTask)}
          >
            <span className="text-lg">+</span>
            Add Task
          </Button>
        )}
      </div>

      {/* Inline Task Creation Form */}
      {showAddTask && selectedProjectId && (
        <TaskCreationForm
          taskName={newTaskName}
          onTaskNameChange={(e) => setNewTaskName(e.target.value)}
          onSubmit={handleCreateTask}
          onCancel={() => {
            setShowAddTask(false);
            setNewTaskName("");
          }}
          isCreating={isCreatingTask}
        />
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

  if (!tasks || tasks.length === 0) {
    return renderEmptyState();
  }

  return (
    <div className="space-y-1">
      {/* Project Selection and Add Task Button */}
      <div className="flex items-center justify-between mb-1">
        <ProjectSelector
          projects={projects}
          selectedProjectId={selectedProjectId}
          onProjectChange={setSelectedProjectId}
        />
        
        {selectedProjectId && (
          <Button
            variant="success"
            size="sm"
            onClick={() => setShowAddTask(!showAddTask)}
          >
            <span className="text-lg">+</span>
            Add Task
          </Button>
        )}
      </div>

      {/* Inline Task Creation Form */}
      {showAddTask && selectedProjectId && (
        <TaskCreationForm
          taskName={newTaskName}
          onTaskNameChange={(e) => setNewTaskName(e.target.value)}
          onSubmit={handleCreateTask}
          onCancel={() => {
            setShowAddTask(false);
            setNewTaskName("");
          }}
          isCreating={isCreatingTask}
        />
      )}

      {/* Active Task Banner */}
      {activeTask && (
        <ActiveTaskBanner
          activeTask={activeTask}
          onStop={stopTask}
        />
      )}

      {/* Tasks List */}
      <div className="space-y-1">
        {displayedTasks.map((task) => (
          <TaskItem
            key={task.TaskId}
            task={task}
            isExpanded={expandedId === task.TaskId}
            isActive={activeTask?.TaskId === task.TaskId}
            taskTime={taskTimeMap.get(task.TaskId)}
            onToggleExpand={() =>
              setExpandedId(expandedId === task.TaskId ? null : task.TaskId)
            }
            onStart={() => startTaskHandle(task)}
            onStop={stopTask}
          />
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
      <ConfirmationModal
        isOpen={confirmation}
        onClose={() => setConfirmation(false)}
        onConfirm={() => {
          setConfirmation(false);
          if (startingTask) {
            stopCurrentAndStartNewTask(startingTask);
          }
        }}
        title="Task Switch Confirmation"
        message={`You are currently working on ${activeTask?.Name}. To start ${startingTask?.Name}, the current task will be stopped.`}
        confirmText="Switch Task"
        variant="warning"
      />
    </div>
  );
}