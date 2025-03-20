'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/lib/api';
import UserEdit from './UserEdit';

export default function UsersTable({ users, onUserUpdated, onUserDeleted }) {
  const { user: currentUser } = useAuth();
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle user delete
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.deleteUser(id);
      onUserDeleted(id);
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete user');
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  // Save edited user
  const handleSave = async (userData) => {
    try {
      setLoading(true);
      await api.updateUser(userData);
      onUserUpdated(userData);
      toast.success('User updated successfully');
      setEditing(null);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card overflow-hidden mb-8">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requests
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                {editing === user.id ? (
                  <td colSpan="6" className="px-6 py-4">
                    <UserEdit 
                      user={user} 
                      onSave={handleSave} 
                      onCancel={() => setEditing(null)}
                      loading={loading}
                    />
                  </td>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.is_admin === 1 ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          Admin
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.request_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      {confirmDelete === user.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                            disabled={loading}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs"
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditing(user.id)}
                            className="text-blue-600 hover:text-blue-900 text-xs"
                            disabled={loading}
                          >
                            Edit
                          </button>
                          {user.id !== currentUser?.id && (
                            <button
                              onClick={() => setConfirmDelete(user.id)}
                              className="text-red-600 hover:text-red-900 text-xs"
                              disabled={loading}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
