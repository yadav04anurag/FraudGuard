import React from 'react';

const StatusBadge = ({ status }) => {
  const config = {
    Reported: 'bg-blue-100 text-blue-800 border border-blue-200',
    'Under Investigation': 'bg-purple-100 text-purple-800 border border-purple-200',
    Blocked: 'bg-red-100 text-red-800 border border-red-200',
    Resolved: 'bg-green-100 text-green-800 border border-green-200',
  };
  const color = config[status] || 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {status}
    </span>
  );
};

export default StatusBadge;