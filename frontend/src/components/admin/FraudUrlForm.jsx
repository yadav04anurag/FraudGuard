import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const FraudUrlForm = ({ url, onFormSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    url: '',
    category: 'Phishing',
    risk_level: 'Medium',
    status: 'Reported',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (url) {
      setFormData({
        url: url.url || '',
        category: url.category || 'Phishing',
        risk_level: url.risk_level || 'Medium',
        status: url.status || 'Reported',
      });
    } else {
      setFormData({
        url: '', category: 'Phishing',
        risk_level: 'Medium', status: 'Reported',
      });
    }
  }, [url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (url) {
        await api.put(`/admin/urls/${url._id}`, formData);
        toast.success('URL updated successfully!');
      } else {
        await api.post('/admin/urls', formData);
        toast.success('URL created successfully!');
      }
      onFormSubmit();
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Fraudulent URL</label>
        <input type="url" name="url" value={formData.url} onChange={handleChange} required placeholder="https://example.com" className="mt-1 w-full form-input"/>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input type="text" name="category" value={formData.category} onChange={handleChange} required className="mt-1 w-full form-input"/>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Risk Level</label>
          <select name="risk_level" value={formData.risk_level} onChange={handleChange} className="mt-1 w-full form-select">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full form-select">
            <option>Reported</option>
            <option>Under Investigation</option>
            <option>Blocked</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default FraudUrlForm;