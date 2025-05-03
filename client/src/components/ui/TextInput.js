import React from "react";

const INPUT_STYLES = `w-full px-4 py-2.5 text-gray-700 bg-white \
rounded-lg ring-offset-1 focus:ring-2 focus:ring-blue-500 \
hover:border-blue-400 border border-gray-300 \
focus:border-transparent focus:outline-none \
placeholder:text-gray-400 shadow-sm \
transition-all`;

const Input = ({
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onKeyDown,
  autoFocus = false,
  required = false,
  className = "",
}) => {
  return (
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        required={required}
        className={`${INPUT_STYLES} ${className}`}
      />
  );
};

export default Input;
