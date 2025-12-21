import React, { useMemo } from 'react';
import { useStatHandler } from '../hooks/useStat';

export default function Analytics() {

  const { isLoading, todayTasks } = useStatHandler();

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
      const startDate = task.StartTime ? new Date(task.StartTime) : null;
      const endDate = task.EndTime ? new Date(task.EndTime) : null;
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

  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📊</div>
      <h3 className="text-2xl font-semibold text-slate-200 mb-2">Analytics</h3>
      
      {isLoading ? (
        <div className="text-slate-400">Loading...</div>
      ) : todayTasks.length === 0 ? (
        <div className="text-slate-400 mt-8">No tasks for today</div>
      ) : (
        <div className="max-w-5xl mx-auto mt-8 px-4">
          <div className="relative bg-slate-800 rounded-lg p-6 border border-slate-700">
            {/* Timeline container */}
            <div className="relative" style={{ minHeight: `${(timelineData.endHour - timelineData.startHour) * 60 * timelineData.pixelsPerMinute}px` }}>
              {/* Time markers on the left */}
              <div className="absolute left-0 top-0 bottom-0 w-20">
                {timeMarkers.map((marker, index) => (
                  <div
                    key={marker.hour}
                    className="absolute left-0 text-xs text-slate-400"
                    style={{ top: `${marker.position}px` }}
                  >
                    {marker.label}
                    {index < timeMarkers.length - 1 && (
                      <div 
                        className="absolute left-16 w-4 border-t border-slate-600"
                        style={{ top: '6px' }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Vertical timeline line */}
              <div 
                className="absolute left-24 top-0 bottom-0 w-0.5 bg-slate-600"
              />

              {/* Task blocks */}
              <div className="ml-32 relative">
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

                  return (
                    <div
                      key={`${task.TaskName}-${index}`}
                      className="absolute left-0 right-0 bg-slate-700 border border-slate-600 rounded p-2 hover:bg-slate-600 transition-colors"
                      style={{
                        top: `${task.top}px`,
                        height: `${task.height}px`,
                        minHeight: '40px',
                      }}
                    >
                      <div className="flex flex-col h-full justify-center">
                        <h4 className="text-sm font-semibold text-slate-200 truncate">
                          {task.TaskName}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">
                          {task.ProjectName}
                        </p>
                        <div className="text-xs text-slate-500 mt-1">
                          {startTime} {endTime && `- ${endTime}`}
                        </div>
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