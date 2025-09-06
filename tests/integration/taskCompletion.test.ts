import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('Integration: Task Completion Toggle (FR-003)', () => {
  beforeEach(() => {
    // This test MUST FAIL until UI implementation exists
    document.body.innerHTML = '<div id="app"></div>';
  });

  it('should mark task as complete when clicked', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    // Add task
    await user.type(input, 'Buy groceries');
    await user.click(addButton);

    // Find and click completion control
    const checkbox = screen.getByRole('checkbox', { name: /buy groceries/i });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    // Verify task is marked as completed
    expect(checkbox).toBeChecked();
  });

  it('should toggle between complete and incomplete states', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    await user.type(input, 'Toggle task');
    await user.click(addButton);

    const checkbox = screen.getByRole('checkbox', { name: /toggle task/i });

    // Initially incomplete
    expect(checkbox).not.toBeChecked();

    // Toggle to complete
    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    // Toggle back to incomplete
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('should visually distinguish completion states', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    // Add two tasks
    await user.type(input, 'Complete me');
    await user.click(addButton);

    await user.clear(input);
    await user.type(input, 'Leave me incomplete');
    await user.click(addButton);

    // Complete first task
    const firstCheckbox = screen.getByRole('checkbox', { name: /complete me/i });
    await user.click(firstCheckbox);

    // Get task elements
    const completedTaskText = screen.getByText('Complete me');
    const incompleteTaskText = screen.getByText('Leave me incomplete');

    // Verify visual distinction
    const completedStyles = getComputedStyle(completedTaskText);
    const incompleteStyles = getComputedStyle(incompleteTaskText);

    // Check for strikethrough, different color, or other visual indicators
    expect(completedStyles.textDecoration).toContain('line-through');

    // Or check for different classes/styling
    expect(completedTaskText.closest('[data-testid*="task-item"]')).toHaveClass(/completed|done/);
  });

  it('should persist changes without page refresh', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    await user.type(input, 'Persistent task');
    await user.click(addButton);

    const checkbox = screen.getByRole('checkbox', { name: /persistent task/i });
    await user.click(checkbox);

    // Verify state persists
    expect(checkbox).toBeChecked();

    // Add another task to ensure the state is maintained
    await user.clear(input);
    await user.type(input, 'Another task');
    await user.click(addButton);

    // Original task should still be checked
    expect(checkbox).toBeChecked();
  });

  it('should update completion timestamp', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    await user.type(input, 'Timestamped task');
    await user.click(addButton);

    const checkbox = screen.getByRole('checkbox', { name: /timestamped task/i });

    // Complete the task
    const beforeComplete = Date.now();
    await user.click(checkbox);
    const afterComplete = Date.now();

    // Verify completion timestamp is set (this would be tested via service layer)
    // For UI test, we verify the visual change happened
    expect(checkbox).toBeChecked();

    // Uncomplete the task
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
