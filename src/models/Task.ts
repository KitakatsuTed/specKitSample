export interface Task {
  id: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface TaskList {
  tasks: Task[];
  lastModified: Date;
}

export interface ExportData {
  tasks: Task[];
  exportedAt?: string;
  version?: string;
}

export interface ImportData {
  tasks: Task[];
  merge?: boolean;
}

export interface ImportResult {
  imported: number;
  skipped: number;
}

export interface UpdateTaskRequest {
  completed?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
