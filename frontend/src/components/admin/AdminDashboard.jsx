import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import RiskDistributionChart from '../charts/RiskDistributionChart';
import RecentActivityFeed from '../common/RecentActivityFeed'; 
import { Shield, Link, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ apps: 0, urls: 0, highRisk: 0 });
  const [riskData, setRiskData] = useState({});
  const [recentActivity, setRecentActivity] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Admin fetches all data, including pending reports
        const { data } = await api.get('/admin/data');
        const allItems = [...data.apps, ...data.urls];
        const highRiskCount = allItems.filter(item => ['High', 'Critical'].includes(item.risk_level)).length;
        
        setStats({ apps: data.apps.length, urls: data.urls.length, highRisk: highRiskCount });

        const riskCounts = allItems.reduce((acc, item) => {
          acc[item.risk_level] = (acc[item.risk_level] || 0) + 1;
          return acc;
        }, {});
        setRiskData(riskCounts);

        // Set recent activity from the fetched data
        setRecentActivity(
          allItems.sort((a, b) => 
            (b.detected_on || b.reported_on) - (a.detected_on || a.reported_on)
          ).slice(0, 7)
        );

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center p-8">Loading dashboard...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard icon={<Shield />} title="Fraudulent Apps" value={stats.apps} />
        <StatCard icon={<Link />} title="Fraudulent URLs" value={stats.urls} />
        <StatCard icon={<AlertTriangle />} title="High-Risk Items" value={stats.highRisk} color="text-red-500" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RecentActivityFeed activities={recentActivity} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <RiskDistributionChart data={riskData} />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color = "text-indigo-500" }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg flex items-center">
    <div className={`mr-4 p-3 rounded-full bg-indigo-100 ${color}`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;