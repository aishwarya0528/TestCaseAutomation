import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';

describe('Login Component', () => {
  test('renders without crashing', () => {
    render(<Login />);
  });

  test('renders all expected elements', () => {
    render(<Login />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('input fields update correctly', () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('input fields have correct types', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');
  });

  test('form submission with valid inputs', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Email:', 'test@example.com', 'Password:', 'password123');
    });

    expect(screen.getByLabelText(/email/i).value).toBe('');
    expect(screen.getByLabelText(/password/i).value).toBe('');

    consoleSpy.mockRestore();
  });

  test('form submission with empty fields', async () => {
    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    });
  });

  test('error message disappears after valid submission', async () => {
    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.queryByText(/please fill in all fields/i)).not.toBeInTheDocument();
    });
  });

  test('form elements have associated labels', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('form is keyboard accessible', () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    emailInput.focus();
    expect(document.activeElement).toBe(emailInput);

    passwordInput.focus();
    expect(document.activeElement).toBe(passwordInput);

    submitButton.focus();
    expect(document.activeElement).toBe(submitButton);
  });

  test('handles very long inputs', () => {
    render(<Login />);
    const longString = 'a'.repeat(1000);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: `${longString}@example.com` } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: longString } });

    expect(screen.getByLabelText(/email/i).value).toBe(`${longString}@example.com`);
    expect(screen.getByLabelText(/password/i).value).toBe(longString);
  });

  test('handles special characters in inputs', () => {
    render(<Login />);
    const specialChars = '!@#$%^&*()_+{}[]|":;<>?,./';
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: `test${specialChars}@example.com` } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: specialChars } });

    expect(screen.getByLabelText(/email/i).value).toBe(`test${specialChars}@example.com`);
    expect(screen.getByLabelText(/password/i).value).toBe(specialChars);
  });

  test('error message is displayed and cleared correctly', async () => {
    render(<Login />);
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => {
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.queryByText(/please fill in all fields/i)).not.toBeInTheDocument();
    });
  });
});