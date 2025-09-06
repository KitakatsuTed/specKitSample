#!/usr/bin/env node

import { getTasks } from '@/services/TaskService';

export function todoList(
  options: {
    format?: 'json' | 'text';
    filter?: 'all' | 'completed' | 'incomplete';
  } = {}
): void {
  try {
    const { format = 'text', filter = 'all' } = options;
    const tasks = getTasks(filter);

    if (format === 'json') {
      console.log(JSON.stringify(tasks, null, 2));
      return;
    }

    if (tasks.length === 0) {
      console.log('📝 No tasks found');
      return;
    }

    console.log(`📋 Tasks (${tasks.length} ${filter === 'all' ? 'total' : filter}):`);
    console.log('');

    tasks.forEach((task, index) => {
      const status = task.completed ? '✅' : '⭕';
      const completedText = task.completed ? ' (completed)' : '';

      console.log(`${index + 1}. ${status} ${task.description}${completedText}`);
      console.log(`   ID: ${task.id}`);
      console.log(`   Created: ${task.createdAt.toLocaleDateString()}`);

      if (task.completedAt) {
        console.log(`   Completed: ${task.completedAt.toLocaleDateString()}`);
      }

      console.log('');
    });
  } catch (error) {
    console.error('❌ Error listing tasks:', (error as Error).message);
    process.exit(1);
  }
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);
  const format = args.includes('--json') ? 'json' : 'text';

  let filter: 'all' | 'completed' | 'incomplete' = 'all';
  if (args.includes('--completed')) filter = 'completed';
  if (args.includes('--incomplete')) filter = 'incomplete';

  todoList({ format, filter });
}
