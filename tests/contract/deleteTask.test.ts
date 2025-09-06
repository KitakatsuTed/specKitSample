import { describe, it, expect } from 'vitest';

describe('Contract: DELETE /tasks/{id}', () => {
  it('should remove task from list', async () => {
    // This test MUST FAIL until implementation exists
    const { createTask, deleteTask, getTasks } = await import('@/services/TaskService');
    const task = createTask('Test task');

    expect(getTasks()).toHaveLength(1);

    deleteTask(task.id);
    expect(getTasks()).toHaveLength(0);
  });

  it('should throw error for non-existent task', async () => {
    const { deleteTask } = await import('@/services/TaskService');
    const fakeId = '550e8400-e29b-41d4-a716-446655440000';

    expect(() => deleteTask(fakeId)).toThrow(`Task with ID ${fakeId} not found`);
  });

  it('should validate task ID format', async () => {
    const { deleteTask } = await import('@/services/TaskService');
    const invalidId = 'invalid-id';

    expect(() => deleteTask(invalidId)).toThrow('Task ID must be a valid UUID');
  });

  it('should not affect other tasks', async () => {
    const { createTask, deleteTask, getTasks } = await import('@/services/TaskService');
    const task1 = createTask('Task 1');
    const task2 = createTask('Task 2');
    const task3 = createTask('Task 3');

    expect(getTasks()).toHaveLength(3);

    deleteTask(task2.id);
    const remainingTasks = getTasks();

    expect(remainingTasks).toHaveLength(2);
    expect(remainingTasks.find((t) => t.id === task1.id)).toBeDefined();
    expect(remainingTasks.find((t) => t.id === task3.id)).toBeDefined();
    expect(remainingTasks.find((t) => t.id === task2.id)).toBeUndefined();
  });
});
