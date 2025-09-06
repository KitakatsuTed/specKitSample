import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createTask, getTasks, updateTask, deleteTask, clearAllTasks } from '@/services/TaskService';

// Mock localStorage
const mockStorage: Record<string, string> = {};

beforeEach(() => {
  // Clear storage before each test
  Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  
  // Mock localStorage methods
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn((key: string) => mockStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key];
      }),
      clear: vi.fn(() => {
        Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
      }),
      length: 0,
      key: vi.fn(),
    },
    writable: true,
  });

  // Clear all tasks from singleton
  clearAllTasks();
});

describe('TaskService', () => {
  describe('createTask', () => {
    it('should create a valid task with description', () => {
      const task = createTask('Test task');

      expect(task).toBeDefined();
      expect(task.description).toBe('Test task');
      expect(task.completed).toBe(false);
      expect(task.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.completedAt).toBeUndefined();
    });

    it('should generate unique UUIDs for different tasks', () => {
      const task1 = createTask('Task 1');
      const task2 = createTask('Task 2');

      expect(task1.id).not.toBe(task2.id);
    });

    it('should trim whitespace from description', () => {
      const task = createTask('  Test task  ');
      expect(task.description).toBe('Test task');
    });

    it('should throw error for empty description', () => {
      expect(() => createTask('')).toThrow('Task description cannot be empty');
    });

    it('should throw error for whitespace-only description', () => {
      expect(() => createTask('   ')).toThrow('Task description cannot be empty');
    });

    it('should throw error for description over 500 characters', () => {
      const longDescription = 'a'.repeat(501);
      expect(() => createTask(longDescription)).toThrow(
        'Task description must be less than 500 characters'
      );
    });

    it('should persist task to localStorage', () => {
      const task = createTask('Test task');
      const storedTasks = JSON.parse(mockStorage['todo-app-tasks'] || '[]');

      expect(storedTasks).toHaveLength(1);
      expect(storedTasks[0].id).toBe(task.id);
      expect(storedTasks[0].description).toBe(task.description);
    });
  });

  describe('getTasks', () => {
    beforeEach(() => {
      // Create some test tasks
      createTask('First task');
      createTask('Second task');
      const completedTask = createTask('Completed task');
      updateTask(completedTask.id, { completed: true });
    });

    it('should return all tasks by default', () => {
      const tasks = getTasks();
      expect(tasks).toHaveLength(3);
    });

    it('should return all tasks when filter is "all"', () => {
      const tasks = getTasks('all');
      expect(tasks).toHaveLength(3);
    });

    it('should return only completed tasks when filter is "completed"', () => {
      const tasks = getTasks('completed');
      expect(tasks).toHaveLength(1);
      expect(tasks[0].completed).toBe(true);
      expect(tasks[0].description).toBe('Completed task');
    });

    it('should return only incomplete tasks when filter is "incomplete"', () => {
      const tasks = getTasks('incomplete');
      expect(tasks).toHaveLength(2);
      tasks.forEach(task => {
        expect(task.completed).toBe(false);
      });
    });

    it('should return tasks sorted by creation date (newest first)', () => {
      const tasks = getTasks();
      // Just verify they are sorted by creation date, don't assume specific order
      // since tasks are created quickly and may have same timestamp
      expect(tasks).toHaveLength(3);
      
      // Verify sorting logic - each task should be created at or after the next one
      for (let i = 0; i < tasks.length - 1; i++) {
        expect(tasks[i].createdAt.getTime()).toBeGreaterThanOrEqual(
          tasks[i + 1].createdAt.getTime()
        );
      }
    });

    it('should handle empty localStorage gracefully', () => {
      // Clear all tasks first
      clearAllTasks();
      mockStorage['todo-app-tasks'] = '';
      const tasks = getTasks();
      expect(tasks).toHaveLength(0);
    });

    it('should handle missing localStorage key gracefully', () => {
      // Clear all tasks first
      clearAllTasks();
      delete mockStorage['todo-app-tasks'];
      const tasks = getTasks();
      expect(tasks).toHaveLength(0);
    });

    it('should deserialize dates correctly', () => {
      const tasks = getTasks();
      tasks.forEach(task => {
        expect(task.createdAt).toBeInstanceOf(Date);
        if (task.completedAt) {
          expect(task.completedAt).toBeInstanceOf(Date);
        }
      });
    });
  });

  describe('updateTask', () => {
    let taskId: string;

    beforeEach(() => {
      const task = createTask('Test task');
      taskId = task.id;
    });

    it('should update task completion status', () => {
      const updatedTask = updateTask(taskId, { completed: true });

      expect(updatedTask.completed).toBe(true);
      expect(updatedTask.completedAt).toBeInstanceOf(Date);
      expect(updatedTask.completedAt).toBeDefined();
    });

    it('should update task completion status only', () => {
      const updatedTask = updateTask(taskId, { completed: true });

      expect(updatedTask.completed).toBe(true);
      expect(updatedTask.completedAt).toBeInstanceOf(Date);
      expect(updatedTask.description).toBe('Test task'); // Should not change
    });

    it('should clear completedAt when marking as incomplete', () => {
      // First mark as completed
      updateTask(taskId, { completed: true });

      // Then mark as incomplete
      const updatedTask = updateTask(taskId, { completed: false });

      expect(updatedTask.completed).toBe(false);
      expect(updatedTask.completedAt).toBeUndefined();
    });

    it('should set completedAt when marking as complete', () => {
      const beforeUpdate = Date.now();
      const updatedTask = updateTask(taskId, { completed: true });
      const afterUpdate = Date.now();

      expect(updatedTask.completedAt).toBeInstanceOf(Date);
      expect(updatedTask.completedAt!.getTime()).toBeGreaterThanOrEqual(beforeUpdate);
      expect(updatedTask.completedAt!.getTime()).toBeLessThanOrEqual(afterUpdate);
    });

    // updateTask only handles completion status in current implementation
    // Description updates are not implemented

    it('should throw error for non-existent task', () => {
      expect(() => updateTask('non-existent-id', { completed: true })).toThrow(
        'Task ID must be a valid UUID'
      );
    });

    it('should persist changes to localStorage', () => {
      updateTask(taskId, { completed: true });

      const storedTasks = JSON.parse(mockStorage['todo-app-tasks'] || '[]');
      const updatedTask = storedTasks.find((t: any) => t.id === taskId);

      expect(updatedTask.completed).toBe(true);
      expect(updatedTask.completedAt).toBeDefined();
    });
  });

  describe('deleteTask', () => {
    let taskId: string;

    beforeEach(() => {
      createTask('Task 1');
      const task = createTask('Task to delete');
      createTask('Task 3');
      taskId = task.id;
    });

    it('should delete existing task', () => {
      const tasksBefore = getTasks();
      expect(tasksBefore).toHaveLength(3);

      deleteTask(taskId);

      const tasksAfter = getTasks();
      expect(tasksAfter).toHaveLength(2);
      expect(tasksAfter.find(t => t.id === taskId)).toBeUndefined();
    });

    it('should throw error for non-existent task', () => {
      expect(() => deleteTask('non-existent-id')).toThrow('Task ID must be a valid UUID');
    });

    it('should persist changes to localStorage', () => {
      deleteTask(taskId);

      const storedTasks = JSON.parse(mockStorage['todo-app-tasks'] || '[]');
      expect(storedTasks).toHaveLength(2);
      expect(storedTasks.find((t: any) => t.id === taskId)).toBeUndefined();
    });

    it('should not affect other tasks', () => {
      const tasksBefore = getTasks().filter(t => t.id !== taskId);
      deleteTask(taskId);
      const tasksAfter = getTasks();

      expect(tasksAfter).toHaveLength(2);
      tasksBefore.forEach(originalTask => {
        const remainingTask = tasksAfter.find(t => t.id === originalTask.id);
        expect(remainingTask).toBeDefined();
        expect(remainingTask?.description).toBe(originalTask.description);
        expect(remainingTask?.completed).toBe(originalTask.completed);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle corrupted localStorage data', () => {
      mockStorage['todo-app-tasks'] = 'invalid json';
      
      // Should not throw, should return empty array
      const tasks = getTasks();
      expect(tasks).toHaveLength(0);
    });

    it('should handle localStorage quota exceeded', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new DOMException('QuotaExceededError');
      });

      expect(() => createTask('Test task')).toThrow('Failed to save tasks');

      localStorage.setItem = originalSetItem;
    });
  });
});