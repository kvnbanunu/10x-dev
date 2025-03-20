'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import * as api from '@/lib/api';

export default function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();
  
  const password = watch('password');

  const LABELS = {
    linkInv: 'Invalid Reset Link',
    resetSuccess: 'Password Reset Successful',
    newPass: 'Set New Password',
    confirm: 'Confirm New Password',
    resetBuffer: 'Resetting Password...',
    return: 'Return to login'
  };

  const msg = {
    resetInv: 'Invalid or missing reset token',
    resetSuccess: 'Password reset successful',
    resetFail: 'Failed to reset password',
    linkInv: 'The password reset link is invalid or has expired.',
    linkRequest: 'Requests a new reset link',
    success: 'Your password has been reset successfully. You will be redirected to the login page shortly.',
    passReq: 'Password is required',
    passMinLen: 'Password must be at least 3 characters',
    passMatch: 'Paswords do not match',
  }

  useEffect(() => {
    // Get token from URL query params
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const onSubmit = async (data) => {
    if (!token) {
      toast.error(msg.resetInv);
      return;
    }

    try {
      setLoading(true);
      await api.resetPasswordHandle(token, data.password);
      setSuccess(true);
      toast.success(msg.resetSuccess);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.error || msg.resetFail);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="card max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">{LABELS.linkInv}</h1>
        <p className="text-center mb-6">
          {msg.linkInv}
        </p>
        <div className="text-center">
          <Link href="/reset-password" className="btn btn-primary inline-block">
            {msg.linkRequest}
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="card max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">{LABELS.resetSuccess}</h1>
        <p className="text-center mb-6">
          {msg.success}
        </p>
        <div className="text-center">
          <Link href="/login" className="btn btn-primary inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">{LABELS.newPass}</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            New Password
          </label>
          <input
            id="password"
            type="password"
            className={`input ${errors.password ? 'border-red-500' : ''}`}
            placeholder="••••••••"
            {...register('password', { 
              required: msg.passReq,
              minLength: {
                value: 3,
                message: msg.passMinLen
              }
            })}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
            {LABELS.confirm}
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={`input ${errors.confirmPassword ? 'border-red-500' : ''}`}
            placeholder="••••••••"
            {...register('confirmPassword', { 
              validate: value => value === password || msg.passMatch
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
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
              {LABELS.resetBuffer}
            </span>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="text-sm link">
          {LABELS.return}
        </Link>
      </div>
    </div>
  );
}
