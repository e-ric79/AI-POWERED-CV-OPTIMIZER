import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label,
    error,
    helperText,
    icon,
    className = '',
    disabled,
    ...props 
  }, ref) => {
    const baseInputStyles = `
      w-full px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400
      border-2 border-gray-200 rounded-lg
      transition-smooth focus:outline-none focus:border-[#1d9e75] focus:ring-2 focus:ring-[#1d9e75] focus:ring-opacity-10
      disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
      text-base
    `

    const errorStyles = error ? 'border-red-500 focus:border-red-500' : ''

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            disabled={disabled}
            className={`${baseInputStyles} ${errorStyles} ${className}`}
            {...props}
          />
          {icon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input