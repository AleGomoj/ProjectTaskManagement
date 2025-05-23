import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import { AuthContext } from '../context/AuthContext';

jest.mock('./Board/BoardList', () => () => <div>BoardList</div>);
jest.mock('./Sidebar', () => () => <div>Sidebar</div>);

test('renders dashboard', () => {
  render(
    <AuthContext.Provider value={{ user: { name: 'Test' } }}>
      <Dashboard />
    </AuthContext.Provider>
  );
  expect(screen.getByText(/welcome/i)).toBeInTheDocument();
});
