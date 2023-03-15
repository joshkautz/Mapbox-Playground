import React from 'react';
import {render, screen} from '@testing-library/react';
import Example5 from './Example5';

test('renders learn react link', () => {
  render(<Example5 />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
