import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('Integration: Task Creation (FR-001)', () => {
  beforeEach(() => {
    // This test MUST FAIL until UI implementation exists
    document.body.innerHTML = '<div id="app"></div>';
  });

  it('should add new task when user types and submits', async () => {
    // Load the main application
    const { initializeApp } = await import('@/main');
    initializeApp();

    const user = userEvent.setup();

    // Locate task input field
    const input = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add/i });

    // Type "Buy groceries" and submit
    await user.type(input, 'Buy groceries');
    await user.click(addButton);

    // Verify task appears in list with incomplete status
    const taskElement = screen.getByText('Buy groceries');
    expect(taskElement).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox', { name: /buy groceries/i });
    expect(checkbox).not.toBeChecked();
  });

  it('should add multiple tasks in chronological order', async () => {
    const { initializeApp } = await import('@/main');
    initializeApp();

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    // Add first task
    await user.type(input, 'Buy groceries');
    await user.click(addButton);

    // Add second task
    await user.clear(input);
    await user.type(input, 'Complete project documentation');
    await user.click(addButton);

    // Verify both tasks visible
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByText('Complete project documentation')).toBeInTheDocument();

    // Check chronological order (newest first)
    const taskElements = screen.getAllByTestId(/task-item/);
    expect(taskElements[0]).toHaveTextContent('Complete project documentation');
    expect(taskElements[1]).toHaveTextContent('Buy groceries');
  });

  it('should submit task on Enter key press', async () => {
    const { initializeApp } = await import('@/main');
    initializeApp();

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);

    await user.type(input, 'Task via Enter');
    await user.keyboard('{Enter}');

    expect(screen.getByText('Task via Enter')).toBeInTheDocument();
    expect(input).toHaveValue(''); // Input should be cleared
  });

  it('should clear input field after successful submission', async () => {
    const { initializeApp } = await import('@/main');
    initializeApp();

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await user.type(input, 'Test task');
    await user.click(addButton);

    expect(input).toHaveValue('');
  });
});
