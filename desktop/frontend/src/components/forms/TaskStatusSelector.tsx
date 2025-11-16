import React from 'react';
import { Select } from '../ui/Select';

interface TaskStatusSelectorProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export const TaskStatusSelector: React.FC<TaskStatusSelectorProps> = ({
  selectedStatus,
  onStatusChange,
}) => {
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
  ];    

  return (
    <div className="flex items-center gap-3">
      <label className="text-slate-300 text-sm">Status</label>
      <Select
          value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        options={statusOptions}
        placeholder="All Statuses"
      />
    </div>
  );
};
