import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';
import { DarkModeProvider } from '../context/DarkModeContext';

jest.mock('react-router-dom', () => ({ Link: ({ children }) => <div>{children}</div>, useLocation: () => ({ pathname: '/' }) }));
jest.mock('sweetalert2', () => ({ fire: jest.fn(() => Promise.resolve({ isConfirmed: false })) }));

test('renders sidebar', () => {
  render(
    <DarkModeProvider>
      <Sidebar />
    </DarkModeProvider>
  );
  expect(screen.getByText(/home/i)).toBeInTheDocument();
});
