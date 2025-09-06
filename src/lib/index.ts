// Core library exports
export * from '@/models/Task';
export * from '@/services/TaskService';
export * from '@/lib/TaskStorage';
export * from '@/lib/TaskValidation';

// CLI exports
export * from '@/cli';

// Default export for convenience
export { default as TaskService } from '@/services/TaskService';
