import { getTasks, createTask, updateTask, deleteTask } from '@/services/TaskService';
import type { Task } from '@/models/Task';

/**
 * Controls the Todo application user interface
 * Handles DOM manipulation, event listeners, and UI updates
 */
export class UIController {
  private taskListElement: HTMLElement | null = null;
  private taskInputElement: HTMLInputElement | null = null;
  private addButtonElement: HTMLButtonElement | null = null;
  private errorMessageElement: HTMLElement | null = null;

  /**
   * Creates a new UIController instance
   * @param containerId - ID of the container element to render the app into
   */
  constructor(private containerId: string = 'app') {}

  /**
   * Initializes the UI controller
   * Renders the interface and sets up event listeners
   */
  init(): void {
    const container = document.getElementById(this.containerId);
    if (!container) {
      throw new Error(`Container element with ID '${this.containerId}' not found`);
    }

    this.render(container);
    this.attachEventListeners();
    this.refreshTaskList();
  }

  private render(container: HTMLElement): void {
    container.innerHTML = `
      <div class="todo-app">
        <header>
          <h1>📝 Simple ToDo App</h1>
        </header>
        
        <div class="task-input-section">
          <div class="input-group">
            <input 
              type="text" 
              id="task-input" 
              placeholder="Add a new task..."
              maxlength="500"
            />
            <button type="button" id="add-button">Add</button>
          </div>
          <div id="error-message" class="error-message" style="display: none;"></div>
        </div>
        
        <main>
          <div id="task-list" class="task-list" role="list"></div>
          <div id="empty-state" class="empty-state" style="display: none;">
            <p>🎉 No tasks yet! Add your first task above.</p>
          </div>
        </main>
      </div>
    `;

    // Cache elements
    this.taskListElement = container.querySelector('#task-list');
    this.taskInputElement = container.querySelector('#task-input');
    this.addButtonElement = container.querySelector('#add-button');
    this.errorMessageElement = container.querySelector('#error-message');
  }

  private attachEventListeners(): void {
    // Add task on button click
    this.addButtonElement?.addEventListener('click', () => {
      this.handleAddTask();
    });

    // Add task on Enter key
    this.taskInputElement?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleAddTask();
      }
    });

    // Clear error message when user starts typing
    this.taskInputElement?.addEventListener('input', () => {
      this.clearErrorMessage();
    });
  }

  private handleAddTask(): void {
    const input = this.taskInputElement;
    if (!input) return;

    const description = input.value.trim();

    if (!description) {
      this.showErrorMessage('Task description cannot be empty');
      return;
    }

    try {
      createTask(description);
      input.value = '';
      this.clearErrorMessage();
      this.refreshTaskList();
    } catch (error) {
      this.showErrorMessage((error as Error).message);
    }
  }

  private handleToggleTask(taskId: string): void {
    try {
      const tasks = getTasks();
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        updateTask(taskId, { completed: !task.completed });
        this.refreshTaskList();
      }
    } catch (error) {
      this.showErrorMessage((error as Error).message);
    }
  }

  private handleDeleteTask(taskId: string): void {
    try {
      deleteTask(taskId);
      this.refreshTaskList();
    } catch (error) {
      this.showErrorMessage((error as Error).message);
    }
  }

  private refreshTaskList(): void {
    if (!this.taskListElement) return;

    const tasks = getTasks();
    const emptyState = document.getElementById('empty-state');

    if (tasks.length === 0) {
      this.taskListElement.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    this.taskListElement.style.display = 'block';

    this.taskListElement.innerHTML = tasks.map((task) => this.createTaskElement(task)).join('');

    // Attach event listeners to new elements
    this.attachTaskEventListeners();
  }

  private createTaskElement(task: Task): string {
    const completedClass = task.completed ? 'completed' : '';
    const checkedAttr = task.completed ? 'checked' : '';

    return `
      <div class="task-item ${completedClass}" data-testid="task-item-${task.id}" role="listitem">
        <div class="task-content">
          <input 
            type="checkbox" 
            id="task-${task.id}"
            ${checkedAttr}
            data-task-id="${task.id}"
            aria-label="${task.description}"
          />
          <label for="task-${task.id}" class="task-description">
            ${this.escapeHtml(task.description)}
          </label>
        </div>
        <div class="task-actions">
          <button 
            type="button" 
            class="delete-button"
            data-task-id="${task.id}"
            aria-label="Delete ${task.description}"
          >
            🗑️
          </button>
        </div>
      </div>
    `;
  }

  private attachTaskEventListeners(): void {
    // Toggle task completion
    const checkboxes = this.taskListElement?.querySelectorAll('input[type="checkbox"]');
    checkboxes?.forEach((checkbox) => {
      checkbox.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const taskId = target.getAttribute('data-task-id');
        if (taskId) {
          this.handleToggleTask(taskId);
        }
      });
    });

    // Delete tasks
    const deleteButtons = this.taskListElement?.querySelectorAll('.delete-button');
    deleteButtons?.forEach((button) => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        const taskId = target.getAttribute('data-task-id');
        if (taskId) {
          this.handleDeleteTask(taskId);
        }
      });
    });
  }

  private showErrorMessage(message: string): void {
    if (this.errorMessageElement) {
      this.errorMessageElement.textContent = message;
      this.errorMessageElement.style.display = 'block';
    }
  }

  private clearErrorMessage(): void {
    if (this.errorMessageElement) {
      this.errorMessageElement.style.display = 'none';
      this.errorMessageElement.textContent = '';
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Public methods for programmatic control
  public addTask(description: string): void {
    if (this.taskInputElement) {
      this.taskInputElement.value = description;
      this.handleAddTask();
    }
  }

  public refresh(): void {
    this.refreshTaskList();
  }
}
