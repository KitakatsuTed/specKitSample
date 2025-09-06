#!/usr/bin/env node

import { deleteTask, getTasks } from '@/services/TaskService';

export function todoDelete(
  taskId: string,
  options: {
    format?: 'json' | 'text';
  } = {}
): void {
  try {
    const { format = 'text' } = options;

    // Get task info before deletion for confirmation message
    const tasks = getTasks();
    const taskToDelete = tasks.find((t) => t.id === taskId);

    if (!taskToDelete) {
      throw new Error(`Task with ID ${taskId} not found`);
    }

    deleteTask(taskId);

    if (format === 'json') {
      console.log(
        JSON.stringify(
          {
            deleted: true,
            taskId,
            description: taskToDelete.description,
          },
          null,
          2
        )
      );
    } else {
      console.log(`🗑️  Deleted task: ${taskToDelete.description}`);
      console.log(`   ID: ${taskId}`);
    }
  } catch (error) {
    console.error('❌ Error deleting task:', (error as Error).message);
    process.exit(1);
  }
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: todo-delete <task-id> [--json]');
    process.exit(1);
  }

  const taskId = args[0];
  const format = args.includes('--json') ? 'json' : 'text';

  todoDelete(taskId, { format });
}
