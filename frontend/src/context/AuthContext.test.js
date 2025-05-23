import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import { AuthProvider, AuthContext } from './AuthContext';


function mockLocalStorage(token, isValid = true) {
  const store = { token };
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => store[key]);
  jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation((key, value) => { store[key] = value; });
  jest.spyOn(window.localStorage.__proto__, 'removeItem').mockImplementation((key) => { delete store[key]; });
  if (isValid) {
    jest.spyOn(require('jwt-decode'), 'jwtDecode').mockImplementation(() => ({ id: 1, name: 'Test' }));
  } else {
    jest.spyOn(require('jwt-decode'), 'jwtDecode').mockImplementation(() => { throw new Error('Invalid token'); });
  }
}

afterEach(() => {
  jest.restoreAllMocks();
});

test('sets user from valid token in localStorage', () => {
  mockLocalStorage('valid-token', true);
  let user;
  render(
    <AuthProvider>
      <AuthContext.Consumer>{(ctx) => { user = ctx.user; return null; }}</AuthContext.Consumer>
    </AuthProvider>
  );
  expect(user).toEqual({ id: 1, name: 'Test' });
});

test('removes invalid token from localStorage', () => {
  mockLocalStorage('invalid-token', false);
  render(
    <AuthProvider>
      <AuthContext.Consumer>{() => null}</AuthContext.Consumer>
    </AuthProvider>
  );
  expect(window.localStorage.getItem('token')).toBeUndefined();
});

test('login sets token and user', async () => {
  mockLocalStorage(null, true);
  let context;
  render(
    <AuthProvider>
      <AuthContext.Consumer>{(ctx) => { context = ctx; return null; }}</AuthContext.Consumer>
    </AuthProvider>
  );
  await act(async () => {
    context.login('new-token');
  });
  expect(window.localStorage.getItem('token')).toBe('new-token');
  await waitFor(() => {
    expect(context.user).toEqual({ id: 1, name: 'Test' });
  });
});

test('logout removes token and sets user to null', async () => {
  mockLocalStorage('valid-token', true);
  let context;
  render(
    <AuthProvider>
      <AuthContext.Consumer>{(ctx) => { context = ctx; return null; }}</AuthContext.Consumer>
    </AuthProvider>
  );
  await act(async () => {
    context.logout();
  });
  expect(window.localStorage.getItem('token')).toBeUndefined();
  await waitFor(() => {
    expect(context.user).toBeNull();
  });
});
