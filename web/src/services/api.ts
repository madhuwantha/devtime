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
};

// Project API
export const projectApi = {
  createProject: async (project: Project): Promise<ApiResponse> => {
    const response = await api.post('/api/projects/', project);
    return response.data;
  },

  addUserToProject: async (
    projectId: string, 
    userId: string, 
    role?: string
  ): Promise<ApiResponse> => {
    const url = role 
      ? `/api/projects/${projectId}/users/${userId}/role/${role}/add-user`
      : `/api/projects/${projectId}/users/${userId}/add-user`;
    const response = await api.post(url);
    return response.data;
  },

  getUserProjects: async (userId: string): Promise<Project[]> => {
    const response = await api.get(`/api/projects/users/${userId}`);
    return response.data;
  },
};

// Task API
export const taskApi = {
  createTask: async (task: Task, projectId: string): Promise<ApiResponse> => {
    const response = await api.post(`/api/projects/${projectId}/tasks/`, task);
    return response.data;
  },

  addUserToTask: async (
    taskId: string, 
    userId: string, 
    role?: string
  ): Promise<ApiResponse> => {
    const url = role 
      ? `/api/tasks/${taskId}/users/${userId}/role/${role}/add-user`
      : `/api/tasks/${taskId}/users/${userId}/add-user`;
    const response = await api.post(url);
    return response.data;
  },

  getUserTasks: async (userId: string): Promise<Task[]> => {
    const response = await api.get(`/api/tasks/users/${userId}`);
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