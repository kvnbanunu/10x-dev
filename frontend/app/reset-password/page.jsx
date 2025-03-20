'use client';

import { Suspense } from 'react';
import ResetPasswordContent from '@/components/ResetPasswordContent';

// Loading component while suspense resolves
function Loading() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-600">10x Dev</h1>
        <p className="text-gray-600 mt-2">Loading...</p>
      </div>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
