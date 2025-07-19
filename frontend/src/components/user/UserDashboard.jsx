import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import RecentActivityFeed from '../common/RecentActivityFeed';
import Modal from '../common/Modal';
import ReportUrlForm from './ReportUrlForm';
import RiskBadge from '../common/RiskBadge';
import { PlusCircle } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [publicUrls, setPublicUrls] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/fraud-data');
      setPublicUrls(data.publicUrls);
      setRecentActivity(data.recentActivity);
    } catch (error) {
      toast.error("Could not fetch fraud data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormSubmit = () => {
    setIsModalOpen(false);
    // No need to refresh data here, as the user's report is pending admin review
    // and won't appear on their public list immediately.
  };

  return (
    <>
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
            <p className="text-gray-600">View verified threats and request to block suspicious websites.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex mt-4 md:mt-0 items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full md:w-auto"
          >
            <PlusCircle size={20} className="mr-2" /> Request Website Blocking
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <RecentActivityFeed activities={recentActivity} loading={loading} />
          </div>
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Verified Threat List</h3>
            <div className="overflow-y-auto h-96">
              {loading ? (
                <p className="text-center text-gray-500">Loading threats...</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {publicUrls.length > 0 ? publicUrls.map(url => (
                    <li key={url._id} className="py-3 flex justify-between items-center">
                      <span className="font-mono text-sm text-gray-700 truncate pr-4">{url.url}</span>
                      <RiskBadge riskLevel={url.risk_level} />
                    </li>
                  )) : (
                    <p className="text-center text-gray-500 pt-4">No verified threats found.</p>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Request Website Blocking">
        <ReportUrlForm onFormSubmit={handleFormSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default UserDashboard;