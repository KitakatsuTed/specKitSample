#!/usr/bin/env node

import { todoCreate } from './todo-create';
import { todoList } from './todo-list';
import { todoComplete } from './todo-complete';
import { todoDelete } from './todo-delete';
import { todoExport } from './todo-export';
import { todoImport } from './todo-import';

const PACKAGE_VERSION = '1.0.0';

function showHelp(): void {
  console.log(`
📝 Simple ToDo CLI - v${PACKAGE_VERSION}

Usage:
  todo <command> [options]

Commands:
  create <description>    Create a new task
  list [--filter]         List tasks (--completed, --incomplete, or all)
  complete <id> [--toggle] Mark task as complete or toggle status
  delete <id>             Delete a task
  export [--file=path]    Export tasks to JSON or text format
  import <file> [--merge] Import tasks from file

Global Options:
  --json                  Output in JSON format
  --help, -h              Show help
  --version, -v           Show version

Examples:
  todo create "Buy groceries"
  todo list --completed --json
  todo complete abc123 --toggle
  todo export --file=backup.json
  todo import backup.json --merge

For more information, visit: https://github.com/your-repo/simple-todo-app
`);
}

function showVersion(): void {
  console.log(`Simple ToDo CLI v${PACKAGE_VERSION}`);
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  if (args.includes('--version') || args.includes('-v')) {
    showVersion();
    return;
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  try {
    switch (command) {
      case 'create': {
        if (commandArgs.length === 0) {
          console.error('❌ Error: Task description is required');
          console.log('Usage: todo create <description>');
          process.exit(1);
        }
        const description = commandArgs.join(' ');
        const format = args.includes('--json') ? 'json' : 'text';
        todoCreate(description, { format });
        break;
      }

      case 'list': {
        const format = args.includes('--json') ? 'json' : 'text';
        let filter: 'all' | 'completed' | 'incomplete' = 'all';

        if (args.includes('--completed')) filter = 'completed';
        if (args.includes('--incomplete')) filter = 'incomplete';

        todoList({ format, filter });
        break;
      }

      case 'complete': {
        if (commandArgs.length === 0) {
          console.error('❌ Error: Task ID is required');
          console.log('Usage: todo complete <task-id> [--toggle]');
          process.exit(1);
        }

        const taskId = commandArgs[0];
        const format = args.includes('--json') ? 'json' : 'text';
        const toggle = args.includes('--toggle');

        todoComplete(taskId, { format, toggle });
        break;
      }

      case 'delete': {
        if (commandArgs.length === 0) {
          console.error('❌ Error: Task ID is required');
          console.log('Usage: todo delete <task-id>');
          process.exit(1);
        }

        const taskId = commandArgs[0];
        const format = args.includes('--json') ? 'json' : 'text';

        todoDelete(taskId, { format });
        break;
      }

      case 'export': {
        let file: string | undefined;
        let format: 'json' | 'text' = 'json';

        // Parse export-specific options
        for (let i = 0; i < args.length; i++) {
          if (args[i].startsWith('--file=')) {
            file = args[i].split('=')[1];
          } else if (args[i].startsWith('--format=')) {
            const formatArg = args[i].split('=')[1];
            if (formatArg === 'json' || formatArg === 'text') {
              format = formatArg;
            }
          }
        }

        todoExport({ file, format });
        break;
      }

      case 'import': {
        if (commandArgs.length === 0) {
          console.error('❌ Error: Import file is required');
          console.log('Usage: todo import <file> [--merge]');
          process.exit(1);
        }

        const file = commandArgs[0];
        const format = args.includes('--json') ? 'json' : 'text';
        const merge = args.includes('--merge');

        todoImport(file, { format, merge });
        break;
      }

      default:
        console.error(`❌ Error: Unknown command '${command}'`);
        console.log('Run "todo --help" for usage information');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', (error as Error).message);
    process.exit(1);
  }
}

// Export for library usage
export { todoCreate, todoList, todoComplete, todoDelete, todoExport, todoImport };

// CLI entry point
if (require.main === module) {
  main();
}
