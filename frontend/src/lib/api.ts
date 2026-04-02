import axios from 'axios';

export type Status = 'not_started' | 'in_progress' | 'in_review' | 'done' | 'blocked';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  estimate: number | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  subtasks?: Task[];
}

export interface Stats {
  notStarted: number;
  inProgress: number;
  inReview: number;
  done: number;
  blocked: number;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  estimate?: number;
  parent_id?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  estimate?: number;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

export const getTasks = () => api.get<Task[]>('/api/tasks').then(r => r.data);
export const getTask = (id: string) => api.get<Task>(`/api/tasks/${id}`).then(r => r.data);
export const createTask = (data: CreateTaskDto) => api.post<Task>('/api/tasks', data).then(r => r.data);
export const updateTask = (id: string, data: UpdateTaskDto) => api.put<Task>(`/api/tasks/${id}`, data).then(r => r.data);
export const deleteTask = (id: string) => api.delete(`/api/tasks/${id}`);
export const getStats = () => api.get<Stats>('/api/tasks/stats').then(r => r.data);