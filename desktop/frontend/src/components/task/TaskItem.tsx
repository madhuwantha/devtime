import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { entity } from '../../../wailsjs/go/models';

interface TaskItemProps {
  task: entity.Task;
  isExpanded: boolean;
  isActive: boolean;
  taskTime?: string;
  onToggleExpand: () => void;
  onStart: () => void;
  onStop: () => void;
  onUpdateTaskStatus: (taskId: string, status: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isExpanded,
  isActive,
  taskTime,
  onToggleExpand,
  onStart,
  onStop,
  onUpdateTaskStatus,
}) => {
  return (
    <Card
      className={`
        group relative cursor-pointer
        ${isExpanded 
          ? 'ring-2 ring-cyan-400/50 bg-white/10 shadow-lg shadow-cyan-500/20' 
          : ''
        }
        ${isActive ? 'ring-2 ring-emerald-400/50 bg-emerald-500/10' : ''}
      `}
      onClick={onToggleExpand}
    >
      {/* Task Header */}
      <div className="px-2 py-1 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 mr-3">
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0
            ${isActive
              ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
              : isExpanded
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
              : 'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-300 group-hover:from-slate-500 group-hover:to-slate-600'
            }
          `}>
            {task.Name.charAt(0).toUpperCase()}
          </div>
          <h3 className={`
            text-base font-medium transition-colors duration-300 truncate
            ${isActive 
              ? 'text-emerald-300' 
              : isExpanded 
              ? 'text-cyan-300' 
              : 'text-slate-100'
            }
          `}>
            {task.Name}
          </h3>
          {taskTime && (
            <span className="text-slate-400 text-sm font-mono">
              {taskTime}
            </span>
          )}
        </div>
        
        {/* Action Button */}
        {isActive ? (
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onStop();
            }}
          >
            Stop
          </Button>
        ) : (
          <Button
            variant="success"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
          >
            Start
          </Button>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
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
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Status:</span>
                    <span className="text-slate-200 font-medium text-sm">{task.Status}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-slate-300 font-medium text-xs uppercase tracking-wider">Quick Actions</h4>
                <div className="flex gap-2">
                  {task.Status !== 'completed' && <Button variant="primary" size="sm" className='cursor-pointer' onClick={() => onUpdateTaskStatus(task.TaskId, 'completed')}>Completed</Button>}
                  {task.Status !== 'in_progress' && <Button variant="primary" size="sm" className='cursor-pointer' onClick={() => onUpdateTaskStatus(task.TaskId, 'in_progress')}>In Progress</Button>}
                  {task.Status !== 'on_hold' && <Button variant="primary" size="sm" className='cursor-pointer' onClick={() => onUpdateTaskStatus(task.TaskId, 'on_hold')}>On Hold</Button>}
                  {task.Status !== 'pending' && <Button variant="primary" size="sm" className='cursor-pointer' onClick={() => onUpdateTaskStatus(task.TaskId, 'pending')}>Pending</Button>}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3 border-t border-white/10">
              {isActive ? (
                <Button 
                  variant="danger"
                  onClick={onStop}
                  className="flex-1"
                >
                  Stop Task
                </Button>
              ) : (
                <Button 
                  variant="success"
                  onClick={onStart}
                  className="flex-1"
                >
                  Start Task
                </Button>
              )}
              <Button variant="secondary" size="sm">
                Archive
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
