'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    await login(data);
    setLoading(false);
  };

  const LABELS = {
    header: 'Login to 10x Dev',
    email: 'Email',
    pass: 'Password',
    forgotPass: 'Forgot your password?',
    loginBuffer: 'Logging in...',
    noAccount: "Don't have an account? ",
    register: 'Register',
  };

  const msg = {
    emailReq: 'Email is required',
    emailInv: 'Invalid email address',
    passReq: 'Password is required',
  };

  return (
    <div className="card max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">{LABELS.header}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">{LABELS.email}</label>
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

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">{LABELS.pass}</label>
          <input
            id="password"
            type="password"
            className={`input ${errors.password ? 'border-red-500' : ''}`}
            placeholder="••••••••"
            {...register('password', { required: msg.passReq})}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div className="mb-6 text-right">
          <Link href="/reset-password" className="text-sm link">{LABELS.forgotPass}</Link>
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center">
              <span classname="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></span>
              {LABELS.loginBuffer}
            </span>
          ) : (
            'Login'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {LABELS.noAccount}
          <Link href="/register" className="link">
            {LABELS.register}
          </Link>
        </p>
      </div>
    </div>
  );
}
