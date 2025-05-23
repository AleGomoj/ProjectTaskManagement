import { render, screen } from '@testing-library/react';
import TaskForm from './TaskForm';

jest.mock('../../services/api', () => ({ createTaskInBoard: jest.fn(), updateTaskInBoard: jest.fn() }));
jest.mock('../../context/ToastContext', () => ({ useToast: () => ({ showToast: jest.fn() }) }));

test('renders task form', () => {
  render(<TaskForm boardId={1} />);
  expect(screen.getByText(/save task/i)).toBeInTheDocument();
});
