import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaPencilAlt } from 'react-icons/fa';
import TextInput from '../ui/TextInput';


const EditableField = ({ label, value, type = 'text', onSave, validation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);
  const [error, setError] = useState('');

  useEffect(() => {
    setFieldValue(value);
  }, [value]);

  const handleSave = () => {
    if (validation) {
      const validationResult = validation(fieldValue);
      if (validationResult) {
        setError(validationResult);
        return;
      }
    }
    
    onSave(fieldValue);
    setIsEditing(false);
    setError('');
  };

  const handleCancel = () => {
    setFieldValue(value);
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="mb-4">
      <div className="text-gray-600 text-sm mb-1">{label}</div>
      
      {isEditing ? (
        <div className="mt-1">
          <div className="flex">
            <TextInput
              type={type}
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              className={`flex-grow ${error ? 'border-red-500' : ''}`}
            />
            <div className="ml-2 flex space-x-2">
              <button 
                onClick={handleSave} 
                className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100"
                title="Save"
              >
                <FaCheck />
              </button>
              <button 
                onClick={handleCancel} 
                className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                title="Cancel"
              >
                <FaTimes />
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="text-gray-900 font-medium">
            {type === 'password' ? '••••••••' : value || 'Not set'}
          </div>
          <button 
            onClick={() => setIsEditing(true)} 
            className="p-2 text-gray-500 hover:text-blue-600"
            title="Edit"
          >
            <FaPencilAlt size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableField;