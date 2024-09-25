import { forwardRef, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = 'primary', size = 'medium', ...props }, ref) => {
    const baseClasses = 'font-semibold rounded focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantClasses = {
      primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
      outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
    };
    
    const sizeClasses = {
      small: 'px-2 py-1 text-sm',
      medium: 'px-4 py-2',
      large: 'px-6 py-3 text-lg'
    };
    
    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`;

    return (
      <button
        ref={ref}
        className={buttonClasses}
        {...props}
      >
        {children}
      </button>
    );
  }
);


export default Button;