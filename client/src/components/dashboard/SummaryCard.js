import React from 'react';
import Card from '../ui/Card';

const SummaryCard = ({
  title,
  value,
  icon,
  change,
  changeType = 'neutral',
  className = ''
}) => {
  // Determine change indicator styling
  const changeStyles = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  const iconBgColors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  const iconBg = iconBgColors[icon?.color] || 'bg-gray-100 text-gray-600';

  return (
    <Card className={`${className}`} padding="normal" elevation="low" variant="default">
      <div className="flex items-start">
        {icon && (
          <div className={`p-3 rounded-lg mr-4 ${iconBg}`}>
            {icon.component}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-800">{value}</h3>
          
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-xs ${changeStyles[changeType]} font-medium`}>
                {change}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SummaryCard;