'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);
  
  // Don't render if already authenticated
  if (isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-600">10x Dev</h1>
        <p className="text-gray-600 mt-2">Become a 10x developer</p>
      </div>
      
      <LoginForm />
    </div>
  );
}
