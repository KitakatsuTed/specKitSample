import { v4 as uuidv4 } from 'uuid';
import type { Task, UpdateTaskRequest, ExportData, ImportData, ImportResult } from '@/models/Task';
import { validateDescription, validateTask } from '@/lib/TaskValidation';
import { LocalStorageTaskStorage, type TaskStorage } from '@/lib/TaskStorage';

class TaskService {
  private storage: TaskStorage;
  private tasks: Task[] = [];

  constructor() {
    this.storage = new LocalStorageTaskStorage();
    this.tasks = this.storage.load();
  }

  // T023: getTasks API implementation
  getTasks(filter?: 'all' | 'completed' | 'incomplete'): Task[] {
    let filteredTasks = [...this.tasks];

    if (filter === 'completed') {
      filteredTasks = filteredTasks.filter((task) => task.completed);
    } else if (filter === 'incomplete') {
      filteredTasks = filteredTasks.filter((task) => !task.completed);
    }

    // Return in chronological order (newest first)
    return filteredTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // T024: createTask API implementation
  createTask(description: string): Task {
    const validation = validateDescription(description);
    if (!validation.isValid) {
      throw new Error(validation.errors[0]);
    }

    const trimmedDescription = description.trim();
    const task: Task = {
      id: uuidv4(),
      description: trimmedDescription,
      completed: false,
      createdAt: new Date(),
    };

    this.tasks.push(task);
    this.storage.save(this.tasks);

    return task;
  }

  // T025: updateTask API implementation
  updateTask(id: string, updates: UpdateTaskRequest): Task {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      const validation = validateTask({ id });
      if (!validation.isValid) {
        throw new Error(validation.errors[0]);
      }
      throw new Error(`Task with ID ${id} not found`);
    }

    const task = { ...this.tasks[taskIndex] };

    if (updates.completed !== undefined) {
      task.completed = updates.completed;
      task.completedAt = updates.completed ? new Date() : undefined;
    }

    this.tasks[taskIndex] = task;
    this.storage.save(this.tasks);

    return task;
  }

  // T026: deleteTask API implementation
  deleteTask(id: string): void {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      const validation = validateTask({ id });
      if (!validation.isValid) {
        throw new Error(validation.errors[0]);
      }
      throw new Error(`Task with ID ${id} not found`);
    }

    this.tasks.splice(taskIndex, 1);
    this.storage.save(this.tasks);
  }

  // T027: exportTasks API implementation
  exportTasks(): ExportData {
    return {
      tasks: this.getTasks(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  // T028: importTasks API implementation
  importTasks(importData: ImportData, options: { merge?: boolean } = {}): ImportResult {
    // Validate import data structure
    if (!importData || !importData.tasks || !Array.isArray(importData.tasks)) {
      throw new Error('Invalid import data');
    }

    // Validate each task
    const validationErrors = importData.tasks
      .map((task, index) => ({ task, index }))
      .filter(({ task }) => !validateTask(task).isValid);

    if (validationErrors.length > 0) {
      throw new Error('Invalid import data');
    }

    let imported = 0;
    let skipped = 0;
    const { merge = false } = options;

    if (!merge) {
      // Replace mode - clear existing tasks
      this.tasks = [];
    }

    for (const importTask of importData.tasks) {
      const existingTaskIndex = this.tasks.findIndex((task) => task.id === importTask.id);

      if (existingTaskIndex >= 0) {
        // Task already exists
        skipped++;
      } else {
        // New task
        const task: Task = {
          ...importTask,
          createdAt: new Date(importTask.createdAt),
          completedAt: importTask.completedAt ? new Date(importTask.completedAt) : undefined,
        };
        this.tasks.push(task);
        imported++;
      }
    }

    this.storage.save(this.tasks);

    return { imported, skipped };
  }

  // Helper method to clear all tasks (useful for testing)
  clearAllTasks(): void {
    this.tasks = [];
    this.storage.clear();
  }
}

// Export singleton instance and individual functions for easy testing
const taskService = new TaskService();

/**
 * Retrieves tasks with optional filtering
 * @param filter - Filter type: 'all', 'completed', or 'incomplete'. Defaults to 'all'
 * @returns Array of tasks sorted by creation date (newest first)
 */
export const getTasks = (filter?: 'all' | 'completed' | 'incomplete'): Task[] =>
  taskService.getTasks(filter);

/**
 * Creates a new task with the given description
 * @param description - Task description (1-500 characters, will be trimmed)
 * @returns The created task object
 * @throws Error if description is empty or exceeds 500 characters
 */
export const createTask = (description: string): Task => taskService.createTask(description);

/**
 * Updates an existing task
 * @param id - UUID of the task to update
 * @param updates - Object containing fields to update (currently supports 'completed' only)
 * @returns The updated task object
 * @throws Error if task ID is invalid or task not found
 */
export const updateTask = (id: string, updates: UpdateTaskRequest): Task =>
  taskService.updateTask(id, updates);

/**
 * Deletes a task by ID
 * @param id - UUID of the task to delete
 * @throws Error if task ID is invalid or task not found
 */
export const deleteTask = (id: string): void => taskService.deleteTask(id);

/**
 * Exports all tasks to a structured format
 * @returns Export data object containing tasks, timestamp, and version
 */
export const exportTasks = (): ExportData => taskService.exportTasks();

/**
 * Imports tasks from structured data
 * @param importData - Import data object with tasks array
 * @param options - Import options: { merge?: boolean }. If merge is false, existing tasks are replaced
 * @returns Import result with counts of imported and skipped tasks
 * @throws Error if import data is invalid
 */
export const importTasks = (importData: ImportData, options?: { merge?: boolean }): ImportResult =>
  taskService.importTasks(importData, options);

/**
 * Clears all tasks (primarily for testing)
 */
export const clearAllTasks = (): void => taskService.clearAllTasks();

export default taskService;
