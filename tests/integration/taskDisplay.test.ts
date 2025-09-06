import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('Integration: Task List Display (FR-002)', () => {
  beforeEach(() => {
    // This test MUST FAIL until UI implementation exists
    document.body.innerHTML = '<div id="app"></div>';
  });

  it('should display all tasks in readable list format', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    // Add multiple tasks
    const tasks = ['Buy groceries', 'Complete documentation', 'Review code'];

    for (const task of tasks) {
      await user.type(input, task);
      await user.click(addButton);
      await user.clear(input);
    }

    // Verify all tasks are displayed
    tasks.forEach((task) => {
      expect(screen.getByText(task)).toBeInTheDocument();
    });

    // Check list structure
    const taskList = screen.getByRole('list') || screen.getByTestId('task-list');
    expect(taskList).toBeInTheDocument();

    const taskItems = screen.getAllByRole('listitem') || screen.getAllByTestId(/task-item/);
    expect(taskItems).toHaveLength(tasks.length);
  });

  it('should make task descriptions clearly visible', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    await user.type(input, 'Clearly visible task');
    await user.click(addButton);

    const taskText = screen.getByText('Clearly visible task');
    const styles = getComputedStyle(taskText);

    // Verify readable styling
    expect(taskText).toBeVisible();
    expect(styles.fontSize).not.toBe('0px');
    expect(styles.visibility).not.toBe('hidden');
    expect(styles.opacity).not.toBe('0');
  });

  it('should show visual distinction between task elements', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    // Add task
    await user.type(input, 'Test task');
    await user.click(addButton);

    const taskItem = screen.getByTestId(/task-item/);
    const checkbox = screen.getByRole('checkbox');
    const taskText = screen.getByText('Test task');

    // Verify elements are distinct
    expect(checkbox).toBeInTheDocument();
    expect(taskText).toBeInTheDocument();
    expect(taskItem).toContainElement(checkbox);
    expect(taskItem).toContainElement(taskText);
  });

  it('should be easy to scan and understand', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    // Add tasks with different states
    await user.type(input, 'Incomplete task');
    await user.click(addButton);

    await user.clear(input);
    await user.type(input, 'Another task');
    await user.click(addButton);

    // Toggle one task
    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    await user.click(firstCheckbox);

    // Verify list is scannable
    const taskItems = screen.getAllByTestId(/task-item/);
    expect(taskItems).toHaveLength(2);

    // Check that tasks have consistent structure
    taskItems.forEach((item) => {
      expect(item).toContainElement(item.querySelector('input[type="checkbox"]')!);
      expect(item.textContent).toBeTruthy();
    });
  });
});
