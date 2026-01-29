// components/ui/Toast.jsx
'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const ICONS = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
};

const COLORS = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    icon: 'text-emerald-500',
    progress: 'bg-emerald-500',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-500',
    progress: 'bg-red-500',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    icon: 'text-amber-500',
    progress: 'bg-amber-500',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-500',
    progress: 'bg-blue-500',
  },
};

export default function Toast({
  id,
  title,
  message,
  type = 'success',
  onClose,
  duration = 3000,
  autoClose = true,
}) {
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);
  
  const Icon = ICONS[type];
  const colors = COLORS[type];

  useEffect(() => {
    if (!autoClose) return;

    const startTime = Date.now();
    const interval = 50; // Update setiap 50ms untuk animasi smooth
    const totalSteps = duration / interval;
    const stepPercentage = 100 / totalSteps;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        clearInterval(timer);
        handleClose();
      } else {
        setProgress(100 - (elapsed / duration) * 100);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [duration, autoClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.(id);
    }, 300); // Tunggu animasi keluar selesai
  };

  return (
    <div
      className={`
        relative w-80 bg-white rounded-xl shadow-lg border ${colors.border}
        transform transition-all duration-300
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        animate-in slide-in-from-right fade-in
      `}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {/* Progress Bar */}
      {autoClose && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-xl overflow-hidden">
          <div
            className={`h-full ${colors.progress} transition-all duration-50`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 ${colors.icon}`}>
            <Icon className="w-6 h-6" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold ${colors.text}`}>
              {title}
            </h3>
            {message && (
              <p className="mt-1 text-sm text-gray-600 break-words">
                {message}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-2 p-1 text-gray-400 hover:text-gray-600 
                     hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close toast"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}