import React from 'react';
import {render, screen} from '@testing-library/react';
import Example1 from './Example1';

test('renders learn react link', () => {
  render(<Example1 />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
