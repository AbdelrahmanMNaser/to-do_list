const Button = ({ children, onClick, className, variant, size }) => {
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  const sizes = {
    small: "py-1 px-2 text-xs",
    medium: "py-2 px-4 text-sm",
    large: "py-3 px-6 text-lg",
  };

  const sizeClasses = sizes[size] || sizes.medium;
  const variantClasses = variants[variant] || variants.primary;

  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-transform hover:scale-105 ${variantClasses} ${sizeClasses}`}
    >
      {children}
    </button>
  );
};

export default Button;
