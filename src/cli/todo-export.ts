#!/usr/bin/env node

import { exportTasks } from '@/services/TaskService';
import * as fs from 'fs';

export function todoExport(
  options: {
    file?: string;
    format?: 'json' | 'text';
  } = {}
): void {
  try {
    const { file, format = 'json' } = options;
    const exportData = exportTasks();

    if (format === 'json') {
      const jsonOutput = JSON.stringify(exportData, null, 2);

      if (file) {
        fs.writeFileSync(file, jsonOutput, 'utf-8');
        console.log(`📁 Exported ${exportData.tasks.length} tasks to ${file}`);
      } else {
        console.log(jsonOutput);
      }
    } else {
      // Text format
      let textOutput = `# ToDo App Export\n`;
      textOutput += `Exported: ${exportData.exportedAt}\n`;
      textOutput += `Version: ${exportData.version}\n`;
      textOutput += `Total tasks: ${exportData.tasks.length}\n\n`;

      exportData.tasks.forEach((task, index) => {
        const status = task.completed ? '[x]' : '[ ]';
        textOutput += `${index + 1}. ${status} ${task.description}\n`;
        textOutput += `   Created: ${task.createdAt}\n`;

        if (task.completedAt) {
          textOutput += `   Completed: ${task.completedAt}\n`;
        }

        textOutput += '\n';
      });

      if (file) {
        fs.writeFileSync(file, textOutput, 'utf-8');
        console.log(`📁 Exported ${exportData.tasks.length} tasks to ${file}`);
      } else {
        console.log(textOutput);
      }
    }
  } catch (error) {
    console.error('❌ Error exporting tasks:', (error as Error).message);
    process.exit(1);
  }
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);

  let file: string | undefined;
  let format: 'json' | 'text' = 'json';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && i + 1 < args.length) {
      file = args[i + 1];
      i++; // Skip next arg
    } else if (args[i] === '--format' && i + 1 < args.length) {
      const formatArg = args[i + 1];
      if (formatArg === 'json' || formatArg === 'text') {
        format = formatArg;
      }
      i++; // Skip next arg
    } else if (args[i].startsWith('--file=')) {
      file = args[i].split('=')[1];
    } else if (args[i].startsWith('--format=')) {
      const formatArg = args[i].split('=')[1];
      if (formatArg === 'json' || formatArg === 'text') {
        format = formatArg;
      }
    }
  }

  todoExport({ file, format });
}
