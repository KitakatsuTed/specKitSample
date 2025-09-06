import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('Integration: Visual Status Distinction (FR-005)', () => {
  beforeEach(() => {
    // This test MUST FAIL until UI implementation exists
    document.body.innerHTML = '<div id="app"></div>';
  });

  it('should visually distinguish between complete and incomplete tasks', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    // Add tasks
    await user.type(input, 'Task A');
    await user.click(addButton);
    await user.clear(input);

    await user.type(input, 'Task B');
    await user.click(addButton);
    await user.clear(input);

    await user.type(input, 'Task C');
    await user.click(addButton);

    // Complete only "Task B"
    const checkboxB = screen.getByRole('checkbox', { name: /task b/i });
    await user.click(checkboxB);

    // Get task elements
    const taskAText = screen.getByText('Task A');
    const taskBText = screen.getByText('Task B');
    const taskCText = screen.getByText('Task C');

    // Check visual distinctions
    const taskAStyles = getComputedStyle(taskAText);
    const taskBStyles = getComputedStyle(taskBText);
    const taskCStyles = getComputedStyle(taskCText);

    // Completed task (B) should be visually distinct
    expect(taskBStyles.textDecoration).toContain('line-through');

    // Incomplete tasks (A, C) should maintain original appearance
    expect(taskAStyles.textDecoration).not.toContain('line-through');
    expect(taskCStyles.textDecoration).not.toContain('line-through');

    // Or check for CSS classes
    const taskBItem = taskBText.closest('[data-testid*="task-item"]');
    const taskAItem = taskAText.closest('[data-testid*="task-item"]');

    expect(taskBItem).toHaveClass(/completed|done/);
    expect(taskAItem).not.toHaveClass(/completed|done/);
  });

  it('should make status immediately recognizable', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    await user.type(input, 'Recognizable task');
    await user.click(addButton);

    const checkbox = screen.getByRole('checkbox', { name: /recognizable task/i });
    const taskText = screen.getByText('Recognizable task');

    // Initially incomplete - should be clearly incomplete
    expect(checkbox).not.toBeChecked();

    // Complete the task
    await user.click(checkbox);

    // Should be clearly complete
    expect(checkbox).toBeChecked();

    // Visual distinction should be immediate and obvious
    const completedStyles = getComputedStyle(taskText);
    expect(
      completedStyles.textDecoration.includes('line-through') ||
        completedStyles.opacity !== '1' ||
        completedStyles.color !== taskText.style.color
    ).toBe(true);
  });

  it('should show no ambiguity about task completion state', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    // Add multiple tasks with different completion states
    const tasks = [
      { text: 'Incomplete 1', completed: false },
      { text: 'Completed 1', completed: true },
      { text: 'Incomplete 2', completed: false },
      { text: 'Completed 2', completed: true },
    ];

    // Add all tasks
    for (const task of tasks) {
      await user.type(input, task.text);
      await user.click(addButton);
      await user.clear(input);

      if (task.completed) {
        const checkbox = screen.getByRole('checkbox', { name: new RegExp(task.text, 'i') });
        await user.click(checkbox);
      }
    }

    // Verify each task's state is unambiguous
    for (const task of tasks) {
      const checkbox = screen.getByRole('checkbox', { name: new RegExp(task.text, 'i') });
      const taskText = screen.getByText(task.text);

      if (task.completed) {
        expect(checkbox).toBeChecked();
        // Should have completed styling
        const styles = getComputedStyle(taskText);
        expect(styles.textDecoration).toContain('line-through');
      } else {
        expect(checkbox).not.toBeChecked();
        // Should NOT have completed styling
        const styles = getComputedStyle(taskText);
        expect(styles.textDecoration).not.toContain('line-through');
      }
    }
  });

  it('should maintain visual consistency across tasks', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    // Add multiple incomplete tasks
    const incompleteTasks = ['Incomplete A', 'Incomplete B', 'Incomplete C'];
    for (const task of incompleteTasks) {
      await user.type(input, task);
      await user.click(addButton);
      await user.clear(input);
    }

    // Complete all tasks
    for (const task of incompleteTasks) {
      const checkbox = screen.getByRole('checkbox', { name: new RegExp(task, 'i') });
      await user.click(checkbox);
    }

    // Verify all completed tasks have consistent styling
    const completedTaskTexts = incompleteTasks.map((task) => screen.getByText(task));
    const firstTaskStyles = getComputedStyle(completedTaskTexts[0]);

    completedTaskTexts.slice(1).forEach((taskText) => {
      const styles = getComputedStyle(taskText);
      expect(styles.textDecoration).toBe(firstTaskStyles.textDecoration);

      // Check for consistent completed class/attributes
      const taskItem = taskText.closest('[data-testid*="task-item"]');
      const firstTaskItem = completedTaskTexts[0].closest('[data-testid*="task-item"]');

      expect(taskItem?.className).toBe(firstTaskItem?.className);
    });
  });

  it('should use multiple visual indicators for accessibility', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    await user.type(input, 'Accessible task');
    await user.click(addButton);

    const checkbox = screen.getByRole('checkbox', { name: /accessible task/i });
    await user.click(checkbox);

    const taskText = screen.getByText('Accessible task');
    const taskItem = taskText.closest('[data-testid*="task-item"]');

    // Should have multiple visual indicators:
    // 1. Checkbox checked state
    expect(checkbox).toBeChecked();

    // 2. Text styling (strikethrough)
    const styles = getComputedStyle(taskText);
    expect(styles.textDecoration).toContain('line-through');

    // 3. CSS class for additional styling
    expect(taskItem).toHaveClass(/completed|done/);

    // 4. Possible color change or opacity
    expect(styles.opacity !== '1' || styles.color !== 'initial').toBe(true);
  });
});
