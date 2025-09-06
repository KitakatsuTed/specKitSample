import { describe, it, expect } from 'vitest';
import type { Task } from '@/models/Task';

describe('Contract: GET /tasks', () => {
  it('should return array of tasks', async () => {
    // This test MUST FAIL until implementation exists
    const getTasks = await import('@/services/TaskService').then((m) => m.getTasks);
    const result = getTasks();

    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([]);
  });

  it('should filter tasks by completion status', async () => {
    const getTasks = await import('@/services/TaskService').then((m) => m.getTasks);
    const result = getTasks('completed');

    expect(Array.isArray(result)).toBe(true);
    result.forEach((task: Task) => {
      expect(task.completed).toBe(true);
    });
  });

  it('should return all tasks with proper schema', async () => {
    const getTasks = await import('@/services/TaskService').then((m) => m.getTasks);
    const result = getTasks();

    result.forEach((task: Task) => {
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('description');
      expect(task).toHaveProperty('completed');
      expect(task).toHaveProperty('createdAt');
      expect(typeof task.id).toBe('string');
      expect(typeof task.description).toBe('string');
      expect(typeof task.completed).toBe('boolean');
      expect(task.createdAt).toBeInstanceOf(Date);
    });
  });
});
