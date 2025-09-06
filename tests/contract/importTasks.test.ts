import { describe, it, expect } from 'vitest';
import type { ExportData } from '@/models/Task';

describe('Contract: POST /storage/import', () => {
  it('should import tasks from export data', async () => {
    // This test MUST FAIL until implementation exists
    const { importTasks, getTasks } = await import('@/services/TaskService');

    const importData: ExportData = {
      tasks: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          description: 'Imported task 1',
          completed: false,
          createdAt: new Date('2025-09-06T10:00:00.000Z'),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          description: 'Imported task 2',
          completed: true,
          createdAt: new Date('2025-09-06T11:00:00.000Z'),
          completedAt: new Date('2025-09-06T12:00:00.000Z'),
        },
      ],
    };

    const result = importTasks(importData, { merge: true });

    expect(result.imported).toBe(2);
    expect(result.skipped).toBe(0);
    expect(getTasks()).toHaveLength(2);
  });

  it('should skip duplicate tasks by ID', async () => {
    const { createTask, importTasks, getTasks } = await import('@/services/TaskService');
    const existingTask = createTask('Existing task');

    const importData: ExportData = {
      tasks: [
        {
          id: existingTask.id,
          description: 'Duplicate task',
          completed: false,
          createdAt: new Date(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          description: 'New task',
          completed: false,
          createdAt: new Date(),
        },
      ],
    };

    const result = importTasks(importData, { merge: true });

    expect(result.imported).toBe(1);
    expect(result.skipped).toBe(1);
    expect(getTasks()).toHaveLength(2);
  });

  it('should validate imported task data', async () => {
    const { importTasks } = await import('@/services/TaskService');

    const invalidData: ExportData = {
      tasks: [
        {
          id: 'invalid-id',
          description: '',
          completed: false,
          createdAt: new Date(),
        } as any,
      ],
    };

    expect(() => importTasks(invalidData)).toThrow('Invalid import data');
  });

  it('should handle merge vs replace mode', async () => {
    const { createTask, importTasks, getTasks } = await import('@/services/TaskService');
    createTask('Existing task');

    const importData: ExportData = {
      tasks: [
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          description: 'New task',
          completed: false,
          createdAt: new Date(),
        },
      ],
    };

    // Merge mode
    const mergeResult = importTasks(importData, { merge: true });
    expect(getTasks()).toHaveLength(2);

    // Replace mode (default is merge: false)
    const replaceResult = importTasks(importData, { merge: false });
    expect(getTasks()).toHaveLength(1);
    expect(getTasks()[0].description).toBe('New task');
  });
});
