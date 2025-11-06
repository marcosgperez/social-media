import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { LoginForm } from './LoginForm';

const meta = {
  title: 'Components/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state of the form',
    },
    showGoogleSignIn: {
      control: 'boolean',
      description: 'Show or hide Google sign in button',
    },
    showRegisterLink: {
      control: 'boolean',
      description: 'Show or hide register link',
    },
  },
  args: {
    onSubmit: fn(),
    onGoogleSignIn: fn(),
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state of the login form
 */
export const Default: Story = {
  args: {
    error: null,
    loading: false,
    showGoogleSignIn: true,
    showRegisterLink: true,
  },
};

/**
 * Login form in loading state
 */
export const Loading: Story = {
  args: {
    error: null,
    loading: true,
    showGoogleSignIn: true,
    showRegisterLink: true,
  },
};

/**
 * Login form with error message
 */
export const WithError: Story = {
  args: {
    error: 'Email o contraseña incorrectos',
    loading: false,
    showGoogleSignIn: true,
    showRegisterLink: true,
  },
};

/**
 * Login form with connection error
 */
export const WithConnectionError: Story = {
  args: {
    error: 'Error de conexión. Por favor, intenta de nuevo.',
    loading: false,
    showGoogleSignIn: true,
    showRegisterLink: true,
  },
};

/**
 * Login form with error and loading (edge case)
 */
export const ErrorAndLoading: Story = {
  args: {
    error: 'Procesando...',
    loading: true,
    showGoogleSignIn: true,
    showRegisterLink: true,
  },
};
