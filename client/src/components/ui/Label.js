import React from 'react';

const Label = ({ text, id }) => {
  return (
    <label
      className="block text-gray-700 text-sm font-bold mb-2 transition-colors hover:text-blue-500"
      htmlFor={id}
    >
      {text}
    </label>
  );
};

export default Label;
