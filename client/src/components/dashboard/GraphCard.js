import React from 'react';
import Card from '../ui/Card';

const GraphCard = ({ 
  title, 
  subtitle, 
  children, 
  className = '',
  type = 'default',
  timeRange,
  onTimeRangeChange
}) => {
  return (
    <Card 
      className={`${className}`}
      padding="small"
      elevation="low"
      fullWidth
    >
      <div className="flex justify-between items-center mb-2 px-2 pt-2">
        <div>
          <h3 className="font-medium text-gray-800">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        
        {type === 'bar' && timeRange && onTimeRangeChange && (
          <div className="flex text-sm">
            <select 
              value={timeRange}
              onChange={(e) => onTimeRangeChange(e.target.value)}
              className="text-sm text-gray-600 border border-gray-200 rounded px-2 py-1 bg-white"
            >
              <option value="7days">7 Days</option>
              <option value="30days">30 Days</option>
              <option value="3months">3 Months</option>
              <option value="year">1 Year</option>
            </select>
          </div>
        )}
      </div>
      
      <div className="p-2 flex-1 w-full min-h-[200px]">
        {children}
      </div>
    </Card>
  );
};

export default GraphCard;