// User Types
export interface UserInfo {
  id?: string;
  username: string;
  email: string;
}

// Project Types
export interface ProjectUser {
  userId: string;
  role: string;
}

export interface Project {
  id?: string;
  name: string;
  code: string;
  tasks: string[];
  users: ProjectUser[];
}

// Task Types
export interface TaskUser {
  userId: string;
  role: string;
}

export interface Task {
  id?: string;
  name: string;
  projectId: string;
  users: TaskUser[];
}

// Time Tracking Types
export interface DevTimeStartLogRequest {
  project: string;
  task: string;
  username: string;
}

export interface DevTimeStopLogRequest {
  username: string;
}

export interface DevTimeLog {
  id?: string;
  project: string;
  task: string;
  startTime: string;
  endTime?: string;
  username: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  message?: string;
  id?: string;
  error?: string;
  details?: any;
  data?: T;
}

// User Role Constants
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER'
} as const;

export const TASK_ROLES = {
  WATCHER: 'WATCHER',
  ASSIGNEE: 'ASSIGNEE',
  REVIEWER: 'REVIEWER',
  OWNER: 'OWNER'
} as const;