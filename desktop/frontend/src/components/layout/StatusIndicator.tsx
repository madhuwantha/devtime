import React from 'react';

interface StatusIndicatorProps {
  isWorking: boolean;
  time?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  isWorking,
  time = "00:00:00"
}) => {
  return (
    <div className="flex justify-center">
      <div className={`
        flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-sm border
        ${isWorking 
          ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300' 
          : 'bg-slate-500/20 border-slate-400/30 text-slate-300'
        }
      `}>
        <div className={`
          w-3 h-3 rounded-full animate-pulse
          ${isWorking ? 'bg-emerald-400' : 'bg-slate-400'}
        `}></div>
        <span className="text-sm font-medium">
          {isWorking ? 'Currently Working' : 'Not Working'}
        </span>
        {time !== "00:00:00" && (
          <span className="px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 active:scale-95">
            {time}
          </span>
        )}
      </div>
    </div>
  );
};
