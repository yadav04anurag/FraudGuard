import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const RiskDistributionChart = ({ data: riskData }) => {
  const data = {
    labels: Object.keys(riskData),
    datasets: [{
      data: Object.values(riskData),
      backgroundColor: ['#fca5a5', '#fdba74', '#fde047', '#86efac'],
      borderColor: ['#ef4444', '#f97316', '#eab308', '#22c55e'],
      borderWidth: 1,
    }]
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Distribution</h3>
      <div className="relative flex-grow">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default RiskDistributionChart;