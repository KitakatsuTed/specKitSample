#!/usr/bin/env node

import { importTasks } from '@/services/TaskService';
import * as fs from 'fs';

export function todoImport(
  file: string,
  options: {
    format?: 'json' | 'text';
    merge?: boolean;
  } = {}
): void {
  try {
    const { format = 'json', merge = false } = options;

    if (!fs.existsSync(file)) {
      throw new Error(`File not found: ${file}`);
    }

    const fileContent = fs.readFileSync(file, 'utf-8');
    let importData;

    try {
      importData = JSON.parse(fileContent);
    } catch (error) {
      throw new Error('Invalid JSON format in import file');
    }

    const result = importTasks(importData, { merge });

    if (format === 'json') {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(`📥 Import completed:`);
      console.log(`   Imported: ${result.imported} tasks`);
      console.log(`   Skipped: ${result.skipped} tasks (duplicates)`);

      if (merge) {
        console.log(`   Mode: Merge (added to existing tasks)`);
      } else {
        console.log(`   Mode: Replace (replaced all existing tasks)`);
      }
    }
  } catch (error) {
    console.error('❌ Error importing tasks:', (error as Error).message);
    process.exit(1);
  }
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: todo-import <file> [--merge] [--json]');
    process.exit(1);
  }

  const file = args[0];
  const format = args.includes('--json') ? 'json' : 'text';
  const merge = args.includes('--merge');

  todoImport(file, { format, merge });
}
