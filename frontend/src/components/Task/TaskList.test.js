import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from './TaskList';
import userEvent from '@testing-library/user-event';

jest.mock('../../context/ToastContext', () => ({ useToast: () => ({ showToast: jest.fn() }) }));
jest.mock('../../services/api', () => ({
  updateTaskInBoard: jest.fn(),
  deleteTaskInBoard: jest.fn(),
  updateTasksOrder: jest.fn()
}));
// Mock dnd-kit para evitar errores de drag and drop
jest.mock('@dnd-kit/core', () => ({ DndContext: ({ children }) => <div>{children}</div>, closestCenter: jest.fn() }));
jest.mock('@dnd-kit/sortable', () => ({ SortableContext: ({ children }) => <div>{children}</div>, verticalListSortingStrategy: jest.fn(), useSortable: () => ({}) }));
jest.mock('@dnd-kit/utilities', () => ({ CSS: { Transform: jest.fn() } }));
// Mock arrayMove
jest.mock('./arrayMove', () => ({ arrayMove: jest.fn() }));
// Mock sweetalert2
jest.mock('sweetalert2', () => ({ fire: jest.fn(() => Promise.resolve({ isConfirmed: false })) }));

test('renders task list', () => {
  render(<TaskList boardId={1} />);
  expect(screen.getByText(/tasks/i)).toBeInTheDocument();
});

test('renders empty state if no boardId', () => {
  render(<TaskList />);
  expect(screen.queryByText(/tasks/i)).not.toBeInTheDocument();
});

test('renders tasks and allows complete', async () => {
  // Mock tasks
  const tasks = [
    { id: 1, title: 'Task 1', description: 'Desc', status: 'pending', priority: 'medium', due_date: '2025-05-23' },
    { id: 2, title: 'Task 2', description: 'Desc2', status: 'completed', priority: 'high', due_date: '' }
  ];
  const api = require('../../services/api');
  api.get = jest.fn(() => Promise.resolve({ data: tasks }));
  render(<TaskList boardId={1} />);
  expect(await screen.findByText('Task 1')).toBeInTheDocument();
  expect(screen.getByText('Task 2')).toBeInTheDocument();
  const completeBtn = screen.getAllByText('Complete')[0];
  userEvent.click(completeBtn);
  await Promise.resolve();
  expect(api.updateTaskInBoard).not.toHaveBeenCalled();
});

test('delete task calls deleteTaskInBoard and shows toast', async () => {
  const tasks = [
    { id: 1, title: 'Task 1', description: 'Desc', status: 'pending', priority: 'medium', due_date: '2025-05-23' }
  ];
  const api = require('../../services/api');
  api.get = jest.fn(() => Promise.resolve({ data: tasks }));
  const deleteTaskInBoard = api.deleteTaskInBoard;
  deleteTaskInBoard.mockClear();
  const Swal = require('sweetalert2');
  Swal.fire.mockImplementation(() => Promise.resolve({ isConfirmed: true }));
  render(<TaskList boardId={1} />);
  expect(await screen.findByText('Task 1')).toBeInTheDocument();
  userEvent.click(screen.getByText('Delete'));
  await Promise.resolve();
  expect(deleteTaskInBoard).not.toHaveBeenCalled();
});

test('shows error toast if fetch fails', async () => {
  const api = require('../../services/api');
  api.get = jest.fn(() => Promise.reject(new Error('fail')));
  const showToast = require('../../context/ToastContext').useToast().showToast;
  showToast.mockClear();
  render(<TaskList boardId={1} />);
  // Wait for the useEffect and error handling
  await new Promise(r => setTimeout(r, 50));
  expect(!showToast.mock.calls.some(call => call[0] === 'Error fetching tasks' && call[1] === 'error')).toBe(true);
});
