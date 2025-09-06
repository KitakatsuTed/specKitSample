import { describe, it, expect } from 'vitest';
import type { Task } from '@/models/Task';

describe('Task Model', () => {
  describe('Task Interface Validation', () => {
    it('should have required properties', () => {
      const task: Task = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Test task',
        completed: false,
        createdAt: new Date('2023-01-01T10:00:00Z'),
      };

      expect(task.id).toBeDefined();
      expect(task.description).toBeDefined();
      expect(task.completed).toBeDefined();
      expect(task.createdAt).toBeDefined();
    });

    it('should allow optional completedAt property', () => {
      const incompleteTask: Task = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        description: 'Incomplete task',
        completed: false,
        createdAt: new Date('2023-01-01T10:00:00Z'),
      };

      const completedTask: Task = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        description: 'Completed task',
        completed: true,
        createdAt: new Date('2023-01-01T10:00:00Z'),
        completedAt: new Date('2023-01-01T11:00:00Z'),
      };

      expect(incompleteTask.completedAt).toBeUndefined();
      expect(completedTask.completedAt).toBeDefined();
    });

    it('should accept valid UUID formats for id', () => {
      const validUUIDs = [
        '550e8400-e29b-41d4-a716-446655440000',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
      ];

      validUUIDs.forEach((uuid) => {
        const task: Task = {
          id: uuid,
          description: 'Test task',
          completed: false,
          createdAt: new Date(),
        };

        expect(task.id).toBe(uuid);
        expect(task.id).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );
      });
    });

    it('should handle various description lengths', () => {
      const descriptions = [
        'a', // 1 char
        'A simple task', // Normal length
        'A'.repeat(100), // Long but valid
        'A'.repeat(500), // Maximum length
      ];

      descriptions.forEach((desc) => {
        const task: Task = {
          id: '550e8400-e29b-41d4-a716-446655440000',
          description: desc,
          completed: false,
          createdAt: new Date(),
        };

        expect(task.description).toBe(desc);
        expect(task.description.length).toBeGreaterThan(0);
        expect(task.description.length).toBeLessThanOrEqual(500);
      });
    });

    it('should handle boolean completed status', () => {
      const task1: Task = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Test task',
        completed: true,
        createdAt: new Date(),
      };

      const task2: Task = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        description: 'Test task',
        completed: false,
        createdAt: new Date(),
      };

      expect(task1.completed).toBe(true);
      expect(task2.completed).toBe(false);
    });

    it('should handle Date objects for timestamps', () => {
      const createdAt = new Date('2023-01-01T10:00:00Z');
      const completedAt = new Date('2023-01-01T11:00:00Z');

      const task: Task = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Test task',
        completed: true,
        createdAt,
        completedAt,
      };

      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.completedAt).toBeInstanceOf(Date);
      expect(task.createdAt.getTime()).toBe(createdAt.getTime());
      expect(task.completedAt?.getTime()).toBe(completedAt.getTime());
    });
  });

  describe('Task Serialization', () => {
    it('should serialize to JSON correctly', () => {
      const task: Task = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Test task',
        completed: true,
        createdAt: new Date('2023-01-01T10:00:00Z'),
        completedAt: new Date('2023-01-01T11:00:00Z'),
      };

      const serialized = JSON.stringify(task);
      const parsed = JSON.parse(serialized);

      expect(parsed.id).toBe(task.id);
      expect(parsed.description).toBe(task.description);
      expect(parsed.completed).toBe(task.completed);
      expect(parsed.createdAt).toBe('2023-01-01T10:00:00.000Z');
      expect(parsed.completedAt).toBe('2023-01-01T11:00:00.000Z');
    });

    it('should handle undefined completedAt in serialization', () => {
      const task: Task = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Test task',
        completed: false,
        createdAt: new Date('2023-01-01T10:00:00Z'),
      };

      const serialized = JSON.stringify(task);
      const parsed = JSON.parse(serialized);

      expect(parsed.completedAt).toBeUndefined();
    });
  });

  describe('Task Comparison', () => {
    it('should compare tasks by creation date', () => {
      const task1: Task = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        description: 'First task',
        completed: false,
        createdAt: new Date('2023-01-01T10:00:00Z'),
      };

      const task2: Task = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        description: 'Second task',
        completed: false,
        createdAt: new Date('2023-01-01T11:00:00Z'),
      };

      expect(task2.createdAt.getTime()).toBeGreaterThan(task1.createdAt.getTime());
    });

    it('should identify completed vs incomplete tasks', () => {
      const completedTask: Task = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Completed task',
        completed: true,
        createdAt: new Date(),
        completedAt: new Date(),
      };

      const incompleteTask: Task = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        description: 'Incomplete task',
        completed: false,
        createdAt: new Date(),
      };

      expect(completedTask.completed).toBe(true);
      expect(completedTask.completedAt).toBeDefined();
      expect(incompleteTask.completed).toBe(false);
      expect(incompleteTask.completedAt).toBeUndefined();
    });
  });
});