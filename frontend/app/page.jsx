'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import ChatForm from '@/components/ChatForm';
import CodeDisplay from '@/components/CodeDisplay';
import WarningRibbon from '@/components/WarningRibbon';

export default function Home() {
  const { user, requestCount, logout, isAdmin } = useAuth();
  const [generatedCode, setGeneratedCode] = useState(null);
  const [codeLanguage, setCodeLanguage] = useState('');

  const handleCodeGenerated = (code, language) => {
    setGeneratedCode(code);
    setCodeLanguage(language);
  };

  return (
    <AuthGuard>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">10x Dev Portal</h1>
            <p className="text-gray-600">Generate 10x code</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Link href="/admin" className="btn btn-secondary">
                Admin Panel
              </Link>
            )}
            <div className="text-right">
              <p className="text-sm">Welcome, <span className="font-semibold">{user?.username}</span></p>
              <p className="text-xs text-gray-500">Requests: {requestCount}</p>
            </div>
            <button onClick={logout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>

        {requestCount >= 20 && (
          <WarningRibbon 
            message="You have reached 20 requests. You are now a true 10x Developer!"
          />
        )}

        <ChatForm onCodeGenerated={handleCodeGenerated} />
        
        {generatedCode && (
          <CodeDisplay code={generatedCode} language={codeLanguage} />
        )}

        {!generatedCode && (
          <div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Welcome to 10x Dev</h2>
            <p className="text-gray-600 mb-4">
              Get started by describing the program you want to generate.
            </p>
            <p className="text-sm text-gray-500">
              The AI will create modular and totally human readable code.
            </p>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
