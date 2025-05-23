import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';
import { DarkModeProvider } from '../context/DarkModeContext';

jest.mock('react-router-dom', () => ({ Link: ({ children }) => <div>{children}</div>, useLocation: () => ({ pathname: '/' }) }));
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: false }))
}));

test('renders sidebar', () => {
  render(
    <DarkModeProvider>
      <Sidebar />
    </DarkModeProvider>
  );
  expect(screen.getByText(/home/i)).toBeInTheDocument();
});

test('renders all navigation items', () => {
  render(
    <DarkModeProvider>
      <Sidebar />
    </DarkModeProvider>
  );
  expect(screen.getByText(/home/i)).toBeInTheDocument();
  expect(screen.getByText(/tasks/i)).toBeInTheDocument();
  expect(screen.getByText(/users/i)).toBeInTheDocument();
  expect(screen.getByText(/profile/i)).toBeInTheDocument();
});

test('renders dark mode toggle button', () => {
  render(
    <DarkModeProvider>
      <Sidebar />
    </DarkModeProvider>
  );
  expect(screen.getByRole('button', { name: /toggle dark mode/i })).toBeInTheDocument();
});

test('renders logout button', () => {
  render(
    <DarkModeProvider>
      <Sidebar />
    </DarkModeProvider>
  );
  expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
});
