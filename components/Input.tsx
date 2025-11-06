import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className = '', ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold mb-2 text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
            error ? 'border-red-500' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-red-500 text-sm mt-1">{error}</span>
        )}
        {!error && helperText && (
          <span className="text-xs text-gray-500 mt-1">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
