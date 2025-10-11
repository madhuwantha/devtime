import React from 'react';

interface LogoProps {
  size?: 'sm' | 'lg';
  showTime?: boolean;
  time?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'lg', 
  showTime = false, 
  time = "00:00:00" 
}) => {
  const sizeClasses = {
    sm: {
      container: 'w-12 h-12',
      icon: 'text-xl',
      title: 'text-2xl'
    },
    lg: {
      container: 'w-20 h-20',
      icon: 'text-3xl',
      title: 'text-4xl lg:text-6xl'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-4">
      <div className={`${currentSize.container} bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25`}>
        <span className={currentSize.icon}>⏱️</span>
      </div>
      <div>
        <h1 className={`${currentSize.title} font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent`}>
          Dev Time
        </h1>
        {size === 'lg' && (
          <p className="text-slate-300 text-lg mt-2">Track your development journey</p>
        )}
      </div>
      {showTime && time !== "00:00:00" && (
        <span className="px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 active:scale-95">
          {time}
        </span>
      )}
    </div>
  );
};
