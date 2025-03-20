'use client';

import { useState } from 'react';
import { formatDate, truncateText } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function RequestsTable({ requests, users }) {
  const [expandedRequest, setExpandedRequest] = useState(null);

  const getUsernameById = (id) => {
    const user = users.find(u => u.id === id);
    return user ? user.username : 'Unknown';
  };

  return (
    <div className="card overflow-hidden">
      <h2 className="text-xl font-semibold mb-4">All Requests</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prompt
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <>
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getUsernameById(request.user_id)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {truncateText(request.prompt, 50)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDate(request.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setExpandedRequest(expandedRequest === request.id ? null : request.id)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      {expandedRequest === request.id ? 'Hide Code' : 'View Code'}
                    </button>
                  </td>
                </tr>
                {expandedRequest === request.id && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4">
                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Prompt:</h3>
                        <p className="text-sm bg-gray-50 p-3 rounded">{request.prompt}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Generated Code:</h3>
                        <SyntaxHighlighter 
                          language="javascript" 
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            maxHeight: '300px',
                            overflow: 'auto',
                            fontSize: '0.8rem',
                            borderRadius: '0.375rem'
                          }}
                        >
                          {request.response}
                        </SyntaxHighlighter>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
