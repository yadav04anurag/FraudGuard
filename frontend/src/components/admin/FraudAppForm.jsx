import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const FraudAppForm = ({ app, onFormSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    app_name: '',
    developer: '',
    category: 'Finance',
    risk_level: 'Medium',
    status: 'Reported',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (app) {
      setFormData({
        app_name: app.app_name || '',
        developer: app.developer || '',
        category: app.category || 'Finance',
        risk_level: app.risk_level || 'Medium',
        status: app.status || 'Reported',
      });
    } else {
      // Reset form for new entry
      setFormData({
        app_name: '', developer: '', category: 'Finance',
        risk_level: 'Medium', status: 'Reported',
      });
    }
  }, [app]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (app) {
        await api.put(`/admin/apps/${app._id}`, formData);
        toast.success('App updated successfully!');
      } else {
        await api.post('/admin/apps', formData);
        toast.success('App created successfully!');
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
        <label className="block text-sm font-medium text-gray-700">App Name</label>
        <input type="text" name="app_name" value={formData.app_name} onChange={handleChange} required className="mt-1 w-full form-input"/>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Developer</label>
        <input type="text" name="developer" value={formData.developer} onChange={handleChange} className="mt-1 w-full form-input"/>
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

export default FraudAppForm;