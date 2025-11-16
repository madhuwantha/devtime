import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { entity } from '../../../wailsjs/go/models';

const projectStatuses = [
  {
    value: 'active',
    label: 'Active'
  },
  {
    value: 'inactive',
    label: 'Inactive'
  },
  {
    value: 'completed',
    label: 'Completed'
  }
]

interface ProjectItemProps {
  project: entity.Project;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateProjectStatus: (projectId: string, status: string) => void
}

export const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  isExpanded,
  onToggleExpand,
  onUpdateProjectStatus,
}) => {
  return (
    <Card
      className={`
        group relative cursor-pointer
        ${isExpanded 
          ? 'ring-2 ring-cyan-400/50 bg-white/10 shadow-lg shadow-cyan-500/20' 
          : ''
        }
      `}
      onClick={onToggleExpand}
    >
      {/* Project Header */}
      <div className="px-2 py-1 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 mr-3">
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0
            ${isExpanded
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
              : 'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-300 group-hover:from-slate-500 group-hover:to-slate-600'
            }
          `}>
            {project.Name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className={`
              text-base font-medium transition-colors duration-300 truncate
              ${isExpanded ? 'text-cyan-300' : 'text-slate-100'}
            `}>
              {project.Name}
            </h3>
            <p className="text-slate-400 text-xs">ID: {project.ProjectId}</p>
          </div>
        </div>
        
        {/* Expand/Collapse Indicator */}
        <div className={`
          w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
          ${isExpanded 
            ? 'bg-cyan-500/20 text-cyan-400 rotate-180' 
            : 'bg-slate-600/50 text-slate-400 group-hover:bg-slate-500/50'
          }
        `}>
          <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-white/10 bg-gradient-to-r from-white/5 to-white/10">
          <div className="p-6 space-y-4">
            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-slate-300 font-medium text-sm uppercase tracking-wider">Project Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Name:</span>
                    <span className="text-slate-200 font-medium">{project.Name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ID:</span>
                    <span className="text-slate-200 font-mono text-sm">{project.ProjectId}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-slate-200 font-medium">{project.Status}</span>
                </div>                
              </div>
              
              <div className="space-y-3">
                <h4 className="text-slate-300 font-medium text-sm uppercase tracking-wider">Quick Actions</h4>
                <div className="flex gap-2">
                  {project.Status !== 'active' && <Button variant="primary" size="sm" className='cursor-pointer' onClick={() => onUpdateProjectStatus(project.ProjectId, 'active')}>Active</Button>}
                  {project.Status !== 'inactive' && <Button variant="primary" size="sm" className='cursor-pointer' onClick={() => onUpdateProjectStatus(project.ProjectId, 'inactive')}>Inactive</Button>}
                  {project.Status !== 'completed' && <Button variant="primary" size="sm" className='cursor-pointer' onClick={() => onUpdateProjectStatus(project.ProjectId, 'completed')}>Completed</Button>}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {/* <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button variant="success" className="flex-1">
                Start Working
              </Button>
              <Button variant="secondary" size="sm">
                Archive
              </Button>
            </div> */}
          </div>
        </div>
      )}
    </Card>
  );
};
