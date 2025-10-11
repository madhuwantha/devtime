import React from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface TaskCreationFormProps {
  taskName: string;
  onTaskNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isCreating: boolean;
}

export const TaskCreationForm: React.FC<TaskCreationFormProps> = ({
  taskName,
  onTaskNameChange,
  onSubmit,
  onCancel,
  isCreating,
}) => {
  return (
    <div className="mb-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
      <form onSubmit={onSubmit} className="flex items-center gap-3">
        <Input
          value={taskName}
          onChange={onTaskNameChange}
          placeholder="Enter task name"
          required
          autoFocus
          className="flex-1"
        />
        <Button
          type="submit"
          variant="success"
          size="sm"
          disabled={isCreating || !taskName.trim()}
          loading={isCreating}
        >
          Add
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};
