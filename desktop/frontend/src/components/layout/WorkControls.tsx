import React from 'react';
import { Button } from '../ui/Button';

interface WorkControlsProps {
  isWorking: boolean;
  isPaused: boolean;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  size?: 'sm' | 'lg';
}

export const WorkControls: React.FC<WorkControlsProps> = ({
  isWorking,
  isPaused,
  onStart,
  onStop,
  onPause,
  onResume,
  size = 'lg'
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    lg: 'px-8 py-4 text-lg'
  };

  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';

  return (
    <div className={`flex ${size === 'lg' ? 'flex-col sm:flex-row' : ''} items-center justify-center gap-4`}>
      {/* Start Button */}
      {!isWorking && !isPaused && (
        <Button
          variant="success"
          onClick={onStart}
          disabled={isWorking}
          className={sizeClasses[size]}
        >
          <span className="flex items-center gap-2">
            <div className={`${dotSize} rounded-full bg-white`}></div>
            {size === 'lg' ? 'Start Working' : 'Start'}
          </span>
        </Button>
      )}

      {/* Pause Button */}
      {isWorking && !isPaused && (
        <Button
          variant="primary"
          onClick={onPause}
          className={sizeClasses[size]}
        >
          <span className="flex items-center gap-2">
            <div className={`${dotSize} rounded-full bg-white`}></div>
            Pause
          </span>
        </Button>
      )}

      {/* Resume Button */}
      {isPaused && (
        <Button
          variant="success"
          onClick={onResume}
          className={sizeClasses[size]}
        >
          <span className="flex items-center gap-2">
            <div className={`${dotSize} rounded-full bg-white`}></div>
            Resume
          </span>
        </Button>
      )}

      {/* Stop Button */}
      {isWorking && !isPaused && (
        <Button
          variant="danger"
          onClick={onStop}
          disabled={!isWorking}
          className={sizeClasses[size]}
        >
          <span className="flex items-center gap-2">
            <div className={`${dotSize} rounded-full bg-white`}></div>
            {size === 'lg' ? 'Stop Working' : 'Stop'}
          </span>
        </Button>
      )}
    </div>
  );
};
