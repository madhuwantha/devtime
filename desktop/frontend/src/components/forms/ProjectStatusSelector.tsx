import React from 'react';
import { Select } from '../ui/Select';

interface ProjectStatusSelectorProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export const ProjectStatusSelector: React.FC<ProjectStatusSelectorProps> = ({
  selectedStatus,
  onStatusChange,
}) => {
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="flex items-center gap-3">
      <label className="text-slate-300 text-sm">Project</label>
      <Select
          value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        options={statusOptions}
        placeholder="All Statuses"
      />
    </div>
  );
};
