import React from 'react';
import { Select } from '../ui/Select';
import { entity } from '../../../wailsjs/go/models';

interface ProjectSelectorProps {
  projects: entity.Project[];
  selectedProjectId: string;
  onProjectChange: (projectId: string) => void;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  selectedProjectId,
  onProjectChange,
}) => {
  const projectOptions = projects.map(project => ({
    value: project.ProjectId,
    label: project.Name,
  }));

  return (
    <div className="flex items-center gap-3">
      <label className="text-slate-300 text-sm">Project</label>
      <Select
        value={selectedProjectId}
        onChange={(e) => onProjectChange(e.target.value)}
        options={projectOptions}
        placeholder="All Projects"
      />
    </div>
  );
};
