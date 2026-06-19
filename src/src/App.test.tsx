import { render, screen } from '@testing-library/react';
import App from './App';

test('renders KANANK heading', () => {
  render(<App />);
  const linkElement = screen.getByText(/kanak/i);
  expect(linkElement).toBeInTheDocument();
});
