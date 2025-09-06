import { describe, it, expect } from 'vitest';
import type { Task } from '@/models/Task';

describe('Contract: PATCH /tasks/{id}', () => {
  it('should toggle task completion status', async () => {
    // This test MUST FAIL until implementation exists
    const { createTask, updateTask } = await import('@/services/TaskService');
    const task = createTask('Test task');

    expect(task.completed).toBe(false);
    expect(task.completedAt).toBeUndefined();

    const updatedTask = updateTask(task.id, { completed: true });
    expect(updatedTask.completed).toBe(true);
    expect(updatedTask.completedAt).toBeInstanceOf(Date);

    const toggledTask = updateTask(task.id, { completed: false });
    expect(toggledTask.completed).toBe(false);
    expect(toggledTask.completedAt).toBeUndefined();
  });

  it('should throw error for non-existent task', async () => {
    const { updateTask } = await import('@/services/TaskService');
    const fakeId = '550e8400-e29b-41d4-a716-446655440000';

    expect(() => updateTask(fakeId, { completed: true })).toThrow(
      `Task with ID ${fakeId} not found`
    );
  });

  it('should validate task ID format', async () => {
    const { updateTask } = await import('@/services/TaskService');
    const invalidId = 'invalid-id';

    expect(() => updateTask(invalidId, { completed: true })).toThrow(
      'Task ID must be a valid UUID'
    );
  });

  it('should return updated task with same ID', async () => {
    const { createTask, updateTask } = await import('@/services/TaskService');
    const originalTask = createTask('Test task');
    const updatedTask = updateTask(originalTask.id, { completed: true });

    expect(updatedTask.id).toBe(originalTask.id);
    expect(updatedTask.description).toBe(originalTask.description);
    expect(updatedTask.createdAt).toEqual(originalTask.createdAt);
  });
});
