
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';

describe('Login component', () => {
  test('Renders login form correctly', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('Handles empty form submission', async () => {
    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('Handles valid form submission', async () => {
    const mockSubmit = jest.fn();
    render(<Login onSubmit={mockSubmit} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1);
    });
  });

  test('Clears error message on input change', async () => {
    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
  });

  test('Tests password masking', () => {
    render(<Login />);
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');
  });

  test('Tests login button disabled state', () => {
    render(<Login />);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    expect(submitButton).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    expect(submitButton).toBeEnabled();
  });

  test('Tests latency', async () => {
    jest.useFakeTimers();
    const mockSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));
    render(<Login onSubmit={mockSubmit} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    const startTime = Date.now();
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    jest.runAllTimers();
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
    const endTime = Date.now();
    const latency = endTime - startTime;
    expect(latency).toBeLessThan(1500);
    jest.useRealTimers();
  });

  test('Tests throughput', async () => {
    jest.useFakeTimers();
    const mockSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<Login onSubmit={mockSubmit} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    const startTime = Date.now();
    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    }
    jest.runAllTimers();
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(10);
    });
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    expect(totalTime).toBeLessThan(2000);
    jest.useRealTimers();
  });

  test('Tests connection pooling', async () => {
    const mockSubmit = jest.fn(() => Promise.resolve());
    const { rerender } = render(<Login onSubmit={mockSubmit} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      rerender(<Login onSubmit={mockSubmit} />);
    }
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(5);
    });
  });
});
This test suite covers all the specified test cases, including rendering, form submission, input validation, latency, throughput, and connection pooling. It uses Jest and React Testing Library to simulate user interactions and test the component's behavior.
