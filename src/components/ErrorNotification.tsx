import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorNotificationProps {
  message: string;
  onDismiss: () => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 flex items-center bg-red-50 border-l-4 border-red-500 py-2 px-3 shadow-md max-w-md animate-slide-in">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <p className="ml-3 text-sm text-red-700">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="ml-4 flex-shrink-0 text-red-500 hover:text-red-700 focus:outline-none"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ErrorNotification; 