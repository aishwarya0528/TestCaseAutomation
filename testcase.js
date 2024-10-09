
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';

describe('Login component', () => {
  test('Component renders without crashing', () => {
    render(<Login />);
  });

  test('Email and password input fields are present', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('Submit button is present', () => {
    render(<Login />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('Email input accepts and updates value', () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  test('Password input accepts and updates value', () => {
    render(<Login />);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  test('Password input masks the entered text', () => {
    render(<Login />);
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('Email field validates correct email format', async () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  test('Password field validates minimum length', async () => {
    render(<Login />);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.blur(passwordInput);
    await waitFor(() => {
      expect(screen.getByText(/password must be at least/i)).toBeInTheDocument();
    });
  });

  test('Submit button is disabled when form is invalid', () => {
    render(<Login />);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  test('Error messages are displayed for invalid inputs', async () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least/i)).toBeInTheDocument();
    });
  });

  test('Form submits with valid inputs', async () => {
    const mockSubmit = jest.fn();
    render(<Login onSubmit={mockSubmit} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1);
    });
  });

  test('Prevents submission with invalid inputs', async () => {
    const mockSubmit = jest.fn();
    render(<Login onSubmit={mockSubmit} />);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockSubmit).not.toHaveBeenCalled();
    });
  });

  test('Loading indicator is shown during form submission', async () => {
    const mockSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));
    render(<Login onSubmit={mockSubmit} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  test('Error messages are displayed in the correct location', async () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    await waitFor(() => {
      const errorMessage = screen.getByText(/invalid email format/i);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveAttribute('id', 'email-error');
    });
  });

  test('Component handles delayed server response correctly', async () => {
    const mockSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));
    render(<Login onSubmit={mockSubmit} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('Displays error message for failed login attempts', async () => {
    const mockSubmit = jest.fn(() => Promise.reject(new Error('Invalid credentials')));
    render(<Login onSubmit={mockSubmit} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('All interactive elements are keyboard accessible', () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(emailInput).toHaveFocus();
    fireEvent.keyDown(emailInput, { key: 'Tab' });
    expect(passwordInput).toHaveFocus();
    fireEvent.keyDown(passwordInput, { key: 'Tab' });
    expect(submitButton).toHaveFocus();
  });

  test('Form inputs have associated labels', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('Handles very long input values', () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    const longEmail = 'a'.repeat(256) + '@example.com';
    fireEvent.change(emailInput, { target: { value: longEmail } });
    expect(emailInput.value).toBe(longEmail);
  });

  test('Behaves correctly with empty inputs', async () => {
    render(<Login />);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('Manages multiple rapid form submissions', async () => {
    const mockSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));
    render(<Login onSubmit={mockSubmit} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
