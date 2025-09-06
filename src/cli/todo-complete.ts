#!/usr/bin/env node

import { updateTask, getTasks } from '@/services/TaskService';

export function todoComplete(
  taskId: string,
  options: {
    format?: 'json' | 'text';
    toggle?: boolean;
  } = {}
): void {
  try {
    const { format = 'text', toggle = false } = options;

    if (!toggle) {
      // Mark as completed
      const task = updateTask(taskId, { completed: true });

      if (format === 'json') {
        console.log(JSON.stringify(task, null, 2));
      } else {
        console.log(`✅ Marked task as completed: ${task.description}`);
        console.log(`   Completed at: ${task.completedAt?.toISOString()}`);
      }
    } else {
      // Toggle completion status
      const tasks = getTasks();
      const existingTask = tasks.find((t) => t.id === taskId);

      if (!existingTask) {
        throw new Error(`Task with ID ${taskId} not found`);
      }

      const newStatus = !existingTask.completed;
      const task = updateTask(taskId, { completed: newStatus });

      if (format === 'json') {
        console.log(JSON.stringify(task, null, 2));
      } else {
        const action = newStatus ? 'completed' : 'incomplete';
        console.log(`${newStatus ? '✅' : '⭕'} Marked task as ${action}: ${task.description}`);
      }
    }
  } catch (error) {
    console.error('❌ Error updating task:', (error as Error).message);
    process.exit(1);
  }
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: todo-complete <task-id> [--toggle] [--json]');
    process.exit(1);
  }

  const taskId = args[0];
  const format = args.includes('--json') ? 'json' : 'text';
  const toggle = args.includes('--toggle');

  todoComplete(taskId, { format, toggle });
}
