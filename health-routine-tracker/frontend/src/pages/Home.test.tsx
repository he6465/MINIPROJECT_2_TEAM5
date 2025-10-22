import { render, screen } from '@testing-library/react';
import Home from './Home';
import { MemoryRouter } from 'react-router-dom';

// Ensure localStorage is clean for deterministic test
beforeEach(() => localStorage.clear());

test('renders dashboard title', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
  expect(screen.getByText('대시보드')).toBeInTheDocument();
});
