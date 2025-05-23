import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthForm from './AuthForm';
import { AuthContext } from '../../context/AuthContext';

jest.mock('axios', () => ({
  post: jest.fn(),
  create: () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }),
}));

function renderWithAuthProvider(ui, value = { login: jest.fn() }) {
  return render(
    <AuthContext.Provider value={value}>
      {ui}
    </AuthContext.Provider>
  );
}

test('renders login form', () => {
  renderWithAuthProvider(<AuthForm />);
  expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
});

test('can switch to sign up', () => {
  renderWithAuthProvider(<AuthForm />);
  fireEvent.click(screen.getByText(/sign up/i));
  expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
});
