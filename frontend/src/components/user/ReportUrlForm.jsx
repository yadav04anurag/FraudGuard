import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ReportUrlForm = ({ onFormSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    url: '',
    category: 'Phishing',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // This POST request is the user's "request for blocking"
      await api.post('/fraud-data/report', formData);
      toast.success('Request submitted! An admin will review the website shortly.');
      onFormSubmit(); // This will close the modal and signal success
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">Fraudulent Website URL</label>
        <input 
          id="url"
          type="url" 
          name="url" 
          value={formData.url} 
          onChange={handleChange} 
          required 
          placeholder="https://example-scam-site.com" 
          className="mt-1 w-full form-input"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Suspected Category</label>
        <select 
          id="category"
          name="category" 
          value={formData.category} 
          onChange={handleChange} 
          className="mt-1 w-full form-select"
        >
          <option>Phishing</option>
          <option>Scam</option>
          <option>Malware</option>
          <option>Crypto Scam</option>
          <option>Other</option>
        </select>
      </div>
      <p className="text-xs text-gray-500">
        By submitting, you are requesting an administrator to review this website for potential blocking.
      </p>
      <div className="flex justify-end space-x-3 pt-4">
        <button 
          type="button" 
          onClick={onCancel} 
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading} 
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
};

export default ReportUrlForm;