import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('sweetalert2', () => ({ fire: jest.fn(() => Promise.resolve({ isConfirmed: false })) }));
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => <div>{element}</div>,
  Navigate: () => <div>Navigate</div>,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children }) => <div>{children}</div>
}));
jest.mock('./components/Sidebar', () => () => <div>Sidebar</div>);

test('renders landing page on root route', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /taskflow/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
});
