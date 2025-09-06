# Data Model: Simple ToDo App

**Phase**: 1  
**Date**: 2025-09-06  
**Prerequisites**: research.md complete

## Core Entities

### Task

**Purpose**: Represents a single todo item with completion tracking

**Fields**:

- `id: string` - Unique identifier (UUID v4)
- `description: string` - Task description text (1-500 characters)
- `completed: boolean` - Completion status (default: false)
- `createdAt: Date` - Creation timestamp (ISO string when serialized)
- `completedAt?: Date` - Completion timestamp (optional, ISO string when serialized)

**Validation Rules**:

- `description` must be non-empty after trimming whitespace (FR-006)
- `description` length between 1-500 characters
- `id` must be valid UUID v4 format
- `createdAt` must be valid ISO date string
- `completedAt` only set when `completed` is true

**State Transitions**:

```
[new] -> incomplete -> complete
       \-> incomplete (toggle back)
       \-> [deleted]
```

### TaskList

**Purpose**: Collection container and manager for tasks

**Fields**:

- `tasks: Task[]` - Array of all tasks
- `lastModified: Date` - Timestamp of last list modification

**Operations**:

- `addTask(description: string): Task` - Create and add new task
- `toggleTask(id: string): void` - Toggle completion status
- `deleteTask(id: string): void` - Remove task from list
- `getTasks(): Task[]` - Retrieve all tasks
- `getCompletedTasks(): Task[]` - Filter completed tasks
- `getIncompleteTasks(): Task[]` - Filter incomplete tasks

**Invariants**:

- Task IDs must be unique within the list
- No duplicate tasks based on ID
- List maintains chronological order (newest first)

## Storage Schema

### localStorage Key Structure

```typescript
interface StorageSchema {
  'todo-app-tasks': Task[]; // Main task storage
  'todo-app-metadata': {
    // App metadata
    version: string; // Data format version
    lastBackup?: Date; // Last backup timestamp
  };
}
```

### Serialization Format

```typescript
// Example localStorage entry
{
  "todo-app-tasks": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "description": "Complete project documentation",
      "completed": false,
      "createdAt": "2025-09-06T10:30:00.000Z",
      "completedAt": null
    },
    {
      "id": "987fcdeb-51d2-43f8-b123-456789abcdef",
      "description": "Review pull requests",
      "completed": true,
      "createdAt": "2025-09-06T09:15:00.000Z",
      "completedAt": "2025-09-06T11:45:00.000Z"
    }
  ]
}
```

## Type Definitions

```typescript
// Core types
interface Task {
  id: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

interface TaskList {
  tasks: Task[];
  lastModified: Date;
}

// API types for storage operations
interface TaskStorage {
  load(): Task[];
  save(tasks: Task[]): void;
  clear(): void;
  export(): string; // JSON export
  import(data: string): Task[]; // JSON import
}

// Validation types
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface TaskValidation {
  validateDescription(description: string): ValidationResult;
  validateTask(task: Partial<Task>): ValidationResult;
}
```

## Data Flow

### Task Creation Flow

```
User Input -> Validation -> Task Creation -> Storage Update -> UI Refresh
```

### Task Update Flow

```
User Action -> Task Lookup -> State Change -> Storage Update -> UI Refresh
```

### Storage Persistence Flow

```
Memory State -> JSON Serialization -> localStorage Write -> Backup Trigger
```

## Error Handling

### Validation Errors

- Empty description: "Task description cannot be empty"
- Too long description: "Task description must be less than 500 characters"
- Invalid ID format: "Task ID must be a valid UUID"

### Storage Errors

- Quota exceeded: Graceful degradation with user notification
- Parse errors: Fallback to empty task list with backup attempt
- Missing localStorage: In-memory operation with warning

### Operational Errors

- Task not found: "Task with ID {id} not found"
- Duplicate ID: Auto-generate new UUID and retry
- Concurrent updates: Last-write-wins with timestamp comparison

## Performance Considerations

### Memory Efficiency

- Task array stored directly (no nested objects)
- Lazy loading not needed (<1000 tasks)
- Simple object references for UI binding

### Storage Efficiency

- JSON compression via built-in browser optimization
- Minimal redundant data storage
- Periodic cleanup of completed tasks (optional feature)

### Update Patterns

- Batch operations where possible
- Minimal DOM updates on state changes
- Debounced localStorage writes (100ms)

## Migration Strategy

### Version 1.0 Schema

Current schema as defined above

### Future Compatibility

- Version field in metadata for schema migrations
- Backward-compatible additions (optional fields)
- Export/import capability for data portability

**Ready for**: Contract generation and API design
