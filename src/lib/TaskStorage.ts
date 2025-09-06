import type { Task, ExportData } from '@/models/Task';

/**
 * Interface for task storage implementations
 */
export interface TaskStorage {
  /** Load all tasks from storage */
  load(): Task[];
  /** Save tasks to storage */
  save(tasks: Task[]): void;
  /** Clear all tasks from storage */
  clear(): void;
  /** Export tasks as JSON string */
  export(): string;
  /** Import tasks from JSON string */
  import(data: string): Task[];
}

/**
 * localStorage-based implementation of TaskStorage
 */
export class LocalStorageTaskStorage implements TaskStorage {
  private readonly TASKS_KEY = 'todo-app-tasks';
  private readonly METADATA_KEY = 'todo-app-metadata';

  load(): Task[] {
    try {
      const data = localStorage.getItem(this.TASKS_KEY);
      if (!data) return [];

      const tasks = JSON.parse(data);
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }));
    } catch (error) {
      console.warn('Failed to load tasks from localStorage:', error);
      return [];
    }
  }

  save(tasks: Task[]): void {
    try {
      const serializedTasks = tasks.map((task) => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        completedAt: task.completedAt?.toISOString(),
      }));

      localStorage.setItem(this.TASKS_KEY, JSON.stringify(serializedTasks));

      // Update metadata
      const metadata = {
        version: '1.0.0',
        lastBackup: new Date().toISOString(),
      };
      localStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
      throw new Error('Failed to save tasks');
    }
  }

  clear(): void {
    localStorage.removeItem(this.TASKS_KEY);
    localStorage.removeItem(this.METADATA_KEY);
  }

  export(): string {
    const tasks = this.load();
    const exportData: ExportData = {
      tasks,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };

    return JSON.stringify(exportData, null, 2);
  }

  import(data: string): Task[] {
    try {
      const importData = JSON.parse(data);

      if (!importData.tasks || !Array.isArray(importData.tasks)) {
        throw new Error('Invalid import data format');
      }

      return importData.tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }));
    } catch (error) {
      throw new Error('Invalid import data');
    }
  }
}
