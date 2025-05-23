import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Toast from './Toast';

describe('Toast', () => {
  it('renders the message and type', () => {
    render(<Toast message="Test message" type="success" onClose={jest.fn()} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('Test message').className).toContain('toast-success');
  });

  it('calls onClose after 2 seconds if message exists', () => {
    jest.useFakeTimers();
    const onClose = jest.fn();
    render(<Toast message="Close me" onClose={onClose} />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(onClose).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('does not call onClose if no message', () => {
    jest.useFakeTimers();
    const onClose = jest.fn();
    render(<Toast message="" onClose={onClose} />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(onClose).not.toHaveBeenCalled();
    jest.useRealTimers();
  });
});
