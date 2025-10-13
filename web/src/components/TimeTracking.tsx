import React, { useState, useEffect } from 'react';
import { timeTrackingApi, projectApi, taskApi } from '../services/api';
import { DevTimeStartLogRequest, DevTimeStopLogRequest, Project, Task } from '../types';

const TimeTracking: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [currentTask, setCurrentTask] = useState<{ project: string; task: string } | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeForm, setTimeForm] = useState({
    project: '',
    task: '',
    username: ''
  });

  // Mock user ID - in a real app, this would come from authentication
  const userId = '507f1f77bcf86cd799439011';

  useEffect(() => {
    fetchData();
    // Set default username
    setTimeForm(prev => ({ ...prev, username: 'user@example.com' }));
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsData, tasksData] = await Promise.all([
        projectApi.getUserProjects(userId),
        taskApi.getUserTasks(userId)
      ]);
      setProjects(projectsData);
      setTasks(tasksData);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const startRequest: DevTimeStartLogRequest = {
        project: timeForm.project,
        task: timeForm.task,
        username: timeForm.username
      };

      await timeTrackingApi.startTask(startRequest);
      setIsTracking(true);
      setCurrentTask({ project: timeForm.project, task: timeForm.task });
      setStartTime(new Date());
      setSuccess('Time tracking started successfully!');
      setError(null);
    } catch (err) {
      setError('Failed to start time tracking');
      setSuccess(null);
      console.error('Error starting time tracking:', err);
    }
  };

  const handleStopTracking = async () => {
    try {
      const stopRequest: DevTimeStopLogRequest = {
        username: timeForm.username
      };

      await timeTrackingApi.stopTask(stopRequest);
      setIsTracking(false);
      setCurrentTask(null);
      setStartTime(null);
      setSuccess('Time tracking stopped successfully!');
      setError(null);
    } catch (err) {
      setError('Failed to stop time tracking');
      setSuccess(null);
      console.error('Error stopping time tracking:', err);
    }
  };

  const formatDuration = (start: Date) => {
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getTaskName = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.name : 'Unknown Task';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Time Tracking</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track your time on projects and tasks.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>{success}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Tracking Status */}
      {isTracking && currentTask && startTime && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-blue-900">Currently Tracking</h3>
              <p className="text-sm text-blue-700">
                Project: {getProjectName(currentTask.project)}
              </p>
              <p className="text-sm text-blue-700">
                Task: {getTaskName(currentTask.task)}
              </p>
              <p className="text-sm text-blue-700">
                Started: {startTime.toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono font-bold text-blue-900">
                {formatDuration(startTime)}
              </div>
              <button
                onClick={handleStopTracking}
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Stop Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time Tracking Form */}
      {!isTracking && (
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Start Time Tracking</h3>
          <form onSubmit={handleStartTracking} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={timeForm.username}
                onChange={(e) => setTimeForm({ ...timeForm, username: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-700">
                Project
              </label>
              <select
                id="project"
                value={timeForm.project}
                onChange={(e) => setTimeForm({ ...timeForm, project: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="task" className="block text-sm font-medium text-gray-700">
                Task
              </label>
              <select
                id="task"
                value={timeForm.task}
                onChange={(e) => setTimeForm({ ...timeForm, task: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Select a task</option>
                {tasks
                  .filter(task => task.projectId === timeForm.project)
                  .map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start Tracking
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Projects</dt>
                  <dd className="text-lg font-medium text-gray-900">{projects.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Tasks</dt>
                  <dd className="text-lg font-medium text-gray-900">{tasks.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Status</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {isTracking ? 'Tracking' : 'Idle'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;