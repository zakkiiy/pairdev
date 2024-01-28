import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  message?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-60 overflow-y-auto h-full w-full flex justify-center items-center transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto border border-gray-300">
        <p className="text-gray-800 text-lg font-semibold">{message}</p>
        <div className="flex justify-around mt-6 space-x-4">
          {onConfirm && (
            <div className="flex-1">
              <button 
                onClick={onConfirm} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
              >
                OK
              </button>
            </div>
          )}
          {onCancel && (
            <div className="flex-1">
              <button 
                onClick={onCancel} 
                className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
              >
                キャンセル
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;