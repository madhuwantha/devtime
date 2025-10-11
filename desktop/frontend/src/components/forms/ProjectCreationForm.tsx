import React from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ProjectCreationFormProps {
  formData: {
    name: string;
    code: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isCreating: boolean;
}

export const ProjectCreationForm: React.FC<ProjectCreationFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  isCreating,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-slate-300 text-sm font-medium mb-2">
          Project Name
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          placeholder="Enter project name"
          required
        />
      </div>
      
      <div>
        <label htmlFor="code" className="block text-slate-300 text-sm font-medium mb-2">
          Project Code
        </label>
        <Input
          id="code"
          name="code"
          value={formData.code}
          onChange={onInputChange}
          placeholder="Enter project code (e.g., DEV, WEB, API)"
          required
        />
      </div>
      
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="success"
          disabled={isCreating || !formData.name.trim() || !formData.code.trim()}
          loading={isCreating}
          className="flex-1"
        >
          Create Project
        </Button>
      </div>
    </form>
  );
};
