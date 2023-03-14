import React from 'react';
import {render, screen} from '@testing-library/react';
import Example4 from './Example4';

test('renders learn react link', () => {
  render(<Example4 />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
