import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  test('renders the header title', () => {
    render(<Header />);
    expect(screen.getByText('Task Management Dashboard')).toBeInTheDocument();
  });

  test('renders the logout button', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  test('logout button can be clicked', () => {
    render(<Header />);
    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);
    expect(button).toBeEnabled();
  });

  test('header container has correct class', () => {
    render(<Header />);
    const container = document.querySelector('.header');
    expect(container).toHaveClass('header');
  });

  test('logout button has correct class', () => {
    render(<Header />);
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toHaveClass('logout-btn');
  });
});
