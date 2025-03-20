'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ResetRequestForm from '@/components/ResetRequestForm';
import ResetPasswordForm from '@/components/ResetPasswordForm';

export default function ResetPasswordPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
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
        <p className="text-gray-600 mt-2">
          {token ? 'Reset your password' : 'Request a password reset'}
        </p>
      </div>
      
      {token ? <ResetPasswordForm /> : <ResetRequestForm />}
    </div>
  );
}
