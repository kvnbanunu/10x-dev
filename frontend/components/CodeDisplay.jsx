'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'react-hot-toast';

const languageMap = {
  'JavaScript': 'javascript',
  'Python': 'python',
  'Java': 'java',
  'C#': 'csharp',
  'C++': 'cpp',
  'PHP': 'php',
  'Ruby': 'ruby',
  'Swift': 'swift',
  'Kotlin': 'kotlin',
  'Go': 'go',
  'Rust': 'rust',
  'TypeScript': 'typescript',
  'HTML/CSS': 'html'
};

export default function CodeDisplay({ code, language }) {
  const [copied, setCopied] = useState(false);

  if (!code) {
    return null;
  }

  // function to removed the ticks
  const cleanCode = (code) => {
    let cleaned = code;
    cleaned = cleaned.replace(/^```[\w-]*\s*\n/m, '');
    cleaned = cleaned.replace(/\n```\s*$/m, '');
    return cleaned.trim();
  }

  const syntaxLanguage = languageMap[language] || 'javascript';
  const processedCode = cleanCode(code);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(processedCode)
      .then(() => {
        setCopied(true);
        toast.success('Code copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy code');
      });
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Generated {language} Code</h2>
        <button
          onClick={copyToClipboard}
          className="btn btn-secondary text-sm px-3 py-1"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      
      <div className="relative bg-gray-800 rounded-lg overflow-hidden">
        <SyntaxHighlighter 
          language={syntaxLanguage}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            maxHeight: '500px',
            overflow: 'auto'
          }}
        >
          {processedCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
