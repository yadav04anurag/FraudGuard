import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Shield, Link } from 'lucide-react';
import RiskBadge from './RiskBadge';

const RecentActivityFeed = ({ activities, loading }) => {
  if (loading) {
    return <div className="text-center p-4">Loading Activity...</div>;
  }

  if (!activities || activities.length === 0) {
    return <div className="text-center p-4 text-gray-500">No recent activity.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
      <ul className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <li key={activity._id} className="py-4 flex items-center space-x-4">
            <div className="p-2 bg-gray-100 rounded-full">
              {activity.app_name ? <Shield className="text-gray-600" /> : <Link className="text-gray-600" />}
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-gray-900 truncate">
                {activity.app_name || activity.url}
              </p>
              <p className="text-sm text-gray-500">
                {activity.app_name ? 'App' : 'URL'} reported -{' '}
                {formatDistanceToNow(new Date(activity.reported_on || activity.detected_on), { addSuffix: true })}
              </p>
            </div>
            <div className="flex-shrink-0">
              <RiskBadge riskLevel={activity.risk_level} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivityFeed;