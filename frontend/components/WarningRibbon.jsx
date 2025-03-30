'use client';

import { useState } from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

export default function WarningRibbon({ message, isDismissable = true }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className="bg-yellow-100 border-1-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FaExclamationTriangle className="text-yellow-500 mr-3" />
          <p className="font-medium">{message}</p>
        </div>
        {isDismissable && (
          <button
            onClick={() => setDismissed(true)}
            className="text-yellow-700 hover:text-yellow-900"
            aria-label="Dismiss"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
}
