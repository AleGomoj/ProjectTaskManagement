import React from 'react';
import { render, screen } from '@testing-library/react';
import BoardList from './BoardList';

jest.mock('../../context/ToastContext', () => ({ useToast: () => ({ showToast: jest.fn() }) }));
jest.mock('../../services/api', () => ({
  fetchBoards: jest.fn(() => Promise.resolve([])),
  createBoard: jest.fn(),
  updateBoard: jest.fn(),
  deleteBoard: jest.fn(),
  updateBoardsOrder: jest.fn()
}));

// Mock dnd-kit para evitar errores de drag and drop
jest.mock('@dnd-kit/core', () => ({ DndContext: ({ children }) => <div>{children}</div>, closestCenter: jest.fn() }));
jest.mock('@dnd-kit/sortable', () => ({ SortableContext: ({ children }) => <div>{children}</div>, verticalListSortingStrategy: jest.fn(), useSortable: () => ({}) }));
jest.mock('@dnd-kit/utilities', () => ({ CSS: { Transform: jest.fn() } }));

// Mock TaskList y TaskForm para que no fallen los imports
jest.mock('../Task/TaskList', () => () => <div>TaskList</div>);
jest.mock('../Task/TaskForm', () => () => <div>TaskForm</div>);

// Mock sweetalert2
jest.mock('sweetalert2', () => ({ fire: jest.fn(() => Promise.resolve({ isConfirmed: false })) }));

test('renders board list', async () => {
  render(<BoardList />);
  const createBoardButton = await screen.findByRole('button', { name: /create board/i });
  expect(createBoardButton).toBeInTheDocument();
});
