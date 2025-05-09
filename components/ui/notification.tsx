import { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Notification({ message, type, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg ${
        type === 'success' 
          ? 'bg-[#bac4e0] text-[#536a86] border-2 border-[#536a86]' 
          : 'bg-red-100 text-red-800 border-2 border-red-300'
      }`}>
        {type === 'success' ? (
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        ) : (
          <AlertCircle className="w-6 h-6 text-red-600" />
        )}
        <span className="font-medium text-lg">{message}</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-opacity-10 hover:bg-[#536a86] rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
} 