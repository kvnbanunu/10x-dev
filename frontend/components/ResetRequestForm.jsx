'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { resetPasswordRequest } from '@/lib/api';

export default function ResetRequestForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const LABELS = {
    emailCheck: 'Check Your Email',
    return: 'Return to login',
    reset: 'Reset Password',
    email: 'Email',
    sendBuffer: 'Sending...',
    remember: 'Remember your password? ',
    login: 'Login',
  };

  const msg = {
    emailReq: 'Email is required',
    emailInv: 'Invalid email address',
    emailSent: 'If the email address you entered is registered in our system, you will receive a password reset link shortly.',
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await resetPasswordRequest(data.email);
      setSubmitted(true);
      toast.success('If your email is registered, you will receive a password reset link');
    } catch (error) {
      toast.error('Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="card max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">{LABELS.emailCheck}</h1>
        <p className="text-center mb-6">
          {msg.emailSent}
        </p>
        <div className="mt-6 text-center">
          <Link href="/login" className="link">
            {LABELS.return}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">{LABELS.reset}</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            {LABELS.email}
          </label>
          <input
            id="email"
            type="email"
            className={`input ${errors.email ? 'border-red-500' : ''}`}
            placeholder="your@email.com"
            {...register('email', { 
              required: msg.emailReq,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: msg.emailInv
              }
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></span>
              {LABELS.sendBuffer}
            </span>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {LABELS.remember}
          <Link href="/login" className="link">
            {LABELS.login}
          </Link>
        </p>
      </div>
    </div>
  );
}
