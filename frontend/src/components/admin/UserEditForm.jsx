import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const UserEditForm = ({ user, onFormSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/users/${user._id}`, formData);
      toast.success('User updated successfully!');
      onFormSubmit();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full form-input"/>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 w-full form-input"/>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select name="role" value={formData.role} onChange={handleChange} className="mt-1 w-full form-select">
          <option value="user">User</option>
          <option value="analyst">Analyst</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default UserEditForm;