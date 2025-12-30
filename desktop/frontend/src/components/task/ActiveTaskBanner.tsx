import React from 'react';
import { Button } from '../ui/Button';
import { entity } from '../../../wailsjs/go/models';

interface ActiveTaskBannerProps {
  activeTask: entity.Task;
  onStop: () => void;
}

export const ActiveTaskBanner: React.FC<ActiveTaskBannerProps> = ({
  activeTask,
  onStop,
}) => {
  return (
    <div className="p-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 rounded-1xl backdrop-blur-sm">
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
        <Button
          variant="danger"
          onClick={onStop}
        >
          Stop Task
        </Button>
      </div>
    </div>
  );
};
