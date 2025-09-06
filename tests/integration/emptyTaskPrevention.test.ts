import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('Integration: Empty Task Prevention (FR-006)', () => {
  beforeEach(() => {
    // This test MUST FAIL until UI implementation exists
    document.body.innerHTML = '<div id="app"></div>';
  });

  it('should prevent adding empty tasks', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add/i });

    // Try to submit empty task
    await user.click(addButton);

    // Verify no task was added
    const taskItems = screen.queryAllByTestId(/task-item/);
    expect(taskItems).toHaveLength(0);

    // Should show appropriate feedback
    const errorMessage = screen.queryByText(/cannot be empty|required|enter.*task/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('should prevent adding whitespace-only tasks', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add/i });

    // Try to submit whitespace-only task
    await user.type(input, '   ');
    await user.click(addButton);

    // Verify no task was added
    const taskItems = screen.queryAllByTestId(/task-item/);
    expect(taskItems).toHaveLength(0);

    // Should show appropriate feedback
    const errorMessage = screen.queryByText(/cannot be empty|whitespace|enter.*task/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('should clear input after failed submission', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add/i });

    // Try empty submission
    await user.click(addButton);
    expect(input).toHaveValue('');

    // Try whitespace submission
    await user.type(input, '   ');
    await user.click(addButton);
    expect(input).toHaveValue('');
  });

  it('should show clear feedback about invalid input', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add/i });

    // Try empty submission
    await user.click(addButton);

    // Should show error message
    let errorMessage = screen.getByText(
      /task description cannot be empty|please enter a task|required/i
    );
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toBeVisible();

    // Error message should be styled appropriately
    const errorStyles = getComputedStyle(errorMessage);
    expect(errorStyles.color).toMatch(/(red|error)/i);

    // Try whitespace submission
    await user.type(input, '   ');
    await user.click(addButton);

    errorMessage = screen.getByText(
      /task description cannot be empty|whitespace|please enter a task/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it('should work normally after failed attempts', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add/i });

    // Try empty submission
    await user.click(addButton);
    expect(screen.queryAllByTestId(/task-item/)).toHaveLength(0);

    // Try whitespace submission
    await user.type(input, '   ');
    await user.click(addButton);
    expect(screen.queryAllByTestId(/task-item/)).toHaveLength(0);

    // Now add valid task
    await user.type(input, 'Valid task');
    await user.click(addButton);

    // Should work normally
    expect(screen.getByText('Valid task')).toBeInTheDocument();
    expect(screen.getAllByTestId(/task-item/)).toHaveLength(1);
    expect(input).toHaveValue('');

    // Error message should be cleared
    expect(screen.queryByText(/cannot be empty|required|enter.*task/i)).not.toBeInTheDocument();
  });

  it('should prevent submission on Enter key with empty input', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add.*task/i);

    // Try to submit empty with Enter
    await user.keyboard('{Enter}');

    // Should not add task
    expect(screen.queryAllByTestId(/task-item/)).toHaveLength(0);

    // Try with whitespace
    await user.type(input, '   ');
    await user.keyboard('{Enter}');

    // Should not add task
    expect(screen.queryAllByTestId(/task-item/)).toHaveLength(0);

    // Should show error feedback
    const errorMessage = screen.queryByText(/cannot be empty|required|enter.*task/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('should handle mixed whitespace patterns', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add/i });

    const invalidInputs = [
      '', // Empty
      ' ', // Single space
      '   ', // Multiple spaces
      '\t', // Tab
      '\n', // Newline
      ' \t \n ', // Mixed whitespace
    ];

    for (const invalidInput of invalidInputs) {
      await user.clear(input);
      await user.type(input, invalidInput);
      await user.click(addButton);

      // Should not add task
      expect(screen.queryAllByTestId(/task-item/)).toHaveLength(0);

      // Should show error
      expect(screen.queryByText(/cannot be empty|required|enter.*task/i)).toBeInTheDocument();
    }

    // Valid input should still work
    await user.clear(input);
    await user.type(input, 'Valid task after many failures');
    await user.click(addButton);

    expect(screen.getByText('Valid task after many failures')).toBeInTheDocument();
  });

  it('should trim whitespace from valid inputs', async () => {
    await import('@/main');

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add/i });

    // Input with leading/trailing whitespace
    await user.type(input, '  Valid task with spaces  ');
    await user.click(addButton);

    // Should add task with trimmed text
    expect(screen.getByText('Valid task with spaces')).toBeInTheDocument();
    expect(screen.queryByText('  Valid task with spaces  ')).not.toBeInTheDocument();
  });
});
