import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import RiskBadge from '../common/RiskBadge';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import FraudUrlForm from './FraudUrlForm';
import { Edit, Trash2, PlusCircle, Search } from 'lucide-react';

const FraudUrlManager = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUrl, setEditingUrl] = useState(null);
  const [filters, setFilters] = useState({ search: '', risk: 'All', status: 'All' });

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    setLoading(true);
    try {
      // The admin needs all data, including 'Reported' items, so we fetch from the admin endpoint
      const { data } = await api.get('/admin/data');
      setUrls(data.urls);
    } catch (error) {
      toast.error('Failed to fetch URL data.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (url = null) => {
    setEditingUrl(url);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingUrl(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = () => {
    handleCloseModal();
    fetchUrls(); // Refresh the data from the server after a change
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      try {
        await api.delete(`/admin/urls/${id}`);
        toast.success('URL deleted successfully');
        fetchUrls(); // Refresh the data
      } catch (error) {
        toast.error('Failed to delete URL.');
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredUrls = useMemo(() => {
    return urls.filter(url => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = url.url.toLowerCase().includes(searchLower) || url.category.toLowerCase().includes(searchLower);
      const matchesRisk = filters.risk === 'All' || url.risk_level === filters.risk;
      const matchesStatus = filters.status === 'All' || url.status === filters.status;
      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [urls, filters]);

  if (loading) {
    return <div className="text-center p-8">Loading URL Data...</div>;
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Manage Fraudulent URLs</h2>
          <button 
            onClick={() => handleOpenModal()} 
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full md:w-auto"
          >
            <PlusCircle size={20} className="mr-2" /> Add New URL
          </button>
        </div>

        {/* Filter and Search Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              name="search" 
              placeholder="Search by URL or category..." 
              value={filters.search} 
              onChange={handleFilterChange} 
              className="w-full form-input pl-10"
            />
          </div>
          <div>
            <select name="risk" value={filters.risk} onChange={handleFilterChange} className="w-full form-select">
              <option value="All">All Risk Levels</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
          <div>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full form-select">
              <option value="All">All Statuses</option>
              <option>Reported</option>
              <option>Under Investigation</option>
              <option>Blocked</option>
              <option>Resolved</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detected On</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUrls.length > 0 ? (
                filteredUrls.map((url) => (
                  <tr key={url._id} className={url.status === 'Reported' ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-700">{url.url}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{url.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><RiskBadge riskLevel={url.risk_level} /></td>
                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={url.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(url.detected_on).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleOpenModal(url)} 
                        className="p-1 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 rounded-full transition-colors"
                        title="Edit URL"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(url._id)} 
                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-colors"
                        title="Delete URL"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    No URLs match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Creating and Editing */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingUrl ? 'Edit Fraudulent URL' : 'Add New Fraudulent URL'}>
        <FraudUrlForm url={editingUrl} onFormSubmit={handleFormSubmit} onCancel={handleCloseModal} />
      </Modal>
    </>
  );
};

export default FraudUrlManager;