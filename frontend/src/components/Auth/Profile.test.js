import React from 'react';
import { render, screen } from '@testing-library/react';
import Profile from './Profile';
import { AuthContext } from '../../context/AuthContext';

jest.mock('axios', () => ({
  put: jest.fn(),
  create: () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }),
}));
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children }) => <div>{children}</div>
}));
jest.mock('sweetalert2', () => ({ fire: jest.fn(() => Promise.resolve({ isConfirmed: false })) }));
jest.mock('../../context/DarkModeContext', () => ({
  useDarkModeContext: () => ({ darkMode: false, setDarkMode: jest.fn() }),
  DarkModeProvider: ({ children }) => <div>{children}</div>
}));

test('renders profile page', () => {
  render(
    <AuthContext.Provider value={{ user: { id: 1, provider: 'local' } }}>
      <Profile />
    </AuthContext.Provider>
  );
  expect(screen.getByText(/user profile/i)).toBeInTheDocument();
});
