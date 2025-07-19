import React from 'react';

const RiskBadge = ({ riskLevel }) => {
  const config = {
    Critical: 'bg-red-100 text-red-800 border border-red-200',
    High: 'bg-orange-100 text-orange-800 border border-orange-200',
    Medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    Low: 'bg-green-100 text-green-800 border border-green-200',
  };
  const color = config[riskLevel] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {riskLevel}
    </span>
  );
};

export default RiskBadge;