'use client';

import React from 'react';

export default function ApiUsageTable({ apiUsage }) {
  if (!apiUsage || apiUsage.length === 0) {
    return (
      <div className="card overflow-hidden mb-8">
        <h2 className="text-xl font-semibold mb-4">API Usage</h2>
        <p className="text-gray-500 italic">No API usage data available.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden mb-8">
      <h2 className="text-xl font-semibold mb-4">API Usage</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Endpoint
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requests
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {apiUsage.map((item, index) => (
              <tr key={`${item.method}-${item.endpoint}-${index}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${item.method === 'GET' ? 'bg-blue-100 text-blue-800' : 
                      item.method === 'POST' ? 'bg-green-100 text-green-800' : 
                      item.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' : 
                      item.method === 'DELETE' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'}`}
                  >
                    {item.method}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {item.endpoint}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {item.request_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
