import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  bordered?: boolean
  padding?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    hoverable = false,
    bordered = false,
    padding = 'md',
    className = '',
    children,
    ...props 
  }, ref) => {
    const paddingSizes = {
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8',
    }

    const baseStyles = 'bg-white rounded-xl transition-smooth'
    const shadow = 'shadow-sm hover:shadow-md'
    const border = bordered ? 'border border-gray-200' : ''
    const hoverEffect = hoverable ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' : ''

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${shadow} ${hoverEffect} ${border} ${paddingSizes[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card