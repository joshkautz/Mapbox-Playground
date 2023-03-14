import React from 'react';
import {render, screen} from '@testing-library/react';
import Example3 from './Example3';

test('renders learn react link', () => {
  render(<Example3 />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
