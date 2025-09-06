import { describe, it, expect, beforeEach } from 'vitest';
import { createTask, getTasks, updateTask, deleteTask, clearAllTasks } from '@/services/TaskService';

describe('localStorage Performance Tests', () => {
  beforeEach(() => {
    clearAllTasks();
  });

  describe('Task Creation Performance', () => {
    it('should create 100 tasks in under 500ms', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        createTask(`Task ${i + 1}`);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(500);
      expect(getTasks()).toHaveLength(100);
    });

    it('should create 1000 tasks in under 5 seconds', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        createTask(`Task ${i + 1}`);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(5000);
      expect(getTasks()).toHaveLength(1000);
    });
  });

  describe('Task Retrieval Performance', () => {
    beforeEach(() => {
      // Create 1000 test tasks
      for (let i = 0; i < 1000; i++) {
        createTask(`Task ${i + 1}`);
      }
    });

    it('should retrieve all tasks in under 50ms', () => {
      const startTime = performance.now();
      
      const tasks = getTasks();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(50);
      expect(tasks).toHaveLength(1000);
    });

    it('should filter completed tasks in under 100ms', () => {
      // Mark half the tasks as completed
      const allTasks = getTasks();
      for (let i = 0; i < 500; i++) {
        updateTask(allTasks[i].id, { completed: true });
      }

      const startTime = performance.now();
      
      const completedTasks = getTasks('completed');
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(100);
      expect(completedTasks).toHaveLength(500);
      completedTasks.forEach(task => {
        expect(task.completed).toBe(true);
      });
    });

    it('should filter incomplete tasks in under 100ms', () => {
      // Mark half the tasks as completed
      const allTasks = getTasks();
      for (let i = 0; i < 500; i++) {
        updateTask(allTasks[i].id, { completed: true });
      }

      const startTime = performance.now();
      
      const incompleteTasks = getTasks('incomplete');
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(100);
      expect(incompleteTasks).toHaveLength(500);
      incompleteTasks.forEach(task => {
        expect(task.completed).toBe(false);
      });
    });
  });

  describe('Task Update Performance', () => {
    let taskIds: string[] = [];

    beforeEach(() => {
      // Create 100 test tasks
      taskIds = [];
      for (let i = 0; i < 100; i++) {
        const task = createTask(`Task ${i + 1}`);
        taskIds.push(task.id);
      }
    });

    it('should update 100 tasks in under 500ms', () => {
      const startTime = performance.now();
      
      taskIds.forEach(id => {
        updateTask(id, { completed: true });
      });
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(500);
      
      const completedTasks = getTasks('completed');
      expect(completedTasks).toHaveLength(100);
    });

    it('should toggle 100 tasks completion status in under 1 second', () => {
      const startTime = performance.now();
      
      // Toggle each task twice (complete -> incomplete -> complete)
      taskIds.forEach(id => {
        updateTask(id, { completed: true });
        updateTask(id, { completed: false });
        updateTask(id, { completed: true });
      });
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000);
      
      const completedTasks = getTasks('completed');
      expect(completedTasks).toHaveLength(100);
    });
  });

  describe('Task Deletion Performance', () => {
    let taskIds: string[] = [];

    beforeEach(() => {
      // Create 100 test tasks
      taskIds = [];
      for (let i = 0; i < 100; i++) {
        const task = createTask(`Task ${i + 1}`);
        taskIds.push(task.id);
      }
    });

    it('should delete 100 tasks in under 500ms', () => {
      const startTime = performance.now();
      
      taskIds.forEach(id => {
        deleteTask(id);
      });
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(500);
      expect(getTasks()).toHaveLength(0);
    });

    it('should delete tasks one by one efficiently', () => {
      const durations: number[] = [];
      
      taskIds.forEach(id => {
        const startTime = performance.now();
        deleteTask(id);
        const endTime = performance.now();
        durations.push(endTime - startTime);
      });
      
      // Each individual delete should take less than 10ms
      durations.forEach(duration => {
        expect(duration).toBeLessThan(10);
      });
      
      expect(getTasks()).toHaveLength(0);
    });
  });

  describe('localStorage Size and Efficiency', () => {
    it('should handle large task descriptions efficiently', () => {
      const largeDescription = 'A'.repeat(500); // Max allowed length
      
      const startTime = performance.now();
      
      for (let i = 0; i < 50; i++) {
        // Create task with exactly 500 characters (max allowed)
        const taskNumber = ` - Task ${i + 1}`;
        const description = largeDescription.substring(0, 500 - taskNumber.length) + taskNumber;
        createTask(description);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000);
      expect(getTasks()).toHaveLength(50);
    });

    it('should maintain performance with mixed task sizes', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 200; i++) {
        const description = i % 2 === 0 
          ? `Short task ${i + 1}` 
          : `${'Long task description '.repeat(10)} - Task ${i + 1}`;
        createTask(description);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(2000);
      expect(getTasks()).toHaveLength(200);
    });

    it('should serialize and deserialize data efficiently', () => {
      // Create tasks with various completion states and timestamps
      for (let i = 0; i < 100; i++) {
        const task = createTask(`Task ${i + 1}`);
        if (i % 3 === 0) {
          updateTask(task.id, { completed: true });
        }
      }

      // Measure full cycle: getTasks (which deserializes) multiple times
      const startTime = performance.now();
      
      for (let i = 0; i < 10; i++) {
        const tasks = getTasks();
        expect(tasks).toHaveLength(100);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // 10 full deserializations should complete in under 100ms
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Memory Usage Patterns', () => {
    it('should not accumulate memory with repeated operations', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Perform many create/delete cycles
      for (let cycle = 0; cycle < 10; cycle++) {
        const taskIds: string[] = [];
        
        // Create 50 tasks
        for (let i = 0; i < 50; i++) {
          const task = createTask(`Cycle ${cycle} - Task ${i + 1}`);
          taskIds.push(task.id);
        }
        
        // Delete all tasks
        taskIds.forEach(id => deleteTask(id));
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      expect(getTasks()).toHaveLength(0);
      
      // Memory growth should be reasonable (less than 5MB)
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryGrowth = finalMemory - initialMemory;
        expect(memoryGrowth).toBeLessThan(5 * 1024 * 1024); // 5MB
      }
    });
  });

  describe('Concurrent Operation Simulation', () => {
    it('should handle rapid sequential operations efficiently', () => {
      const startTime = performance.now();
      const taskIds: string[] = [];
      
      // Simulate rapid user interactions
      for (let i = 0; i < 50; i++) {
        // Create task
        const task = createTask(`Rapid task ${i + 1}`);
        taskIds.push(task.id);
        
        // Immediately toggle completion
        updateTask(task.id, { completed: true });
        updateTask(task.id, { completed: false });
        
        // Get tasks (simulating UI refresh)
        getTasks();
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000);
      expect(getTasks()).toHaveLength(50);
      expect(getTasks('completed')).toHaveLength(0); // All should be incomplete
    });

    it('should maintain consistent performance across operation batches', () => {
      const batchDurations: number[] = [];
      
      for (let batch = 0; batch < 5; batch++) {
        const batchStartTime = performance.now();
        
        // Each batch: create 20 tasks, update half, delete 10
        const batchTaskIds: string[] = [];
        
        for (let i = 0; i < 20; i++) {
          const task = createTask(`Batch ${batch} - Task ${i + 1}`);
          batchTaskIds.push(task.id);
        }
        
        // Update half
        for (let i = 0; i < 10; i++) {
          updateTask(batchTaskIds[i], { completed: true });
        }
        
        // Delete 10
        for (let i = 0; i < 10; i++) {
          deleteTask(batchTaskIds[i]);
        }
        
        const batchEndTime = performance.now();
        batchDurations.push(batchEndTime - batchStartTime);
      }
      
      // Each batch should complete in under 200ms
      batchDurations.forEach((duration, index) => {
        expect(duration).toBeLessThan(200);
      });
      
      // Performance should be reasonably consistent
      const firstBatchDuration = batchDurations[0];
      const lastBatchDuration = batchDurations[batchDurations.length - 1];
      
      // Last batch should not take more than 5x the first batch (very lenient for CI/load variations)
      expect(lastBatchDuration).toBeLessThan(firstBatchDuration * 5);
      
      expect(getTasks()).toHaveLength(50); // 5 batches * 10 remaining tasks each
    });
  });
});