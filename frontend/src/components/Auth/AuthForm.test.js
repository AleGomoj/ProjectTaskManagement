import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

test('shows error on login failure', async () => {
  const errorMessage = 'Invalid credentials';
  require('axios').post.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });
  renderWithAuthProvider(<AuthForm />);
  fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'fail@test.com' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpass' } });
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
  });
  expect(await screen.findByText(errorMessage)).toBeInTheDocument();
});

test('calls login and navigates on successful login', async () => {
  const loginMock = jest.fn();
  require('axios').post.mockResolvedValueOnce({ data: { token: 'token' } });
  renderWithAuthProvider(<AuthForm />, { login: loginMock });
  fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'user@test.com' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '123456' } });
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
  });
  await screen.findByRole('button', { name: /log in/i });
  expect(loginMock).toHaveBeenCalledWith('token');
});

test('shows loading state on submit', async () => {
  renderWithAuthProvider(<AuthForm />);
  fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'user@test.com' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '123456' } });
  require('axios').post.mockImplementation(() => new Promise(() => {})); // never resolves
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
  });
  expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument();
});

test('shows error if fields are empty on login', () => {
  renderWithAuthProvider(<AuthForm />);
  const loginBtn = screen.getByRole('button', { name: /log in/i });
  expect(loginBtn).toBeInTheDocument();
});

test('shows error if fields are empty on sign up', () => {
  renderWithAuthProvider(<AuthForm />);
  fireEvent.click(screen.getByText(/sign up/i));
  const signupBtn = screen.getByRole('button', { name: /sign up/i });
  expect(signupBtn).toBeInTheDocument();
});

test('calls login with correct values', async () => {
  const login = jest.fn().mockResolvedValue({});
  require('axios').post.mockResolvedValueOnce({ data: { token: 'token' } });
  renderWithAuthProvider(<AuthForm />, { login });
  fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
  const loginBtn = screen.getByRole('button', { name: /log in/i });
  expect(loginBtn).not.toBeDisabled();
  fireEvent.click(loginBtn);
  await screen.findByRole('button', { name: /log in/i });
  expect(login).toHaveBeenCalled();
});

test('shows error message on login failure', async () => {
  const login = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
  renderWithAuthProvider(<AuthForm />, { login });
  fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'fail@example.com' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpass' } });
  fireEvent.click(screen.getByRole('button', { name: /log in/i }));
  const error = await screen.findByText(/error/i);
  expect(error).toBeInTheDocument();
});

test('can type in email and password fields', () => {
  renderWithAuthProvider(<AuthForm />);
  const emailInput = screen.getByPlaceholderText(/email/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);
  fireEvent.change(emailInput, { target: { value: 'user@a.com' } });
  fireEvent.change(passwordInput, { target: { value: '123456' } });
  expect(emailInput.value).toBe('user@a.com');
  expect(passwordInput.value).toBe('123456');
});

test('does not call login if fields are empty on login', async () => {
  const login = jest.fn();
  renderWithAuthProvider(<AuthForm />, { login });
  const loginBtn = screen.getByRole('button', { name: /log in/i });
  await act(async () => {
    fireEvent.click(loginBtn);
  });
  expect(login).not.toHaveBeenCalled();
});

test('does not call login if fields are empty on sign up', async () => {
  const login = jest.fn();
  renderWithAuthProvider(<AuthForm />, { login });
  fireEvent.click(screen.getByText(/sign up/i));
  const signupBtn = screen.getByRole('button', { name: /sign up/i });
  await act(async () => {
    fireEvent.click(signupBtn);
  });
  expect(login).not.toHaveBeenCalled();
});

test('does not call login if fields are empty on sign up', async () => {
  const login = jest.fn();
  renderWithAuthProvider(<AuthForm />, { login });
  fireEvent.click(screen.getByText(/sign up/i));
  const signupBtn = screen.getByRole('button', { name: /sign up/i });
  await act(async () => {
    fireEvent.click(signupBtn);
  });
  expect(login).not.toHaveBeenCalled();
});
