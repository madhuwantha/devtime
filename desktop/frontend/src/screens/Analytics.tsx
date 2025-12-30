import React, { useEffect, useMemo, useState } from 'react';
import { useStatHandler } from '../hooks/useStat';
import { Button } from '../components/ui/Button';

export default function Analytics() {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const { isLoading, todayTasks, onDateChange, summary } = useStatHandler();

  useEffect(() => {
    onDateChange(selectedDate);
  }, [selectedDate]);

  // Calculate timeline dimensions and task positions
  const timelineData = useMemo(() => {
    const pixelsPerMinute = 2; // 1 minute = 2px for better visibility
    
    if (!todayTasks || todayTasks.length === 0) {
      return {
        startHour: 0,
        endHour: 24,
        pixelsPerMinute,
        totalMinutes: 24 * 60,
        tasksWithPositions: []
      };
    }

    // Find the earliest start time and latest end time
    let minMinutes = Infinity;
    let maxMinutes = -Infinity;

    const tasksWithTimes = todayTasks.map((task) => {
      const startDate = task.StartTime ? new Date(String(task.StartTime)) : null;
      const endDate = task.EndTime ? new Date(String(task.EndTime)) : null;
      console.log("Start date:", startDate, task.StartTime);
      
      if (startDate) {
        const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
        minMinutes = Math.min(minMinutes, startMinutes);
        maxMinutes = Math.max(maxMinutes, startMinutes);
      }
      
      if (endDate) {
        const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();
        maxMinutes = Math.max(maxMinutes, endMinutes);
      }

      return {
        ...task,
        startDate,
        endDate,
        startMinutes: startDate ? startDate.getHours() * 60 + startDate.getMinutes() : null,
        endMinutes: endDate ? endDate.getHours() * 60 + endDate.getMinutes() : null,
      };
    });

    // Round to nearest hour for display, but keep full range
    const startHour = Math.floor(minMinutes / 60);
    const endHour = Math.ceil(maxMinutes / 60) + 1;
    const totalMinutes = (endHour - startHour) * 60;

    // Calculate positions (1 minute = 2px for better visibility)
    const tasksWithPositions = tasksWithTimes.map((task) => {
      if (!task.startMinutes && !task.endMinutes) {
        return { ...task, top: 0, height: 0 };
      }

      const startPos = task.startMinutes !== null 
        ? (task.startMinutes - startHour * 60) * pixelsPerMinute 
        : 0;
      
      const duration = task.endMinutes !== null && task.startMinutes !== null
        ? (task.endMinutes - task.startMinutes) * pixelsPerMinute
        : 30 * pixelsPerMinute; // Default 30 minutes if no end time

      return {
        ...task,
        top: startPos,
        height: Math.max(duration, 20), // Minimum height of 20px
      };
    });

    return {
      startHour,
      endHour,
      totalMinutes,
      pixelsPerMinute,
      tasksWithPositions,
    };
  }, [todayTasks]);

  // Generate time markers (every hour)
  const timeMarkers = useMemo(() => {
    const markers = [];
    for (let hour = timelineData.startHour; hour <= timelineData.endHour; hour++) {
      markers.push({
        hour,
        label: `${hour.toString().padStart(2, '0')}:00`,
        position: (hour - timelineData.startHour) * 60 * timelineData.pixelsPerMinute,
      });
    }
    return markers;
  }, [timelineData.startHour, timelineData.endHour, timelineData.pixelsPerMinute]);

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="text-center">    
      <div className="flex flex-row items-center justify-center gap-3 mb-1"> 
        <Button onClick={handlePreviousDay} variant="secondary" size="sm">←</Button>
        
        <div className="relative">
          <input
            type="date"
            value={formatDateForInput(selectedDate)}
            onChange={handleDatePickerChange}
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          />
        </div>
        
        <Button onClick={handleToday} variant="secondary" size="sm">Today</Button>
        <Button onClick={handleNextDay} variant="secondary" size="sm">→</Button>
      </div>

      
      {isLoading ? (
        <div className="text-slate-400">Loading...</div>
      ) : todayTasks.length === 0 ? (
        <div className="text-slate-400 mt-8">No tasks for today</div>
      ) : (
        <div className="max-w-5xl mx-auto px-2">
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-1 border border-slate-700/50 shadow-xl">
            {/* Timeline container */}
            <div className="relative" style={{ minHeight: `${(timelineData.endHour - timelineData.startHour) * 62 * timelineData.pixelsPerMinute}px` }}>
              {/* Time markers on the left */}
              <div className="absolute left-0 top-0 bottom-0 w-16">
                {timeMarkers.map((marker, index) => (
                  <div
                    key={marker.hour}
                    className="absolute left-0 text-xs font-medium text-cyan-400/80"
                    style={{ top: `${marker.position}px` }}
                  >
                    {marker.label}
                    {index < timeMarkers.length - 1 && (
                      <div 
                        className="absolute left-12 w-3 border-t border-cyan-500/30"
                        style={{ top: '6px' }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Vertical timeline line with gradient */}
              <div 
                className="absolute left-20 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500 shadow-lg shadow-cyan-500/50"
              />

              {/* Task blocks */}
              <div className="ml-28 relative">
                {timelineData.tasksWithPositions.map((task, index) => {
                  if (!task.startDate || task.height === 0) return null;

                  const startTime = task.startDate.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });
                  const endTime = task.endDate ? task.endDate.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) : '';

                  const isIdle = task.IsIdle === true;
                  
                  // Rich color schemes with gradients
                  const bgColor = isIdle 
                    ? 'bg-gradient-to-r from-amber-900/70 via-orange-900/60 to-amber-800/70 border-amber-600/50 hover:from-amber-800/80 hover:via-orange-800/70 hover:to-amber-700/80 shadow-md shadow-amber-900/30' 
                    : 'bg-gradient-to-r from-blue-600/80 via-cyan-600/70 to-teal-600/80 border-cyan-500/50 hover:from-blue-500/90 hover:via-cyan-500/80 hover:to-teal-500/90 shadow-md shadow-cyan-500/30';
                  const textColor = isIdle 
                    ? 'text-amber-100' 
                    : 'text-white';
                  const projectColor = isIdle 
                    ? 'text-amber-200/90' 
                    : 'text-cyan-100/90';
                  const timeColor = isIdle 
                    ? 'text-amber-300/80' 
                    : 'text-cyan-200/80';

                  return (
                    <div
                      key={`${task.TaskName}-${index}`}
                      className={`absolute left-0 right-0 ${bgColor} border rounded-lg p-1.5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg`}
                      style={{
                        top: `${task.top}px`,
                        height: `${task.height}px`,
                        minHeight: '32px',
                      }}
                    >
                      <div className="flex items-center gap-1.5 flex-wrap h-full">
                        <h4 className={`text-xs font-semibold ${textColor} break-words leading-tight`}>
                          {task.TaskName}
                        </h4>
                        <span className={`text-[10px] ${projectColor} break-words leading-tight`}>
                          ({task.ProjectName})
                        </span>
                        <span className={`text-[10px] ${timeColor} font-medium ml-auto`}>
                          {startTime} {endTime && `- ${endTime}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}