'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as api from '@/lib/api';
import { getLanguages } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export default function ChatForm({ onCodeGenerated }) {
  const [loading, setLoading] = useState(false);
  const { updateRequestCount } = useAuth();
  const languages = getLanguages();

  const LABELS = {
    genCode: 'Generate Code',
    describeProgram: 'Describe the program you want',
    language: 'Programming Language',
    clear: 'Clear',
    genBuffer: 'Generating...',
  };

  const msg = {
    genCode: 'Code generated successfully!',
    genFail: 'Failed to generate code',
    programReq: 'Program description is required',
    languageReq: 'Language is required',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      program: '',
      language: 'JavaScript'
    }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await api.generateCode(data.program, data.language);

      if (response.data && response.data.count !== undefined) {
        updateRequestCount(response.data.count);
      }
      onCodeGenerated(response.data.code, data.language);

      toast.success(msg.genCode);
    } catch (error) {
      toast.error(error.response?.data?.error || msg.genFail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-semibold mb-4">{LABELS.genCode}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="program" className="block mb-2 text-sm font-medium">
            {LABELS.describeProgram}
          </label>
          <textarea
            id="program"
            rows={4}
            className={`input ${errors.program ? 'border-red-500' : ''}`}
            placeholder="e.g., a function to sort an array of numbers"
            {...register('program', { required: msg.programReq })}
          />
          {errors.program && (
            <p className="mt-1 text-sm text-red-500">{errors.program.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="language" className="block mb-2 text-sm font-medium">
            {LABELS.language}
          </label>
          <select
            id="language"
            className={`input ${errors.language ? 'border-red-500' : ''}`}
            {...register('language', { required: msg.languageReq })}
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          {errors.language && (
            <p className="mt-1 text-sm text-red-500">{errors.language.message}</p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => reset()}
            disabled={loading}
          >
            {LABELS.clear}
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></span>
                {LABELS.genBuffer}
              </span>
            ) : (
              'Generate Code'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
