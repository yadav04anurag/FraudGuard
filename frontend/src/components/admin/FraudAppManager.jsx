import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import RiskBadge from '../common/RiskBadge';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import FraudAppForm from './FraudAppForm';
import { Edit, Trash2, PlusCircle, Search } from 'lucide-react';

const FraudAppManager = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [filters, setFilters] = useState({ search: '', risk: 'All', status: 'All' });

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/data');
      setApps(data.apps);
    } catch (error) {
      toast.error('Failed to fetch app data.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (app = null) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingApp(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = () => {
    handleCloseModal();
    fetchApps();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/admin/apps/${id}`);
        toast.success('App deleted successfully');
        fetchApps();
      } catch (error) {
        toast.error('Failed to delete app.');
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = app.app_name.toLowerCase().includes(searchLower) || (app.developer && app.developer.toLowerCase().includes(searchLower));
      const matchesRisk = filters.risk === 'All' || app.risk_level === filters.risk;
      const matchesStatus = filters.status === 'All' || app.status === filters.status;
      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [apps, filters]);

  if (loading) return <div className="text-center p-8">Loading apps...</div>;

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Manage Fraudulent Apps</h2>
          <button onClick={() => handleOpenModal()} className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full md:w-auto">
            <PlusCircle size={20} className="mr-2" /> Add New App
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" name="search" placeholder="Search by name or developer..." value={filters.search} onChange={handleFilterChange} className="w-full form-input pl-10"/>
          </div>
          <div>
            <select name="risk" value={filters.risk} onChange={handleFilterChange} className="w-full form-select">
              <option value="All">All Risk Levels</option><option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
            </select>
          </div>
          <div>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full form-select">
              <option value="All">All Statuses</option><option>Reported</option><option>Under Investigation</option><option>Blocked</option><option>Resolved</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">App Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reported On</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApps.length > 0 ? filteredApps.map((app) => (
                <tr key={app._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{app.app_name}</div>
                      <div className="text-sm text-gray-500">{app.developer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><RiskBadge riskLevel={app.risk_level} /></td>
                  <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={app.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(app.reported_on).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => handleOpenModal(app)} className="p-1 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 rounded-full transition-colors"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(app._id)} className="p-1 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-colors"><Trash2 size={18} /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">No apps match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingApp ? 'Edit Fraudulent App' : 'Add New Fraudulent App'}>
        <FraudAppForm app={editingApp} onFormSubmit={handleFormSubmit} onCancel={handleCloseModal} />
      </Modal>
    </>
  );
};

export default FraudAppManager;