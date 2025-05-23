import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

test('shows warning if user is Google', () => {
  render(
    <AuthContext.Provider value={{ user: { id: 2, provider: 'google' } }}>
      <Profile />
    </AuthContext.Provider>
  );
  expect(screen.getByText(/profile changes are not allowed/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/new password/i)).toBeDisabled();
  expect(screen.getByLabelText(/confirm password/i)).toBeDisabled();
});

test('can activate and cancel edit mode', async () => {
  render(
    <AuthContext.Provider value={{ user: { id: 1, provider: 'local' } }}>
      <Profile />
    </AuthContext.Provider>
  );
  const changeBtn = screen.getByRole('button', { name: /change password/i });
  await act(async () => {
    fireEvent.click(changeBtn);
  });
  const saveBtn = await screen.findByRole('button', { name: /save/i });
  expect(saveBtn).toBeInTheDocument();
  const cancelBtn = screen.getByRole('button', { name: /cancel/i });
  await act(async () => {
    fireEvent.click(cancelBtn);
  });
  expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
});

test('shows error if passwords do not match', async () => {
  render(
    <AuthContext.Provider value={{ user: { id: 1, provider: 'local' } }}>
      <Profile />
    </AuthContext.Provider>
  );
  const changeBtn = screen.getByRole('button', { name: /change password/i });
  await act(async () => {
    fireEvent.click(changeBtn);
  });
  const saveBtn = await screen.findByRole('button', { name: /save/i });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: '1234' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: '4321' } });
    fireEvent.click(saveBtn);
  });
  expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
});

test('shows error if password is empty', async () => {
  render(
    <AuthContext.Provider value={{ user: { id: 1, provider: 'local' } }}>
      <Profile />
    </AuthContext.Provider>
  );
  const changeBtn = screen.getByRole('button', { name: /change password/i });
  await act(async () => {
    fireEvent.click(changeBtn);
  });
  const saveBtn = await screen.findByRole('button', { name: /save/i });
  await act(async () => {
    fireEvent.click(saveBtn);
  });
  expect(screen.getByText(/password is required/i)).toBeInTheDocument();
});

jest.mock('../../services/api', () => ({
  updateUserProfile: jest.fn(() => Promise.resolve()),
}));

test('shows success message after saving', async () => {
  render(
    <AuthContext.Provider value={{ user: { id: 1, provider: 'local' } }}>
      <Profile />
    </AuthContext.Provider>
  );
  const changeBtn = screen.getByRole('button', { name: /change password/i });
  await act(async () => {
    fireEvent.click(changeBtn);
  });
  const passInput = screen.getByLabelText(/new password/i);
  const confirmInput = screen.getByLabelText(/confirm password/i);
  await act(async () => {
    fireEvent.change(passInput, { target: { value: '1234' } });
    fireEvent.change(confirmInput, { target: { value: '1234' } });
    screen.getByRole('button', { name: /save/i }).click();
  });
  await screen.findByText(/password updated successfully/i);
});

test('renders correctly if no user', () => {
  render(
    <AuthContext.Provider value={{ user: null }}>
      <Profile />
    </AuthContext.Provider>
  );
  expect(screen.getByText(/user profile/i)).toBeInTheDocument();
});

test('renders correctly if user has no provider', () => {
  render(
    <AuthContext.Provider value={{ user: { id: 3 } }}>
      <Profile />
    </AuthContext.Provider>
  );
  expect(screen.getByText(/user profile/i)).toBeInTheDocument();
});

test('renders correctly if user has unknown provider', () => {
  render(
    <AuthContext.Provider value={{ user: { id: 4, provider: 'unknown' } }}>
      <Profile />
    </AuthContext.Provider>
  );
  expect(screen.getByText(/user profile/i)).toBeInTheDocument();
});

test('renders correctly with different user id', () => {
  render(
    <AuthContext.Provider value={{ user: { id: 99, provider: 'local' } }}>
      <Profile />
    </AuthContext.Provider>
  );
  expect(screen.getByText(/user profile/i)).toBeInTheDocument();
});
