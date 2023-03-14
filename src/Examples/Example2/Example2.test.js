import React from 'react';
import {render, screen} from '@testing-library/react';
import Example2 from './Example2';

test('renders learn react link', () => {
  render(<Example2 />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
