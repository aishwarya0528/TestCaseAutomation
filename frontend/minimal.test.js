import React from 'react';
import { render, screen } from '@testing-library/react';

test('Minimal test case', () => {
  render(<div>Hello, World!</div>);
  expect(screen.getByText('Hello, World!')).toBeInTheDocument();
});
