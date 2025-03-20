'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const msg = {
    emailReq: 'Email is required',
    emailInv: 'Invalid email address',
    nameReq: 'Username is required',
    nameMinLen: 'Username must be at least 3 characters',
    nameMaxLen: 'Username cannot exceed 30 characters',
    passReq: 'Password is required',
    passMinLen: 'Password must be at least 3 characters',
    passMatch: 'Passwords do not match',
  };

  const LABELS = {
    createAcc: 'Create an Account',
    email: 'Email',
    name: 'Usename',
    pass: 'Password',
    confirmPass: 'Confirm Password',
    registerBuffer: 'Registering...',
    account: 'Already have an account? ',
    login: 'Login',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    await registerUser(data);
    setLoading(false);
  };

  return (
    <div className="card max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">{LABELS.createAcc}</h1>
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
          <label htmlFor="username" className="block mb-2 text-sm font-medium">{LABELS.name}</label>
          <input
            id="username"
            type="text"
            className={`input ${errors.usename ? 'border-red-500' : ''}`}
            placeHolder="john"
            {...register('username', {
              required: msg.nameReq,
              minLength: {
                value: 3,
                message: msg.nameMinLen
              },
              maxLength: {
                value: 30,
                message: msg.nameMaxLen
              }
            })}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            {LABELS.pass}
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
            {LABELS.confirmPass}
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
              {LABELS.registerBuffer}
            </span>
          ) : (
            'Register'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {LABELS.account}
          <Link href="/login" className="link">
            {LABELS.login}
          </Link>
        </p>
      </div>
    </div>
  );
}
