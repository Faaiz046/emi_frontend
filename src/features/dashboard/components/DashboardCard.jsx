import React from 'react';
import { Card, CardContent } from '../../../shared/components';


const DashboardCard = ({ title, description, icon, color, stats, onClick }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
              <span className="text-2xl">{icon}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {description}
            </p>
            <p className="text-sm font-medium text-gray-500">
              {stats}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard; 