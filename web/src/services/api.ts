import axios from 'axios';
import { 
  UserInfo, 
  Project, 
  Task, 
  DevTimeStartLogRequest, 
  DevTimeStopLogRequest,
  ApiResponse 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API
export const userApi = {
  createUser: async (userInfo: UserInfo): Promise<ApiResponse> => {
    const response = await api.post('/api/users/', userInfo);
    return response.data;
  },

  getAllUsers: async (): Promise<UserInfo[]> => {
    const response = await api.get('/api/users/');
    return response.data;
  },

  getUser: async (userId: string): Promise<UserInfo> => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },
};

// Project API
export const projectApi = {
  createProject: async (project: Project, userId: string): Promise<ApiResponse> => {
    const response = await api.post('/api/projects/', {
      name: project.name,
      code: project.code,
      userId: userId
    });
    return response.data;
  },

  getProject: async (projectId: string): Promise<Project> => {
    const response = await api.get(`/api/projects/${projectId}`);
    return response.data;
  },

  addUserToProject: async (
    projectId: string, 
    userId: string, 
    role?: string
  ): Promise<ApiResponse> => {
    const response = await api.post(`/api/projects/${projectId}/users`, {
      userId,
      role: role || 'MEMBER'
    });
    return response.data;
  },

  getProjectUsers: async (projectId: string): Promise<any[]> => {
    const response = await api.get(`/api/projects/${projectId}/users`);
    return response.data;
  },

  getUserProjects: async (userId: string): Promise<Project[]> => {
    const response = await api.get(`/api/users/${userId}/projects`);
    return response.data;
  },

  getAllProjects: async (): Promise<Project[]> => {
    const response = await api.get('/api/projects/');
    return response.data;
  },
};

// Task API
export const taskApi = {
  createTask: async (task: Task, projectId: string): Promise<ApiResponse> => {
    const response = await api.post('/api/tasks/', {
      name: task.name,
      projectId: projectId,
      userId: task.userId
    });
    return response.data;
  },

  getTask: async (taskId: string): Promise<Task> => {
    const response = await api.get(`/api/tasks/${taskId}`);
    return response.data;
  },

  addUserToTask: async (
    taskId: string, 
    userId: string, 
    role?: string
  ): Promise<ApiResponse> => {
    const response = await api.post(`/api/tasks/${taskId}/users`, {
      userId,
      role: role || 'ASSIGNEE'
    });
    return response.data;
  },

  getTaskUsers: async (taskId: string): Promise<any[]> => {
    const response = await api.get(`/api/tasks/${taskId}/users`);
    return response.data;
  },

  getUserTasks: async (userId: string): Promise<Task[]> => {
    const response = await api.get(`/api/users/${userId}/tasks`);
    return response.data;
  },
};

// Time Tracking API
export const timeTrackingApi = {
  startTask: async (logRequest: DevTimeStartLogRequest): Promise<ApiResponse> => {
    const response = await api.post('/api/start', logRequest);
    return response.data;
  },

  stopTask: async (logRequest: DevTimeStopLogRequest): Promise<ApiResponse> => {
    const response = await api.post('/api/stop', logRequest);
    return response.data;
  },
};

export default api;