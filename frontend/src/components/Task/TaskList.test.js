import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from './TaskList';

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
