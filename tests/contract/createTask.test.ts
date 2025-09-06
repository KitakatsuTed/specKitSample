import { describe, it, expect } from 'vitest';
import type { Task } from '@/models/Task';

describe('Contract: POST /tasks', () => {
  it('should create task and return task object', async () => {
    // This test MUST FAIL until implementation exists
    const createTask = await import('@/services/TaskService').then((m) => m.createTask);
    const result = createTask('Test task');

    expect(result).toBeDefined();
    expect(result.description).toBe('Test task');
    expect(result.completed).toBe(false);
    expect(result.id).toBeTruthy();
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it('should reject empty description', async () => {
    const createTask = await import('@/services/TaskService').then((m) => m.createTask);

    expect(() => createTask('')).toThrow('Task description cannot be empty');
    expect(() => createTask('   ')).toThrow('Task description cannot be empty');
  });

  it('should reject description over 500 characters', async () => {
    const createTask = await import('@/services/TaskService').then((m) => m.createTask);
    const longDescription = 'a'.repeat(501);

    expect(() => createTask(longDescription)).toThrow(
      'Task description must be less than 500 characters'
    );
  });

  it('should generate unique UUIDs', async () => {
    const createTask = await import('@/services/TaskService').then((m) => m.createTask);
    const task1 = createTask('Task 1');
    const task2 = createTask('Task 2');

    expect(task1.id).not.toBe(task2.id);
    expect(task1.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });
});
