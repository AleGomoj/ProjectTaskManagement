import React from 'react';
import { render, screen } from '@testing-library/react';
import Landing from './Landing';

jest.mock('react-router-dom', () => ({ useNavigate: () => jest.fn() }));

test('renders landing page', () => {
  render(<Landing />);
  expect(screen.getByText(/taskflow/i)).toBeInTheDocument();
});
