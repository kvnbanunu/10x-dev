'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import AdminPanel from '@/components/AdminPanel';

export default function AdminPage() {
  const { logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };
  
  return (
    <AuthGuard requireAdmin={true} redirectTo="/">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users and view all requests</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="btn btn-secondary">
              Back to App
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
        
        <AdminPanel />
      </div>
    </AuthGuard>
  );
}
