import { User, MeetTask, MeetRecord } from '@/types';

const STORAGE_KEYS = {
  USER: 'roadmeet_user',
  TASKS: 'roadmeet_tasks',
  RECORDS: 'roadmeet_records',
};

// User Storage
export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const setUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const removeUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Task Storage
export const getTasks = (): MeetTask[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.TASKS);
  return data ? JSON.parse(data) : [];
};

export const saveTask = (task: MeetTask): void => {
  if (typeof window === 'undefined') return;
  const tasks = getTasks();
  const existingIndex = tasks.findIndex(t => t.id === task.id);
  if (existingIndex >= 0) {
    tasks[existingIndex] = task;
  } else {
    tasks.push(task);
  }
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

export const deleteTask = (taskId: string): void => {
  if (typeof window === 'undefined') return;
  const tasks = getTasks().filter(t => t.id !== taskId);
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

export const getTaskByCode = (code: string): MeetTask | undefined => {
  return getTasks().find(t => t.code === code);
};

export const getTaskById = (id: string): MeetTask | undefined => {
  return getTasks().find(t => t.id === id);
};

// Generate random 6-digit hex code
export const generateMeetCode = (): string => {
  return Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0');
};

// Calculate midpoint between two locations
export const calculateMidpoint = (loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }) => {
  return {
    lat: (loc1.lat + loc2.lat) / 2,
    lng: (loc1.lng + loc2.lng) / 2,
  };
};
