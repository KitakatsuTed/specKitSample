import type { Task, ValidationResult } from '@/models/Task';

/**
 * Validates a task description
 * @param description - The description to validate
 * @returns Validation result with isValid flag and error messages
 */
export function validateDescription(description: string): ValidationResult {
  const errors: string[] = [];

  if (!description || description.trim().length === 0) {
    errors.push('Task description cannot be empty');
  }

  if (description.length > 500) {
    errors.push('Task description must be less than 500 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a task object (partial or complete)
 * @param task - The task object to validate
 * @returns Validation result with isValid flag and error messages
 */
export function validateTask(task: Partial<Task>): ValidationResult {
  const errors: string[] = [];

  if (task.id && !isValidUUID(task.id)) {
    errors.push('Task ID must be a valid UUID');
  }

  if (task.description !== undefined) {
    const descValidation = validateDescription(task.description);
    if (!descValidation.isValid) {
      errors.push(...descValidation.errors);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
