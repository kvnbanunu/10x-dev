'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import RegisterForm from '@/components/RegisterForm';

export default function RegisterPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);
  
  if (isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-600">10x Dev</h1>
        <p className="text-gray-600 mt-2">Create your account to get started</p>
      </div>
      
      <RegisterForm />
    </div>
  );
}
