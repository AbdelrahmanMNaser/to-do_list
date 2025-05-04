import React from 'react';

const Card = ({
  children,
  className,
  elevation = 'medium',
  fullWidth = false,
  onClick,
  padding = 'normal',
  variant = 'default'
}) => {
  // Generate Tailwind classes based on props
  const elevationClasses = {
    none: 'shadow-none',
    low: 'shadow-sm',
    medium: 'shadow-md',
    high: 'shadow-lg'
  };
  
  const paddingClasses = {
    none: 'p-0',
    small: 'p-2',
    normal: 'p-4',
    large: 'p-6'
  };
  
  const variantClasses = {
    default: 'border-0',
    outlined: 'border border-gray-200 shadow-none',
    interactive: 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-200'
  };
  
  return (
    <div 
      className={`
        bg-white rounded-lg overflow-hidden flex flex-col
        ${elevationClasses[elevation]}
        ${paddingClasses[padding]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className || ''}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;