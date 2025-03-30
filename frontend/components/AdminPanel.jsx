'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import * as api from '@/lib/api';
import UsersTable from './UsersTable';
import RequestsTable from './RequestsTable';
import ApiUsageTable from './ApiUsageTable';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [apiUsage, setApiUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await api.getDatabase();
        setUsers(data.users || []);
        setRequests(data.requests || []);
        setApiUsage(data.apiUsage || []);
      } catch (err) {
        setError('Failed to load data');
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUserUpdated = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? { ...user, ...updatedUser } : user
    ));
  };

  const handleUserDeleted = (deletedId) => {
    setUsers(users.filter(user => user.id !== deletedId));
    setRequests(requests.filter(request => request.user_id !== deletedId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users and view all requests.</p>
      </div>

      <UsersTable 
        users={users} 
        onUserUpdated={handleUserUpdated} 
        onUserDeleted={handleUserDeleted} 
      />
      
      <ApiUsageTable apiUsage={apiUsage} />
      
      <RequestsTable requests={requests} users={users} />
    </div>
  );
}
