import React from 'react';
import { Transition } from 'react-transition-group';
import { Logo } from './Logo';
import { WorkControls } from './WorkControls';
import { StatusIndicator } from './StatusIndicator';
import { Button } from '../ui/Button';

interface HeaderProps {
  isVisible: boolean;
  isWorking: boolean;
  isPaused: boolean;
  time: string;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onExpand?: () => void;
  size?: 'minimized' | 'full';
}

export const Header: React.FC<HeaderProps> = ({
  isVisible,
  isWorking,
  isPaused,
  time,
  onStart,
  onStop,
  onPause,
  onResume,
  onExpand,
  size = 'full'
}) => {
  if (size === 'minimized') {
    return (
      <Transition in={isVisible} timeout={300} mountOnEnter unmountOnExit>
        {(state: string) => (
          <header className={`relative z-20 bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-lg transition-all duration-300 ease-in-out ${
            state === 'entering' ? 'opacity-0 transform -translate-y-4' : 
            state === 'exiting' ? 'opacity-0 transform -translate-y-4' : 
            'opacity-100 transform translate-y-0'
          }`}>
            <div className="px-6 py-2">
              <div className="flex items-center justify-between">
                <Logo size="sm" showTime={true} time={time} />
                
                <div className="flex items-center gap-3">
                  <WorkControls
                    isWorking={isWorking}
                    isPaused={isPaused}
                    onStart={onStart}
                    onStop={onStop}
                    onPause={onPause}
                    onResume={onResume}
                    size="sm"
                  />
                  
                  {/* {onExpand && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onExpand}
                      className="w-10 h-10 p-0"
                      title="Show full header"
                    >
                      <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </Button>
                  )} */}
                </div>
              </div>
            </div>
          </header>
        )}
      </Transition>
    );
  }

  return (
    <Transition in={isVisible} timeout={400} mountOnEnter unmountOnExit>
      {(state: string) => (
        <header className={`relative overflow-hidden transition-all duration-400 ease-in-out ${
          state === 'entering' ? 'opacity-0 transform translate-y-4' : 
          state === 'exiting' ? 'opacity-0 transform translate-y-4' : 
          'opacity-100 transform translate-y-0'
        }`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="relative z-10 px-6 py-8 lg:px-12 lg:py-12">
            <div className="max-w-7xl mx-auto">
              {/* Logo and Title */}
              <div className="text-center mb-8">
                <Logo size="lg" />
              </div>

              {/* Work Controls */}
              <div className="mb-8">
                <WorkControls
                  isWorking={isWorking}
                  isPaused={isPaused}
                  onStart={onStart}
                  onStop={onStop}
                  onPause={onPause}
                  onResume={onResume}
                  size="lg"
                />
              </div>

              {/* Status Indicator */}
              <StatusIndicator isWorking={isWorking} time={time} />
            </div>
          </div>
        </header>
      )}
    </Transition>
  );
};
