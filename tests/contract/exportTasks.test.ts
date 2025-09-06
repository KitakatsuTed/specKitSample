import { describe, it, expect } from 'vitest';

describe('Contract: GET /storage/export', () => {
  it('should export tasks as JSON with metadata', async () => {
    // This test MUST FAIL until implementation exists
    const { createTask, exportTasks } = await import('@/services/TaskService');
    const task1 = createTask('Task 1');
    const task2 = createTask('Task 2');

    const exportData = exportTasks();

    expect(exportData).toHaveProperty('tasks');
    expect(exportData).toHaveProperty('exportedAt');
    expect(exportData).toHaveProperty('version');
    expect(exportData.tasks).toHaveLength(2);
    expect(exportData.version).toBe('1.0.0');
    expect(new Date(exportData.exportedAt)).toBeInstanceOf(Date);
  });

  it('should export empty list when no tasks', async () => {
    const { exportTasks } = await import('@/services/TaskService');
    const exportData = exportTasks();

    expect(exportData.tasks).toHaveLength(0);
    expect(exportData.tasks).toEqual([]);
  });

  it('should include all task properties in export', async () => {
    const { createTask, updateTask, exportTasks } = await import('@/services/TaskService');
    const task = createTask('Test task');
    updateTask(task.id, { completed: true });

    const exportData = exportTasks();
    const exportedTask = exportData.tasks[0];

    expect(exportedTask).toHaveProperty('id');
    expect(exportedTask).toHaveProperty('description');
    expect(exportedTask).toHaveProperty('completed');
    expect(exportedTask).toHaveProperty('createdAt');
    expect(exportedTask).toHaveProperty('completedAt');
    expect(exportedTask.completed).toBe(true);
  });

  it('should serialize dates as ISO strings', async () => {
    const { createTask, exportTasks } = await import('@/services/TaskService');
    createTask('Test task');

    const exportData = exportTasks();
    const jsonString = JSON.stringify(exportData);
    const parsed = JSON.parse(jsonString);

    expect(typeof parsed.exportedAt).toBe('string');
    expect(typeof parsed.tasks[0].createdAt).toBe('string');
    expect(parsed.tasks[0].createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
  });
});
