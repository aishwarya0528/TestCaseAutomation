Here are the Jest test cases for the provided JavaScript files:

```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import Login from './Login';

describe('App component', () => {
  it('renders the Login component', () => {
    render(<App />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});

describe('Login component', () => {
  it('renders all required elements', () => {
    render(<Login />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('validates email format', () => {
    render(<Login />);
    const emailInput = screen.getByLabelText('Email:');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
    expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
  });

  it('validates password minimum length', () => {
    render(<Login />);
    const passwordInput = screen.getByLabelText('Password:');
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
    expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
  });

  it('displays error message for empty fields', () => {
    render(<Login />);
    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
    expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
  });

  it('submits form with valid inputs', () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
    expect(screen.queryByText('Please fill in all fields')).not.toBeInTheDocument();
  });

  it('clears error message when correcting inputs', () => {
    render(<Login />);
    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
    expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
    expect(screen.queryByText('Please fill in all fields')).not.toBeInTheDocument();
  });

  it('updates form state when typing in inputs', () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });
    expect(screen.getByLabelText('Email:')).toHaveValue('test@example.com');
    expect(screen.getByLabelText('Password:')).toHaveValue('password123');
  });

  it('resets form state after successful submission', () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
    expect(screen.getByLabelText('Email:')).toHaveValue('');
    expect(screen.getByLabelText('Password:')).toHaveValue('');
  });

  it('handles form submission with maximum length inputs', () => {
    render(<Login />);
    const longEmail = 'a'.repeat(254) + '@example.com';
    const longPassword = 'a'.repeat(100);
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: longEmail } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: longPassword } });
    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
    expect(screen.queryByText('Please fill in all fields')).not.toBeInTheDocument();
  });

  it('handles form behavior with special characters in inputs', () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test+special@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'p@ssw0rd!' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
    expect(screen.queryByText('Please fill in all fields')).not.toBeInTheDocument();
  });
});
```

These test cases cover the main functionality of the Login component, including rendering, input validation, form submission, and error handling. They also include some edge cases like maximum length inputs and special characters.