import React from 'react';
import { render, screen } from '@testing-library/react';
import BoardList from './BoardList';
import { act } from 'react';

jest.mock('../../context/ToastContext', () => ({ useToast: () => ({ showToast: jest.fn() }) }));
jest.mock('../../services/api', () => ({
  fetchBoards: jest.fn(() => Promise.resolve([])),
  createBoard: jest.fn(),
  updateBoard: jest.fn(),
  deleteBoard: jest.fn(),
  updateBoardsOrder: jest.fn()
}));

// Mock dnd-kit to avoid drag and drop errors
jest.mock('@dnd-kit/core', () => ({ DndContext: ({ children }) => <div>{children}</div>, closestCenter: jest.fn() }));
jest.mock('@dnd-kit/sortable', () => ({ SortableContext: ({ children }) => <div>{children}</div>, verticalListSortingStrategy: jest.fn(), useSortable: () => ({}) }));
jest.mock('@dnd-kit/utilities', () => ({ CSS: { Transform: jest.fn() } }));

// Mock TaskList and TaskForm to prevent import errors
jest.mock('../Task/TaskList', () => () => <div>TaskList</div>);
jest.mock('../Task/TaskForm', () => () => <div>TaskForm</div>);

// Mock sweetalert2
jest.mock('sweetalert2', () => ({ fire: jest.fn(() => Promise.resolve({ isConfirmed: true })) }));

test('renders board list', async () => {
  render(<BoardList />);
  const createBoardButton = await screen.findByRole('button', { name: /create board/i });
  expect(createBoardButton).toBeInTheDocument();
});

test('shows boards if fetchBoards returns data', async () => {
  const boards = [
    { id: 1, name: 'Board 1', description: 'Desc 1' },
    { id: 2, name: 'Board 2', description: 'Desc 2' }
  ];
  require('../../services/api').fetchBoards.mockResolvedValueOnce(boards);
  render(<BoardList />);
  expect(await screen.findByText('Board 1')).toBeInTheDocument();
  expect(screen.getByText('Board 2')).toBeInTheDocument();
});

test('can open and close the create board form', async () => {
  // Patch fetchBoards to return an empty array so boards is always defined
  require('../../services/api').fetchBoards.mockResolvedValueOnce([]);
  render(<BoardList />);
  const createBtn = await screen.findByRole('button', { name: /create board/i });
  await act(async () => {
    createBtn.click();
  });
  expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
  await act(async () => {
    screen.getByText(/cancel/i).click();
  });
  expect(screen.queryByPlaceholderText(/name/i)).not.toBeInTheDocument();
});

test('can edit a board', async () => {
  const boards = [{ id: 1, name: 'Board 1', description: 'Desc 1' }];
  require('../../services/api').fetchBoards.mockResolvedValueOnce(boards);
  // Patch updateBoard to resolve to a valid board object
  require('../../services/api').updateBoard.mockResolvedValueOnce({ id: 1, name: 'New name', description: 'Desc 1' });
  render(<BoardList />);
  expect(await screen.findByText('Board 1')).toBeInTheDocument();
  await act(async () => {
    screen.getByText(/edit/i).click();
  });
  const nameInput = screen.getByPlaceholderText(/name/i);
  await act(async () => {
    nameInput.value = 'New name';
    screen.getByText(/save/i).click();
    // flush microtasks
    await Promise.resolve();
  });
  expect(require('../../services/api').updateBoard).toHaveBeenCalled();
});

test('can delete a board', async () => {
  const boards = [{ id: 1, name: 'Board 1', description: 'Desc 1' }];
  const deleteBoardMock = require('../../services/api').deleteBoard;
  deleteBoardMock.mockClear();
  require('../../services/api').fetchBoards.mockResolvedValueOnce(boards);
  // Patch SweetAlert2 mock to return an object always
  const Swal = require('sweetalert2');
  Swal.fire.mockImplementation(() => Promise.resolve({ isConfirmed: true }));
  render(<BoardList />);
  expect(await screen.findByText('Board 1')).toBeInTheDocument();
  await act(async () => {
    screen.getByText(/delete/i).click();
    // flush microtasks
    await Promise.resolve();
  });
  expect(deleteBoardMock).toHaveBeenCalled();
});
