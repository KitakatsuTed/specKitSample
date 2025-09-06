import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('Integration: Task Deletion (FR-004)', () => {
  beforeEach(() => {
    // This test MUST FAIL until UI implementation exists
    document.body.innerHTML = '<div id="app"></div>';
  });

  it('should remove task from list immediately', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    // Add tasks
    await user.type(input, 'Task to delete');
    await user.click(addButton);

    await user.clear(input);
    await user.type(input, 'Task to keep');
    await user.click(addButton);

    // Find and click delete button for first task
    const deleteButtons = screen.getAllByRole('button', { name: /delete|remove/i });
    expect(deleteButtons).toHaveLength(2);

    await user.click(deleteButtons[0]);

    // Verify task is removed
    expect(screen.queryByText('Task to delete')).not.toBeInTheDocument();
    expect(screen.getByText('Task to keep')).toBeInTheDocument();
  });

  it('should handle deletion of completed and incomplete tasks', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    // Add two tasks
    await user.type(input, 'Completed task');
    await user.click(addButton);

    await user.clear(input);
    await user.type(input, 'Incomplete task');
    await user.click(addButton);

    // Complete first task
    const checkbox = screen.getByRole('checkbox', { name: /completed task/i });
    await user.click(checkbox);

    // Delete the completed task
    const deleteButtons = screen.getAllByRole('button', { name: /delete|remove/i });
    await user.click(deleteButtons[0]); // First task (completed)

    // Verify completed task is deleted, incomplete task remains
    expect(screen.queryByText('Completed task')).not.toBeInTheDocument();
    expect(screen.getByText('Incomplete task')).toBeInTheDocument();

    // Delete remaining task
    const remainingDeleteButton = screen.getByRole('button', { name: /delete|remove/i });
    await user.click(remainingDeleteButton);

    // Verify empty state
    expect(screen.queryByText('Incomplete task')).not.toBeInTheDocument();
  });

  it('should return to empty state when all tasks deleted', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    // Add single task
    await user.type(input, 'Only task');
    await user.click(addButton);

    // Delete it
    const deleteButton = screen.getByRole('button', { name: /delete|remove/i });
    await user.click(deleteButton);

    // Verify empty state
    expect(screen.queryByText('Only task')).not.toBeInTheDocument();

    // Check for empty state message or clean list
    const taskItems = screen.queryAllByTestId(/task-item/);
    expect(taskItems).toHaveLength(0);

    // Should show empty state message or clean interface
    const emptyMessage = screen.queryByText(/no tasks|empty|add your first task/i);
    expect(emptyMessage || screen.getByPlaceholderText(/add.*task/i)).toBeInTheDocument();
  });

  it('should update list correctly after removal', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    // Add multiple tasks
    const tasks = ['Task 1', 'Task 2', 'Task 3'];
    for (const task of tasks) {
      await user.type(input, task);
      await user.click(addButton);
      await user.clear(input);
    }

    // Verify all tasks present
    expect(screen.getAllByTestId(/task-item/)).toHaveLength(3);

    // Delete middle task
    const deleteButtons = screen.getAllByRole('button', { name: /delete|remove/i });
    await user.click(deleteButtons[1]); // Delete "Task 2"

    // Verify list updates correctly
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
    expect(screen.getAllByTestId(/task-item/)).toHaveLength(2);
  });

  it('should not require confirmation for simple deletion', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByText(/add/i);

    await user.type(input, 'Quick delete');
    await user.click(addButton);

    const deleteButton = screen.getByRole('button', { name: /delete|remove/i });

    // Click delete - should work immediately without confirmation
    await user.click(deleteButton);

    // Task should be gone immediately
    expect(screen.queryByText('Quick delete')).not.toBeInTheDocument();

    // No confirmation dialog should appear
    expect(screen.queryByText(/are you sure|confirm|cancel/i)).not.toBeInTheDocument();
  });
});
