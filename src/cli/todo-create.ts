#!/usr/bin/env node

import { createTask } from '@/services/TaskService';

export function todoCreate(description: string, options: { format?: 'json' | 'text' } = {}): void {
  try {
    const task = createTask(description);

    if (options.format === 'json') {
      console.log(JSON.stringify(task, null, 2));
    } else {
      console.log(`✅ Created task: ${task.description}`);
      console.log(`   ID: ${task.id}`);
      console.log(`   Created: ${task.createdAt.toISOString()}`);
    }
  } catch (error) {
    console.error('❌ Error creating task:', (error as Error).message);
    process.exit(1);
  }
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);
  const description = args.join(' ');

  if (!description) {
    console.error('Usage: todo-create <description>');
    process.exit(1);
  }

  todoCreate(description);
}
